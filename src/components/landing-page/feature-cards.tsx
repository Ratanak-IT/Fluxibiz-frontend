import { Card } from "@/components/ui/card";
import {
  Accent,
  LANDING_IMAGES,
  Section,
  SectionHeading,
} from "./landing-shared";
import { EditableImage } from "./editable-image";

const FEATURES = [
  {
    title: "Dynamic business",
    body: "A fast, intuitive point-of-sale built for front-of-house speed — take orders, split bills, and serve with zero friction.",
    image: LANDING_IMAGES.features.pos,
    alt: "Waiter taking an order on a tablet at a café table",
  },
  {
    title: "Inventory management",
    body: "Track stock in real time — monitor ingredients, automate reorders, and cut waste with recipe-level counts.",
    image: LANDING_IMAGES.features.inventory,
    alt: "Inventory analytics overview with turnover charts",
  },
  {
    title: "Clean dashboard",
    body: "Stay in control with insights across every location — from sales to inventory, all in one clear view.",
    image: LANDING_IMAGES.features.dashboard,
    alt: "Owner reviewing sales reports on a laptop in an office",
  },
];

export function FeatureCards() {
  return (
    <Section id="features">
      <SectionHeading
        align="center"
        description="Everything you need to run your business smoothly. Three things that make your business easier to manage."
      >
        <Accent>Everything</Accent> a till should do — and the back office too
      </SectionHeading>

      <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <li key={feature.title}>
            <Card className="h-full gap-0 rounded-2xl border-hairline p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-amber text-xs font-semibold text-amber">
                  {index + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-amber">{feature.title}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>

              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-xl bg-brand-soft">
                <EditableImage
                  src={feature.image}
                  alt={feature.alt}
                  label={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
