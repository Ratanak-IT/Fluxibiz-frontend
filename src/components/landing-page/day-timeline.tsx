import {
  BarChart3,
  Box,
  Lock,
  Moon,
  Sun,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { RuledEyebrow, Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

type Tone = "brand" | "amber" | "rose";

interface Step {
  title: string;
  body: string;
  icon: LucideIcon;
  tone: Tone;
}

const steps: Step[] = [
  {
    title: "Open the doors",
    body: "Start your day with everything ready to go. Track your opening cash and get to work without the paperwork.",
    icon: Sun,
    tone: "brand",
  },
  {
    title: "Sell smarter",
    body: "Whether you run a retail store or restaurant, manage every sale from one simple place.",
    icon: Utensils,
    tone: "amber",
  },
  {
    title: "Stay in control of your stock",
    body: "Track stock in real time, get alerts when products are running low, and reorder in a few clicks.",
    icon: Box,
    tone: "rose",
  },
  {
    title: "Know your business",
    body: "See sales, inventory, expenses, and business performance from one dashboard, so you can make better decisions with confidence.",
    icon: BarChart3,
    tone: "brand",
  },
  {
    title: "End your day with clarity",
    body: "End your day knowing exactly what happened. Review sales, payments, cash flow, and inventory in one place.",
    icon: Moon,
    tone: "amber",
  },
  {
    title: "Close the register",
    body: "Cash out with a single tap and back up the day securely—tomorrow opens exactly where today left off.",
    icon: Lock,
    tone: "rose",
  },
];

const tones = {
  brand: {
    bubble: "bg-brand",
    ring: "bg-brand/12",
    title: "text-brand-deep",
    stroke: "var(--brand)",
  },
  amber: {
    bubble: "bg-secondary",
    ring: "bg-secondary/18",
    title: "text-[#e9a900] dark:text-secondary",
    stroke: "var(--secondary)",
  },
  rose: {
    bubble: "bg-rose",
    ring: "bg-rose/14",
    title: "text-rose",
    stroke: "var(--accent-rose)",
  },
} satisfies Record<Tone, Record<string, string>>;

function Connector({
  index,
  stroke,
}: {
  index: number;
  stroke: string;
}) {
  const bubbleStartsOnLeft = index % 2 === 0;

  const path = bubbleStartsOnLeft
    ? "M130 0 C240 70, 720 35, 870 140"
    : "M870 0 C760 70, 280 35, 130 140";

  return (
    <ScrollReveal
      direction="up"
      className="pointer-events-none relative z-0 hidden h-28 overflow-visible md:block lg:h-32"
    >
      <svg
        viewBox="0 0 1000 140"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray="5 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.75"
        />
      </svg>
    </ScrollReveal>
  );
}

function MobileConnector({ stroke }: { stroke: string }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[128px] z-0 h-24 -translate-x-1/2 border-l-2 border-dashed md:hidden"
      style={{
        borderColor: stroke,
        opacity: 0.65,
      }}
      aria-hidden="true"
    />
  );
}

function StepBubble({
  step,
  index,
}: {
  step: Step;
  index: number;
}) {
  const Icon = step.icon;
  const style = tones[step.tone];

  return (
    <ScrollReveal
      direction="scale"
      className="relative z-10 flex justify-center md:block"
    >
      <div
        className={`relative flex size-32 items-center justify-center rounded-full p-3 sm:size-36 lg:size-40 ${style.ring}`}
      >
        <div
          className={`flex size-full items-center justify-center rounded-full text-white shadow-lg shadow-black/10 ${style.bubble}`}
        >
          <Icon className="size-12 stroke-[1.8] lg:size-14" />
        </div>

        <span
          className={`absolute left-0 top-1 flex size-9 items-center justify-center rounded-full border border-border bg-card text-sm font-bold shadow-md ${style.title}`}
        >
          {index + 1}
        </span>
      </div>
    </ScrollReveal>
  );
}

function TimelineStep({
  step,
  index,
  nextStroke,
}: {
  step: Step;
  index: number;
  nextStroke?: string;
}) {
  const bubbleOnLeft = index % 2 === 0;
  const style = tones[step.tone];

  const copy = (
    <ScrollReveal
      direction={bubbleOnLeft ? "right" : "left"}
      delay={100}
      className="relative z-10 max-w-2xl text-center md:text-left"
    >
      <h3
        className={`font-display text-2xl font-bold sm:text-3xl ${style.title}`}
      >
        {step.title}
      </h3>

      <p className="mt-3 text-base leading-8 text-muted-foreground sm:text-lg">
        {step.body}
      </p>
    </ScrollReveal>
  );

  return (
    <div className="relative grid items-center gap-7 md:grid-cols-[1fr_1.45fr] md:gap-16">
      {nextStroke ? <MobileConnector stroke={nextStroke} /> : null}

      {bubbleOnLeft ? (
        <>
          <div className="relative z-10 flex justify-center md:justify-start md:pl-8 lg:pl-20">
            <StepBubble step={step} index={index} />
          </div>

          {copy}
        </>
      ) : (
        <>
          <div className="order-2 relative z-10 md:order-1 md:pl-8 lg:pl-20">
            {copy}
          </div>

          <div className="order-1 relative z-10 flex justify-center md:order-2 md:justify-end md:pr-8 lg:pr-20">
            <StepBubble step={step} index={index} />
          </div>
        </>
      )}
    </div>
  );
}

export function DayTimeline() {
  return (
    <Section className="overflow-hidden bg-card py-24 md:py-32">
      <ScrollReveal className="text-center">
        <RuledEyebrow>From open to close</RuledEyebrow>

        <h2 className="mt-5 font-display text-4xl font-extrabold text-brand-deep sm:text-5xl lg:text-6xl">
          A day with FluxiBiz
        </h2>

        <p className="mt-4 text-base text-muted-foreground sm:text-xl">
          One shift. One screen. Zero guesswork.
        </p>
      </ScrollReveal>

      <ol className="relative mx-auto mt-20 max-w-6xl md:mt-28">
        {steps.map((step, index) => {
          const nextStep = steps[index + 1];

          const nextStroke = nextStep
            ? tones[nextStep.tone].stroke
            : undefined;

          return (
            <li key={step.title} className="relative">
              <TimelineStep
                step={step}
                index={index}
                nextStroke={nextStroke}
              />

              {nextStroke ? (
                <Connector index={index} stroke={nextStroke} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}