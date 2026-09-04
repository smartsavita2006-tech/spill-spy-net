import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Marker, OceanMap, project } from "../components/OceanMap";
import { KeyVal, Modal, Panel, Stat, StatusDot } from "../components/ui-kit";
import { detection, formatUtc, spillPolygon } from "../data/mock";

export const Route = createFileRoute("/satellite")({
  head: () => ({
    meta: [
      { title: "Satellite Analysis — Spill SP-001" },
      {
        name: "description",
        content:
          "SAR-style satellite view of spill SP-001: 12.4 km² slick at 15.234, 72.451 with 94% detection confidence.",
      },
      { property: "og:title", content: "Satellite Analysis — Spill SP-001" },
      {
        property: "og:description",
        content: "Interactive SAR scene with slick polygon, confidence and detection metadata.",
      },
    ],
  }),
  component: SatellitePage,
});

const spillD =
  spillPolygon.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).join(" ")}`).join(" ") +
  " Z";

function SatellitePage() {
  const [open, setOpen] = useState(false);
  const [showPolygon, setShowPolygon] = useState(true);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Satellite analysis</h1>
          <p className="text-sm text-muted-foreground">
            Synthetic aperture radar scene · descending pass · VV polarisation
          </p>
        </div>
        <StatusDot label={detection.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel
          title="SAR scene"
          action={
            <button
              type="button"
              onClick={() => setShowPolygon((s) => !s)}
              className="rounded-md border border-border px-2.5 py-1 text-[11px] transition-colors hover:border-primary/60 hover:text-primary"
            >
              {showPolygon ? "Hide slick outline" : "Show slick outline"}
            </button>
          }
        >
          <OceanMap
            height={520}
            initialZoom={1.6}
            initialCenter={[detection.longitude, detection.latitude]}
            legend={
              <div>
                Scene S1A_IW_GRDH · {formatUtc(detection.detectedAt)}
                <div className="mt-1">Dark slick signature vs. ambient sea clutter</div>
              </div>
            }
          >
            <g opacity={0.55}>
              {Array.from({ length: 26 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx={120 + ((i * 137) % 800)}
                  cy={80 + ((i * 211) % 470)}
                  rx={30 + ((i * 17) % 45)}
                  ry={14 + ((i * 11) % 22)}
                  fill="oklch(0.32 0.03 240 / 0.35)"
                />
              ))}
            </g>
            {showPolygon && (
              <>
                <path d={spillD} fill="oklch(0.1 0.02 250 / 0.85)" stroke="var(--accent-cyan)" strokeWidth={2} />
                <path d={spillD} fill="none" stroke="var(--accent-cyan)" strokeWidth={6} opacity={0.14} />
              </>
            )}
            <Marker
              lon={detection.longitude}
              lat={detection.latitude}
              pulse
              label={`${detection.id} · ${detection.areaKm2} km²`}
            />
          </OceanMap>
        </Panel>

        <div className="space-y-5">
          <Panel title="Detection record">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Latitude" value={detection.latitude} />
              <Stat label="Longitude" value={detection.longitude} />
              <Stat label="Area" value={`${detection.areaKm2} km²`} />
              <Stat label="Confidence" value={`${detection.confidence}%`} />
              <Stat label="Estimated age" value={detection.estimatedAge} />
              <Stat label="Status" value={detection.status} />
            </div>
            <div className="mt-4">
              <KeyVal k="Detected at" v={formatUtc(detection.detectedAt)} />
              <KeyVal k="Detection ID" v={detection.id} />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              View details
            </button>
          </Panel>

          <Panel title="Classifier notes">
            <p className="text-[13px] leading-6 text-muted-foreground">
              Low-backscatter region persists across two consecutive passes with a wind speed of
              4.8 m/s, ruling out a low-wind look-alike. Edge gradient and elongation are consistent
              with a fresh mineral-oil discharge trailing the prevailing current.
            </p>
          </Panel>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Detection ${detection.id}`}
        subtitle="Full satellite analysis record"
      >
        <KeyVal k="Coordinates" v={`${detection.latitude}, ${detection.longitude}`} />
        <KeyVal k="Area" v={`${detection.areaKm2} km²`} />
        <KeyVal k="Confidence" v={`${detection.confidence}%`} />
        <KeyVal k="Estimated age" v={detection.estimatedAge} />
        <KeyVal k="Detected at" v={formatUtc(detection.detectedAt)} />
        <KeyVal k="Status" v={detection.status} />
        <KeyVal k="Sensor" v="Sentinel-1A IW GRDH (VV)" />
        <KeyVal k="Look-alike check" v="Passed — wind 4.8 m/s" />
        <p className="mt-4 text-[13px] leading-6 text-muted-foreground">
          The slick polygon spans 8 vertices with a major axis of roughly 7.1 km. Attribution has
          been forwarded to drift backtracking and AIS correlation.
        </p>
      </Modal>
    </div>
  );
}
