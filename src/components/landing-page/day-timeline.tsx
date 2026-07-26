import { Card } from "@/components/ui/card";
import { RuledEyebrow, Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

type Tone = "brand" | "amber" | "rose";

interface Step {
  title: string;
  body: string;
  illustration: string;
  tone: Tone;
}

const steps: Step[] = [
  {
    title: "Open the doors",
    body: "Track your opening cash and get to work — no paperwork needed.",
    illustration: "image/landing/open-door.png",
    tone: "brand",
  },
  {
    title: "Sell smarter",
    body: "Manage every sale from one simple place, in-store or online.",
    illustration: "image/landing/sale.png",
    tone: "amber",
  },
  {
    title: "Stay in control of your stock",
    body: "Real-time stock levels, low-stock alerts, and quick reorders.",
    illustration: "image/landing/stock.png",
    tone: "rose",
  },
  {
    title: "Know your business",
    body: "Sales and performance in one clear dashboard.",
    illustration: "image/landing/dashboard.png",
    tone: "brand",
  },
  {
    title: "End your day with clarity",
    body: "Review sales, payments, and cash flow before you close up.",
    illustration: "image/landing/cash-flow.png",
    tone: "amber",
  },
  {
    title: "Close the register",
    body: "Cash out with a tap — tomorrow picks up right where today left off.",
    illustration: "image/landing/close.png",
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

function DiagonalConnector({ stroke, index }: { stroke: string; index: number }) {
  const startLeft = index % 2 === 0;
  const path = startLeft
    ? "M130 0C300 70 680 30 870 140"
    : "M870 0C680 70 300 30 130 140";

  return (
    <svg
      viewBox="0 0 1000 140"
      preserveAspectRatio="none"
      className="pointer-events-none relative z-0 hidden h-28 w-full overflow-visible sm:block md:h-32"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
        opacity="0.3"
      />
      <path
        className="connector-dash"
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray="2 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.85"
      />
    </svg>
  );
}

function MobileConnector({ stroke }: { stroke: string }) {
  return (
    <div className="flex justify-center py-2 sm:hidden" aria-hidden="true">
      <div
        className="connector-dash-vertical h-10 w-1"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${stroke} 0 5px, transparent 5px 13px)`,
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const style = tones[step.tone];
  const alignRight = index % 2 === 1;

  return (
    <ScrollReveal
      direction="up"
      delay={index * 80}
      className={alignRight ? "sm:ml-auto sm:w-[54%]" : "sm:mr-auto sm:w-[54%]"}
    >
      {/* CARD CONTAINER: White background */}
      <Card className="group relative overflow-hidden rounded-3xl border-[0.5px] border-hairline bg-white p-7  transition-all duration-500 ease-out sm:p-8">
        <div
          className={`flex flex-col items-stretch gap-6 sm:flex-row ${
            alignRight ? "sm:flex-row-reverse" : ""
          }`}
        >
          {/* ILLUSTRATION CONTAINER: White background */}
          <div className="relative flex min-h-[160px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 sm:w-1/2 sm:min-h-[200px]">
            <img
              src={step.illustration}
              alt={step.title}
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Step badge overlay */}
            <span
              className={`absolute left-3 top-3 flex size-8 items-center justify-center rounded-full border border-border bg-card text-xs font-bold shadow-sm ${style.title}`}
            >
              {index + 1}
            </span>
          </div>

          {/* Text block matching height */}
          <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
            <div
              className="flex items-center justify-center gap-2 sm:justify-start"
              aria-hidden
            >
              <span className={` ${style.bubble}`} />
            </div>

            <h3
              className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${style.title}`}
            >
              {step.title}
            </h3>

            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {step.body}
            </p>
          </div>
        </div>
      </Card>
    </ScrollReveal>
  );
}

export function DayTimeline() {
  return (
    /* WHOLE SECTION CONTAINER: Whitesmoke background */
    <Section className="overflow-hidden bg-[#f5f5f5] py-24 md:py-32">
      <ScrollReveal className="text-center">
        <RuledEyebrow>From open to close</RuledEyebrow>

        <h2 className="mt-5 font-display text-4xl font-extrabold text-brand-deep sm:text-5xl lg:text-6xl">
          A day with FluxiBiz POS
        </h2>

        <p className="mt-4 text-base text-muted-foreground sm:text-xl">
          One shift. One screen. Zero guesswork.
        </p>
      </ScrollReveal>

      <ol className="relative mx-auto mt-16 max-w-5xl md:mt-20">
        {steps.map((step, index) => {
          const nextStep = steps[index + 1];

          return (
            <li key={step.title}>
              <StepCard step={step} index={index} />

              {nextStep ? (
                <>
                  <DiagonalConnector
                    stroke={tones[nextStep.tone].stroke}
                    index={index}
                  />
                  <MobileConnector stroke={tones[nextStep.tone].stroke} />
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}