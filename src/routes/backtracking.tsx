import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Marker, OceanMap, pathFrom } from "../components/OceanMap";
import { KeyVal, Panel, Stat } from "../components/ui-kit";
import { detection, driftPath, formatUtc, probableOrigin } from "../data/mock";

export const Route = createFileRoute("/backtracking")({
  head: () => ({
    meta: [
      { title: "Drift Backtracking — Spill SP-001" },
      {
        name: "description",
        content:
          "Reverse-drift model for spill SP-001 with a time slider from detection back to the probable release point.",
      },
      { property: "og:title", content: "Drift Backtracking — Spill SP-001" },
      {
        property: "og:description",
        content: "Scrub the drift timeline to see the backtracked slick position and origin cell.",
      },
    ],
  }),
  component: BacktrackingPage,
});

const MAX_H = driftPath[driftPath.length - 1]!.hoursAgo;

function BacktrackingPage() {
  const [hours, setHours] = useState(0);
  const idx = Math.round(hours);
  const point = driftPath[idx]!;
  const visible = driftPath.slice(0, idx + 1);
  const detectedMs = new Date(detection.detectedAt).getTime();
  const stamp = new Date(detectedMs - hours * 3600_000).toISOString();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Drift backtracking</h1>
        <p className="text-sm text-muted-foreground">
          Reverse Lagrangian advection · surface current 0.34 m/s bearing 246° · 3% wind leeway
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel title="Reverse drift model">
          <OceanMap
            height={470}
            legend={
              <div className="space-y-1">
                <div>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                  Detected slick (t=0)
                </div>
                <div>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--accent-amber)]" />
                  Probable origin (t−9h)
                </div>
              </div>
            }
          >
            <path
              d={pathFrom(driftPath.map((p) => [p.lon, p.lat]))}
              fill="none"
              stroke="var(--map-label)"
              strokeWidth={1}
              strokeDasharray="4 6"
              opacity={0.35}
            />
            <path
              d={pathFrom(visible.map((p) => [p.lon, p.lat]))}
              fill="none"
              stroke="var(--accent-amber)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Marker lon={detection.longitude} lat={detection.latitude} label="Detected slick" />
            <Marker
              lon={probableOrigin.lon}
              lat={probableOrigin.lat}
              color="var(--accent-amber)"
              label="Probable origin"
            />
            <Marker lon={point.lon} lat={point.lat} color="var(--accent-blue)" pulse active />
          </OceanMap>

          <div className="mt-5">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="uppercase tracking-[0.16em] text-muted-foreground">
                Backtrack time
              </span>
              <span className="tabular-nums text-foreground">
                t − {hours.toFixed(0)} h · {formatUtc(stamp)}
              </span>
            </div>
            <input
              type="range"
              className="om-range mt-3"
              min={0}
              max={MAX_H}
              step={1}
              value={hours}
              aria-label="Backtrack time in hours"
              style={{ ["--fill" as string]: `${(hours / MAX_H) * 100}%` }}
              onChange={(e) => setHours(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>t − 0 h (detection)</span>
              <span>t − {MAX_H} h (origin)</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setHours(0)}
                className="rounded-md border border-border px-3 py-1.5 text-[11px] transition-colors hover:border-primary/60 hover:text-primary"
              >
                Jump to detection
              </button>
              <button
                type="button"
                onClick={() => setHours(MAX_H)}
                className="rounded-md border border-border px-3 py-1.5 text-[11px] transition-colors hover:border-primary/60 hover:text-primary"
              >
                Jump to origin
              </button>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Position at selected time">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Latitude" value={point.lat.toFixed(3)} />
              <Stat label="Longitude" value={point.lon.toFixed(3)} />
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">{point.label}</p>
          </Panel>

          <Panel title="Probable origin">
            <KeyVal k="Position" v={`${probableOrigin.lat}, ${probableOrigin.lon}`} />
            <KeyVal k="Radius" v={`${probableOrigin.radiusKm} km`} />
            <KeyVal k="Window start" v={formatUtc(probableOrigin.windowStart)} />
            <KeyVal k="Window end" v={formatUtc(probableOrigin.windowEnd)} />
            <KeyVal k="Model steps" v={`${driftPath.length} hourly`} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
