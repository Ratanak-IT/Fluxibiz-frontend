import Image from "next/image";

import { LANDING_IMAGES, Section } from "./landing-shared";

export function ProductPreview() {
  return (
    <Section className="pt-0">
      <figure className="overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_40px_90px_-50px_rgba(15,36,23,0.5)] sm:p-2.5">
        <Image
          src={LANDING_IMAGES.dashboardPreview}
          alt="FluxiBiz dashboard showing revenue, orders, tables, staff, sales, and recent activity"
          width={1536}
          height={1068}
          priority
          sizes="(max-width: 768px) 100vw, 1152px"
          className="h-auto w-full rounded-xl object-contain"
        />
        <figcaption className="sr-only">
          FluxiBiz business dashboard preview
        </figcaption>
      </figure>
    </Section>
  );
}
