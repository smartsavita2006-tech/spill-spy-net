import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyVal, Meter, Modal, Panel } from "../components/ui-kit";
import { formatUtc, suspects, vesselById } from "../data/mock";

export const Route = createFileRoute("/suspects")({
  head: () => ({
    meta: [
      { title: "Suspect Ranking — Vessel Attribution SP-001" },
      {
        name: "description",
        content:
          "Ranked suspect vessels for spill SP-001 scored on proximity, temporal overlap, AIS gaps and vessel type.",
      },
      { property: "og:title", content: "Suspect Ranking — Vessel Attribution SP-001" },
      {
        property: "og:description",
        content: "Weighted suspicion scores with per-vessel attribution detail panels.",
      },
    ],
  }),
  component: SuspectsPage,
});

type SortKey = "suspicion" | "proximity" | "temporal" | "aisGap" | "vesselType";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "suspicion", label: "Suspicion" },
  { key: "proximity", label: "Proximity" },
  { key: "temporal", label: "Temporal" },
  { key: "aisGap", label: "AIS gap" },
  { key: "vesselType", label: "Vessel type" },
];

function SuspectsPage() {
  const [sort, setSort] = useState<SortKey>("suspicion");
  const [openId, setOpenId] = useState<string | null>(null);
  const ordered = [...suspects].sort((a, b) => b[sort] - a[sort]);
  const active = openId ? suspects.find((s) => s.vesselId === openId)! : null;
  const activeVessel = openId ? vesselById(openId) : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Suspect ranking</h1>
          <p className="text-sm text-muted-foreground">
            Weighted attribution across proximity, temporal overlap, AIS gap and vessel type
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                sort === s.key
                  ? "border-[var(--accent-cyan)]/60 text-[var(--accent-cyan)]"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {ordered.map((s, i) => {
          const v = vesselById(s.vesselId);
          return (
            <button
              key={s.vesselId}
              type="button"
              onClick={() => setOpenId(s.vesselId)}
              className="block w-full rounded-lg border border-border bg-card/60 px-4 py-3.5 text-left transition-colors hover:border-primary/50 hover:bg-card"
            >
              <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-lg font-semibold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-[14px] font-medium">{v.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {v.type} · MMSI {v.mmsi} · gap {v.aisGapMin} min
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Meter label="Proximity" value={s.proximity} />
                  <Meter label="Temporal" value={s.temporal} />
                  <Meter label="AIS gap" value={s.aisGap} />
                  <Meter label="Vessel type" value={s.vesselType} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums text-[var(--accent-cyan)]">
                    {s.suspicion}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    suspicion
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Panel title="Scoring method">
        <p className="text-[13px] leading-6 text-muted-foreground">
          Suspicion is a weighted blend of spatial proximity to the backtracked origin cell (35%),
          temporal overlap with the estimated release window (30%), unexplained AIS reporting gaps
          (20%) and discharge capability by vessel type (15%).
        </p>
      </Panel>

      <Modal
        open={Boolean(active)}
        onClose={() => setOpenId(null)}
        title={activeVessel?.name ?? ""}
        subtitle={active ? `Rank #${active.rank} · suspicion ${active.suspicion}` : undefined}
      >
        {active && activeVessel && (
          <>
            <p className="text-muted-foreground">{active.summary}</p>
            <div className="mt-4 space-y-3">
              <Meter label="Proximity" value={active.proximity} />
              <Meter label="Temporal" value={active.temporal} />
              <Meter label="AIS gap" value={active.aisGap} />
              <Meter label="Vessel type" value={active.vesselType} />
            </div>
            <div className="mt-4">
              <KeyVal k="MMSI" v={activeVessel.mmsi} />
              <KeyVal k="Flag" v={activeVessel.flag} />
              <KeyVal k="Speed" v={`${activeVessel.speedKn} kn`} />
              <KeyVal k="Heading" v={`${activeVessel.headingDeg}°`} />
              <KeyVal k="Last AIS report" v={formatUtc(activeVessel.lastSeen)} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
