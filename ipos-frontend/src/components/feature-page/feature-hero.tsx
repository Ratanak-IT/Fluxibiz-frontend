import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FEATURE_STATS } from "./feature-data";

export function FeatureHero() {
  return (
    <section
      className="
        relative overflow-hidden

        bg-[radial-gradient(ellipse_at_top,var(--brand-soft)_0%,var(--background)_62%)]

        px-5 
        pb-20 
        pt-20 

        text-center

        md:pb-24 
        md:pt-24"  >
      <div className="mx-auto max-w-3xl">
        <h1
          className="
                font-[family-name:var(--font-google-sans-flex)]

                text-[2.65rem]
                font-extrabold

                leading-[1.05]

                tracking-[-0.04em]

                text-foreground

                sm:text-5xl
                md:text-6xl
                md:leading-[1.05]  "  >
          Everything your counter
          <br />
          needs, in <span className="text-brand">one screen</span>
        </h1>

        <p
          className="
                mx-auto 
                mt-7 
                max-w-xl

                text-base 
                leading-7

                text-muted-foreground

                md:text-[19px]
                md:leading-[30px] " >
          From the first open to the final cash-out — FluxiBiz runs your sales,
          stock, staff, and storefront from a single, beautifully simple
          dashboard.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            className="
                    h-[52px]

                    rounded-[11px]

                    bg-brand

                    px-7

                    text-base
                    font-semibold

                    text-primary-foreground

                    shadow-[0_10px_20px_rgba(33,185,75,0.28)]

                    hover:bg-brand-deep " >
            Start free trial
          </Button>

          <Button
            render={<a href="mailto:ipos.istad@gmail.com" />}
            nativeButton={false}
            variant="outline"
            className="
                    h-[52px]

                    rounded-[11px]

                    border-brand/35

                    bg-card

                    px-7

                    text-base
                    font-semibold

                    text-card-foreground

                    hover:bg-brand-soft " >
            Talk to sales
          </Button>
        </div>

        <dl
          className="
                mx-auto

                mt-12

                grid

                max-w-xl

                grid-cols-1

                gap-7

                sm:grid-cols-3

                sm:gap-12">
          {FEATURE_STATS.map((stat) => (
            <div key={stat.translationKey}>
              <dt
                className="
                            font-mono

                            text-[28px]

                            font-bold

                            text-foreground">
                {stat.value}
              </dt>

              <dd
                className=" mt-1 text-[13px] text-muted-foreground">
                {stat.translationKey}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
