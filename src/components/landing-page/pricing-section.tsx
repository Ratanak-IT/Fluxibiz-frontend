"use client";

import { useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Section } from "./landing-shared";

type Cycle = "monthly" | "quarterly" | "yearly";

const CYCLES: { id: Cycle; label: string; suffix: string }[] = [
  { id: "monthly", label: "Monthly", suffix: "/ mo" },
  { id: "yearly", label: "Yearly", suffix: "/ yr" },
  { id: "quarterly", label: "Quarterly", suffix: "/ qtr" },
];

interface Plan {
  id: string;
  name: string;
  tagline: string;
  prices: Record<Cycle, number>;
  features: string[];
  /** Shown as a ribbon regardless of which card is selected. */
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "counter",
    name: "Counter",
    tagline: "For a single register.",
    prices: { monthly: 29, quarterly: 79, yearly: 290 },
    features: ["1 register", "Menu & orders", "Daily sales reports"],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Best value for busy floors.",
    prices: { monthly: 59, quarterly: 159, yearly: 590 },
    features: [
      "Everything in Counter",
      "Up to 5 registers",
      "Inventory + staff",
      "Real-time dashboard",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For multi-location groups.",
    prices: { monthly: 99, quarterly: 269, yearly: 990 },
    features: ["Everything in Growth", "Unlimited locations", "API + priority support"],
  },
];

const DEFAULT_PLAN_ID = PLANS.find((plan) => plan.popular)?.id ?? PLANS[0].id;

const GUARANTEES = ["Switch or cancel anytime", "No hidden fees", "30-day money-back guarantee"];

function CycleToggle({ value, onChange }: { value: Cycle; onChange: (cycle: Cycle) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Billing cycle"
      className="mx-auto mt-8 inline-flex rounded-full border border-hairline p-1"
    >
      {CYCLES.map((cycle) => (
        <button
          key={cycle.id}
          role="tab"
          type="button"
          aria-selected={value === cycle.id}
          onClick={() => onChange(cycle.id)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            value === cycle.id
              ? "bg-brand-ink text-white"
              : "text-muted-foreground hover:text-brand-ink",
          )}
        >
          {cycle.label}
        </button>
      ))}
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  cycle: Cycle;
  selected: boolean;
  onSelect: () => void;
  onArrowKey: (direction: 1 | -1) => void;
}

function PlanCard({ plan, cycle, selected, onSelect, onArrowKey }: PlanCardProps) {
  const suffix = CYCLES.find((c) => c.id === cycle)!.suffix;

  // Roving-tabindex radio behaviour: arrows move between plans, space/enter picks one.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onArrowKey(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onArrowKey(-1);
    }
  }

  return (
    <Card
      role="radio"
      aria-checked={selected}
      aria-label={`${plan.name} plan, $${plan.prices[cycle]} ${suffix}`}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative h-full cursor-pointer gap-0 rounded-2xl p-7 outline-none",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        selected
          ? "border-brand bg-brand-soft/40 shadow-[0_24px_60px_-30px_rgba(21,128,61,0.55)] lg:-translate-y-4"
          : "border-hairline shadow-sm hover:border-brand/40 hover:shadow-md lg:translate-y-0",
      )}
    >
      {plan.popular ? (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-ink px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-ink">
          ★ Most popular
        </Badge>
      ) : null}

      <h3 className="font-display text-base font-bold text-brand-ink">{plan.name}</h3>

      <p className="mt-4 font-display text-4xl font-extrabold text-brand-ink">
        ${plan.prices[cycle]}
        <span className="ml-1 align-middle text-sm font-medium text-muted-foreground">{suffix}</span>
      </p>

      <p className="mt-4 text-xs text-muted-foreground">{plan.tagline}</p>

      <ul className="mt-5 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs text-brand-ink">
            <Check className="mt-px size-3.5 shrink-0 text-brand" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        // The card already handles selection — don't let the click bubble and re-fire it.
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "mt-8 h-11 w-full rounded-xl text-sm font-semibold transition-colors",
          selected
            ? "bg-brand text-white hover:bg-brand-deep"
            : "border border-hairline bg-white text-brand-ink hover:bg-brand-soft",
        )}
      >
        Get started
      </Button>
    </Card>
  );
}

export function PricingSection() {
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_PLAN_ID);

  function moveSelection(from: string, direction: 1 | -1) {
    const current = PLANS.findIndex((plan) => plan.id === from);
    const next = (current + direction + PLANS.length) % PLANS.length;
    setSelectedId(PLANS[next].id);
  }

  return (
    <Section id="pricing">
      <div className="text-center">
        <Badge className="gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs text-brand-ink hover:bg-brand-soft">
          <span className="size-2 rounded-full bg-brand" aria-hidden />
          Pricing
        </Badge>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-brand-deep md:text-[2.75rem]">
          Choose the plan that works for you
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Simple, honest pricing that scales with your counter — flexible, affordable, and built to
          grow with you.
        </p>
        <CycleToggle value={cycle} onChange={setCycle} />
      </div>

      <div
        role="radiogroup"
        aria-label="Subscription plan"
        className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-3"
      >
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            selected={plan.id === selectedId}
            onSelect={() => setSelectedId(plan.id)}
            onArrowKey={(direction) => moveSelection(plan.id, direction)}
          />
        ))}
      </div>

      <ul className="mt-12 flex flex-wrap items-center justify-center gap-6">
        {GUARANTEES.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-4 items-center justify-center rounded-sm bg-brand-ink">
              <Check className="size-3 text-white" aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
