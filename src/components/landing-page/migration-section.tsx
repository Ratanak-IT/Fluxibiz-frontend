import {
  CheckCheck,
  DatabaseZap,
  FileDown,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accent, RuledEyebrow, Section } from "./landing-shared";
import { ScrollReveal } from "./scroll-reveal";

type Tone = "brand" | "amber" | "rose";

interface MigrationItem {
  title: string;
  body: string;
  icon: LucideIcon;
  tone: Tone;
}

const TONES = {
  brand: { dot: "bg-brand", border: "border-brand", title: "text-brand-deep" },
  amber: { dot: "bg-secondary", border: "border-secondary", title: "text-[#e9a900] dark:text-secondary" },
  rose: { dot: "bg-rose", border: "border-rose", title: "text-rose" },
} satisfies Record<Tone, Record<string, string>>;

const ITEMS: MigrationItem[] = [
  {
    title: "Bulk Data Import",
    body: "Import existing business data into the system from multiple formats, including databases, Excel, CSV, and more.",
    icon: FileDown,
    tone: "brand",
  },
  {
    title: "Data Cleansing Workspace",
    body: "A dedicated workspace for users to review, organize, and prepare their data before migration.",
    icon: DatabaseZap,
    tone: "amber",
  },
  {
    title: "Data Validation & Deduplication",
    body: "Automatically detect and remove duplicate records, identify errors, and validate data before importing it into the system.",
    icon: CheckCheck,
    tone: "rose",
  },
  {
    title: "Safe Data Migration",
    body: "Migrate cleaned and validated legacy data into the new system while maintaining data accuracy and consistency.",
    icon: ShieldCheck,
    tone: "brand",
  },
];

function MigrationArtwork() {
  return (
    <div
      className="relative ml-auto hidden h-40 w-44 shrink-0 items-end justify-end md:flex"
      aria-hidden="true"
    >
      <div className="hero-float-slow absolute bottom-1 left-1 h-24 w-36 rounded-xl border-[5px] border-foreground bg-amber shadow-[inset_0_-8px_0_rgba(0,0,0,0.08)]" />
      <div className="hero-float-sm absolute bottom-5 right-1 flex h-36 w-28 items-center justify-center rounded-t-lg border-[5px] border-foreground bg-card shadow-sm">
        <span className="absolute right-0 top-0 size-10 border-b-[5px] border-l-[5px] border-foreground bg-muted [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        <span className="mt-8 flex size-16 items-center justify-center rounded-full border-4 border-foreground bg-[#6bd94d]">
          <FileDown className="size-10 stroke-3 text-foreground" />
        </span>
      </div>
    </div>
  );
}

function MigrationCard({
  item,
  index,
  featured = false,
}: {
  item: MigrationItem;
  index: number;
  featured?: boolean;
}) {
  const { icon: Icon, title, body, tone } = item;
  const style = TONES[tone];

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-xl border-border bg-white p-7 transition-[border-color] duration-500 ease-out hover:border-brand/30">
      <div
        className={`origin-center transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
          featured ? "text-left md:flex md:flex-row md:items-center" : ""
        }`}
      >
        <div className={featured ? "max-w-md shrink-0 text-left" : ""}>
          <span
            className={`mt-4 flex size-11 items-center justify-center rounded-full border-2 ${style.border} ${style.title}`}
          >
            <Icon className="size-5 stroke-[2.2]" />
          </span>

          <h3 className={`mt-4 font-display text-xl font-bold leading-tight ${style.title}`}>
            {title}
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        </div>
        {featured ? <MigrationArtwork /> : null}
      </div>
    </Card>
  );
}

export function MigrationSection() {
  return (
    <Section className="bg-background">
      <div className="text-center">
        <RuledEyebrow>Reliability guaranteed</RuledEyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-brand-deep md:text-[2.75rem]">
          Seamless migration, <Accent>zero data loss</Accent>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Switching to FluxiBiz is effortless. Every byte of your data is moved, validated, and
          ready to use in minutes.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ScrollReveal direction="up" delay={0} className="lg:col-span-2">
          <MigrationCard item={ITEMS[0]} index={0} featured />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={120}>
          <MigrationCard item={ITEMS[1]} index={1} />
        </ScrollReveal>
        <div className="lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-5">
          <ScrollReveal direction="up" delay={240}>
            <MigrationCard item={ITEMS[2]} index={2} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={360} className="mt-5 lg:mt-0">
            <MigrationCard item={ITEMS[3]} index={3} />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
}
