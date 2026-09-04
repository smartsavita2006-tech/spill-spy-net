import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Marker, OceanMap, pathFrom } from "../components/OceanMap";
import { KeyVal, Modal, Panel } from "../components/ui-kit";
import { detection, formatUtc, probableOrigin, suspects, vessels } from "../data/mock";

export const Route = createFileRoute("/ais")({
  head: () => ({
    meta: [
      { title: "AIS Vessel Analysis — Spill SP-001" },
      {
        name: "description",
        content:
          "Correlate AIS vessel tracks with the backtracked origin cell of spill SP-001 and inspect candidate vessels.",
      },
      { property: "og:title", content: "AIS Vessel Analysis — Spill SP-001" },
      {
        property: "og:description",
        content: "Candidate vessel tracks, reporting gaps and selection details on an interactive map.",
      },
    ],
  }),
  component: AisPage,
});

function AisPage() {
  const [selectedId, setSelectedId] = useState<string>(vessels[0].id);
  const [open, setOpen] = useState(false);
  const selected = vessels.find((v) => v.id === selectedId)!;
  const score = suspects.find((s) => s.vesselId === selectedId);

  const select = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">AIS vessel analysis</h1>
        <p className="text-sm text-muted-foreground">
          {vessels.length} candidate vessels within the drift envelope during the release window
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel title="AIS tracks">
          <OceanMap
            height={490}
            legend={
              <div>
                Track history 12 h · dashed segments indicate reporting gaps
                <div className="mt-1">Click a vessel marker to open its record</div>
              </div>
            }
          >
            <Marker lon={detection.longitude} lat={detection.latitude} label="SP-001" pulse />
            <Marker
              lon={probableOrigin.lon}
              lat={probableOrigin.lat}
              color="var(--accent-amber)"
              label="Origin cell"
            />
            {vessels.map((v) => {
              const last = v.track[v.track.length - 1];
              const active = v.id === selectedId;
              return (
                <g key={v.id}>
                  <path
                    d={pathFrom(v.track)}
                    fill="none"
                    stroke={active ? "var(--accent-cyan)" : "var(--accent-blue)"}
                    strokeWidth={active ? 2 : 1.2}
                    strokeDasharray={v.aisGapMin > 30 ? "7 5" : undefined}
                    opacity={active ? 1 : 0.45}
                  />
                  <Marker
                    lon={last[0]}
                    lat={last[1]}
                    color={active ? "var(--accent-cyan)" : "var(--accent-blue)"}
                    active={active}
                    label={v.name}
                    onClick={() => select(v.id)}
                  />
                </g>
              );
            })}
          </OceanMap>
        </Panel>

        <Panel title="Candidate vessels">
          <ul className="space-y-2">
            {vessels.map((v) => {
              const active = v.id === selectedId;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => select(v.id)}
                    className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-[--accent-cyan]/60 bg-secondary"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-medium">{v.name}</span>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {v.speedKn} kn
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {v.type} · gap {v.aisGapMin} min
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open {selected.name}
          </button>
        </Panel>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selected.name}
        subtitle={`MMSI ${selected.mmsi} · ${selected.flag}`}
      >
        <KeyVal k="Type" v={selected.type} />
        <KeyVal k="Speed" v={`${selected.speedKn} kn`} />
        <KeyVal k="Heading" v={`${selected.headingDeg}°`} />
        <KeyVal k="Last AIS report" v={formatUtc(selected.lastSeen)} />
        <KeyVal k="Reporting gap" v={`${selected.aisGapMin} min`} />
        <KeyVal k="Track points" v={selected.track.length} />
        {score && <KeyVal k="Suspicion score" v={score.suspicion} />}
        {score && <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{score.summary}</p>}
      </Modal>
    </div>
  );
}
