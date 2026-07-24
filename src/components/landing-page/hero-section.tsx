import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GLANCE_ROWS = [
  { label: "Orders", value: "124", dot: "bg-brand" },
  { label: "Stock synced", value: "86 SKUs", dot: "bg-brand" },
  { label: "Revenue", value: "$2,410", dot: "bg-amber" },
] as const;

/** Sparkline for the "Today, at a glance" card. Static by design — it's a preview, not live data. */
function Sparkline() {
  return (
    <svg viewBox="0 0 220 60" className="h-14 w-full" role="img" aria-label="Orders trend, last 7 days">
      <polyline
        points="0,42 32,20 64,8 96,26 128,34 160,22 192,40 220,10"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlanceCard() {
  return (
    <Card className="w-[280px] rotate-[-1deg] gap-0 rounded-2xl border-hairline p-5 shadow-[0_24px_60px_-24px_rgba(15,36,23,0.35)] sm:w-[320px]">
      <div className="mb-4 flex gap-1.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="size-1.5 rounded-full bg-hairline" />
        ))}
      </div>

      <h3 className="font-display text-lg font-bold text-brand-ink">Today, at a glance</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        FluxiBiz · all systems synced
      </p>

      <div className="mt-5 space-y-3">
        <Row {...GLANCE_ROWS[0]} />
        <Sparkline />
        <Row {...GLANCE_ROWS[1]} />
        <Row {...GLANCE_ROWS[2]} />
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-brand-ink pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-ink">
          Net today
        </span>
        <span className="font-display text-2xl font-bold text-brand-ink">$2,410</span>
      </div>
    </Card>
  );
}

function Row({ label, value, dot }: { label: string; value: string; dot: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-brand-ink">
        <span className={`size-2 rounded-full ${dot}`} aria-hidden />
        {label}
      </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

function MonthCard() {
  return (
    <Card className="absolute -bottom-10 -right-2 w-[190px] gap-0 rounded-xl border-hairline p-4 shadow-[0_20px_45px_-20px_rgba(15,36,23,0.4)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          This month
        </span>
        <span className="flex items-center gap-1 text-[10px] text-brand">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
          live
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-bold text-brand-ink">
        $11,284<span className="text-muted-foreground">.50</span>
      </p>
      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden>
        {[35, 55, 45, 70, 100, 60].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-sm ${h === 100 ? "bg-brand-deep" : "bg-brand/15"}`}
          />
        ))}
      </div>
    </Card>
  );
}

/** The soft green wave that closes the hero and hands off to the next section. */
function HeroWave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden>
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="h-24 w-full md:h-36">
        <path
          d="M0 78C240 118 420 34 720 58s480 84 720 44v58H0z"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeDasharray="6 7"
          opacity="0.5"
        />
        <path d="M0 96C240 136 420 52 720 76s480 84 720 44v40H0z" fill="var(--brand)" />
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-32 pt-14 md:pb-44 md:pt-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div>
          <Badge className="gap-2 rounded-full bg-brand-soft py-1 pl-1 pr-3 text-brand-ink hover:bg-brand-soft">
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              News
            </span>
            <span className="text-xs font-medium">Explore our new AI features</span>
          </Badge>

          <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-brand-ink md:text-[3.5rem]">
            Run your whole{" "}
            <span className="relative inline-block">
              Business
              <span
                className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-amber"
                aria-hidden
              />
            </span>{" "}
            <em className="font-serif italic text-brand-deep">from</em>{" "}
            <em className="font-serif italic text-amber">One</em>{" "}
            <em className="font-serif italic text-brand">screen</em>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            The all-in-one system built to help small teams take orders, track stock, and grow
            revenue — without the complexity.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button
              size="lg"
              className="h-12 rounded-full bg-brand-deep px-7 text-sm font-semibold hover:bg-brand-ink"
            >
              Start a free trial
            </Button>
            <a
              href="#features"
              className="group inline-flex items-center gap-2 border-b-2 border-amber pb-0.5 text-sm font-medium text-brand-ink"
            >
              Learn more
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* ── Preview cluster ──────────────────────────────────── */}
        <div className="relative mx-auto w-fit lg:mr-0">
          <span className="absolute -left-6 -top-6 z-10 -rotate-6 rounded-md bg-brand-deep px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber shadow-lg">
            +18% this week
          </span>
          <GlanceCard />
          <span className="absolute -left-16 bottom-16 hidden items-center gap-1 rounded-full bg-amber px-3 py-1.5 text-[11px] font-semibold text-brand-ink shadow-md sm:inline-flex">
            Synced <Check className="size-3" />
          </span>
          <MonthCard />
        </div>
      </div>

      <HeroWave />
    </section>
  );
}
