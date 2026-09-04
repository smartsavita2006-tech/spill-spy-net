import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Marker, OceanMap, pathFrom, project } from "../components/OceanMap";
import { KeyVal, Modal, Panel, Stat, StatusDot } from "../components/ui-kit";
import {
  detection,
  driftPath,
  formatUtc,
  probableOrigin,
  spillPolygon,
  suspects,
  vesselById,
  vessels,
} from "../data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Oil Spill Detection & Vessel Attribution" },
      {
        name: "description",
        content:
          "Live overview of active oil spill SP-001 in the Arabian Sea with probable origin and top suspect vessel.",
      },
      { property: "og:title", content: "Overview — Oil Spill Detection Console" },
      {
        property: "og:description",
        content: "Active spill summary, probable release origin and leading suspect vessel.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const top = suspects[0];
  const topVessel = vesselById(top.vesselId);
  const spillD =
    spillPolygon.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).join(" ")}`).join(" ") +
    " Z";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Operations overview</h1>
          <p className="text-sm text-muted-foreground">
            Arabian Sea sector · one active detection under attribution review
          </p>
        </div>
        <StatusDot label={`${detection.id} ${detection.status}`} />
      </div>

      <Panel className="overflow-hidden">
        <OceanMap
          height={430}
          legend={
            <div className="space-y-1">
              <div>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[--accent-cyan]" />
                Detected slick
              </div>
              <div>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[--accent-amber]" />
                Probable origin
              </div>
              <div>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[--accent-blue]" />
                AIS vessels
              </div>
            </div>
          }
        >
          <path d={spillD} fill="var(--accent-cyan)" fillOpacity={0.16} stroke="var(--accent-cyan)" strokeWidth={1.6} />
          <path
            d={pathFrom(driftPath.map((p) => [p.lon, p.lat]))}
            fill="none"
            stroke="var(--accent-amber)"
            strokeWidth={1.4}
            strokeDasharray="6 5"
            opacity={0.8}
          />
          <Marker lon={detection.longitude} lat={detection.latitude} pulse label="SP-001" />
          <Marker
            lon={probableOrigin.lon}
            lat={probableOrigin.lat}
            color="var(--accent-amber)"
            label="Probable origin"
          />
          {vessels.map((v) => {
            const last = v.track[v.track.length - 1];
            return (
              <g key={v.id}>
                <path
                  d={pathFrom(v.track)}
                  fill="none"
                  stroke="var(--accent-blue)"
                  strokeWidth={1}
                  opacity={selected === v.id ? 0.9 : 0.4}
                />
                <Marker
                  lon={last[0]}
                  lat={last[1]}
                  color="var(--accent-blue)"
                  active={selected === v.id}
                  label={selected === v.id ? v.name : undefined}
                  onClick={() => setSelected(selected === v.id ? null : v.id)}
                />
              </g>
            );
          })}
        </OceanMap>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {selected
            ? `Selected ${vesselById(selected).name} · MMSI ${vesselById(selected).mmsi}`
            : "Click a vessel marker to select it."}
        </p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Active spill">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Detection" value={detection.id} hint={detection.status} />
            <Stat label="Area" value={`${detection.areaKm2} km²`} hint="SAR derived" />
            <Stat label="Confidence" value={`${detection.confidence}%`} />
            <Stat label="Age" value={detection.estimatedAge} />
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Detected {formatUtc(detection.detectedAt)} at {detection.latitude}, {detection.longitude}
          </p>
        </Panel>

        <Panel title="Probable origin">
          <KeyVal k="Position" v={`${probableOrigin.lat}, ${probableOrigin.lon}`} />
          <KeyVal k="Uncertainty" v={`${probableOrigin.radiusKm} km radius`} />
          <KeyVal
            k="Release window"
            v={`${formatUtc(probableOrigin.windowStart).slice(11)} – ${formatUtc(probableOrigin.windowEnd).slice(11)}`}
          />
          <Link
            to="/backtracking"
            className="mt-4 inline-flex rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:border-primary/60 hover:text-primary"
          >
            Open drift backtracking
          </Link>
        </Panel>

        <Panel title="Top suspect vessel">
          <div className="text-base font-medium">{topVessel.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {topVessel.type} · MMSI {topVessel.mmsi} · {topVessel.flag}
          </div>
          <div className="mt-3 text-3xl font-semibold tabular-nums text-[--accent-cyan]">
            {top.suspicion}
            <span className="ml-1 text-sm text-muted-foreground">suspicion</span>
          </div>
          <button
            type="button"
            onClick={() => setModal(true)}
            className="mt-4 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View attribution
          </button>
        </Panel>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={topVessel.name}
        subtitle={`Attribution summary · rank #${top.rank}`}
      >
        <p className="text-muted-foreground">{top.summary}</p>
        <div className="mt-4">
          <KeyVal k="MMSI" v={topVessel.mmsi} />
          <KeyVal k="Type" v={topVessel.type} />
          <KeyVal k="Flag" v={topVessel.flag} />
          <KeyVal k="Last AIS" v={formatUtc(topVessel.lastSeen)} />
          <KeyVal k="AIS gap" v={`${topVessel.aisGapMin} min`} />
          <KeyVal k="Suspicion" v={top.suspicion} />
        </div>
        <Link
          to="/suspects"
          onClick={() => setModal(false)}
          className="mt-4 inline-flex rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:border-primary/60 hover:text-primary"
        >
          Open suspect ranking
        </Link>
      </Modal>
    </div>
  );
}
