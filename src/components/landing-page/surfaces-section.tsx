import { Card } from "@/components/ui/card";
import {
  Eyebrow,
  Section,
} from "./landing-shared";
import { EditableImage } from "./editable-image";
import { ScrollReveal } from "./scroll-reveal";

const SURFACES = [
  {
    index: "01",
    kicker: "Back office",
    title: "POS dashboard",
    body: "The restaurant back office: sales terminal, menu and product management, orders, invoices, and staff.",
    image: "https://loyverse.com/sites/all/themes/loyversecom/images/product/download/br/main-pos.webp",
    alt: "POS dashboard with product grid and order list",
  },
  {
    index: "02",
    kicker: "Storefront",
    title: "Mini website",
    body: "A customer-facing online shop for every business on FluxiBiz - product grid, categories, search, and ordering.",
    image: "/image/landing/card/mini_website.png",
    alt: "Customer-facing online storefront with a weekend sale banner",
  },
  {
    index: "03",
    kicker: "Anywhere",
    title: "Cloud & mobile",
    body: "Secure login from any device. Owners check live sales and reports from their phone, wherever they are.",
    image: "/image/landing/card/cloud.png",
    alt: "Stock report viewed on a mobile device",
  },
];

export function SurfacesSection() {
  return (
    <Section>
      <Eyebrow>What we build</Eyebrow>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-deep md:text-4xl">
        One system, three main surfaces
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Everything in the FluxiBiz suite is designed together - the counter, the online shop, and
        the owner&apos;s pocket.
      </p>

      <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SURFACES.map((surface, index) => (
          <ScrollReveal key={surface.index} direction="up" delay={index * 120}>
            <li>
              <Card className="group h-full gap-0 overflow-hidden rounded-2xl border-hairline p-0">
                <div className="relative aspect-4/3 overflow-hidden bg-white">
                  <EditableImage
                    src={surface.image}
                    alt={surface.alt}
                    label={surface.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="border-t border-hairline bg-white p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    {surface.index} — {surface.kicker}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-brand-ink">
                    {surface.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{surface.body}</p>
                </div>
              </Card>
            </li>
          </ScrollReveal>
        ))}
      </ol>
    </Section>
  );
}
