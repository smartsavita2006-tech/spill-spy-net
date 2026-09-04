import { useEffect, type ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-border bg-card/60 ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="border-l border-border/70 pl-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-medium tabular-nums text-foreground">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-[var(--accent-cyan)] transition-[width] duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function StatusDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-cyan)]/40 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-[var(--accent-cyan)]">
      <span className="om-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
      {label}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="om-fade absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="om-rise relative z-10 w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            Close
          </button>
        </header>
        <div className="max-h-[65vh] overflow-y-auto px-5 py-4 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function KeyVal({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/50 py-1.5 last:border-0">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{k}</span>
      <span className="tabular-nums text-foreground">{v}</span>
    </div>
  );
}
