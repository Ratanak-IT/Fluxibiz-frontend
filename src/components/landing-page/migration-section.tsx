import {
  CheckCheck,
  DatabaseZap,
  FileDown,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accent, RuledEyebrow, Section } from "./landing-shared";

interface MigrationItem {
  title: string;
  body: string;
  icon: LucideIcon;
}

const ITEMS: MigrationItem[] = [
  {
    title: "Bulk Data Import",
    body: "Import existing business data into the system from multiple formats, including databases, Excel, CSV, and more.",
    icon: FileDown,
  },
  {
    title: "Data Cleansing Workspace",
    body: "A dedicated workspace for users to review, organize, and prepare their data before migration.",
    icon: DatabaseZap,
  },
  {
    title: "Data Validation & Deduplication",
    body: "Automatically detect and remove duplicate records, identify errors, and validate data before importing it into the system.",
    icon: CheckCheck,
  },
  {
    title: "Safe Data Migration",
    body: "Migrate cleaned and validated legacy data into the new system while maintaining data accuracy and consistency.",
    icon: ShieldCheck,
  },
];

function MigrationArtwork() {
  return (
    <div
      className="relative ml-auto hidden h-40 w-44 shrink-0 items-end justify-end md:flex"
      aria-hidden="true"
    >
      <div className="absolute bottom-1 left-1 h-24 w-36 rounded-xl border-[5px] border-foreground bg-amber shadow-[inset_0_-8px_0_rgba(0,0,0,0.08)]" />
      <div className="absolute bottom-5 right-1 flex h-36 w-28 items-center justify-center rounded-t-lg border-[5px] border-foreground bg-card shadow-sm">
        <span className="absolute right-0 top-0 size-10 border-b-[5px] border-l-[5px] border-foreground bg-muted [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        <span className="mt-8 flex size-16 items-center justify-center rounded-full border-4 border-foreground bg-[#6bd94d]">
          <FileDown className="size-10 stroke-[3] text-foreground" />
        </span>
      </div>
    </div>
  );
}

function MigrationCard({
  item,
  featured = false,
}: {
  item: MigrationItem;
  featured?: boolean;
}) {
  const { icon: Icon, title, body } = item;

  return (
    <Card
      className={`h-full gap-0 rounded-xl border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md ${
        featured ? "text-left md:flex md:flex-row md:items-center" : ""
      }`}
    >
      <div className={featured ? "max-w-md shrink-0 text-left" : ""}>
        <span className="flex size-10 items-center justify-center rounded-md bg-brand text-white">
          <Icon className="size-5 stroke-[2.2]" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold leading-tight text-brand">
          {title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      {featured ? <MigrationArtwork /> : null}
    </Card>
  );
}

export function MigrationSection() {
  return (
    <Section className="bg-white dark:bg-background">
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
        <div className="lg:col-span-2">
          <MigrationCard item={ITEMS[0]} featured />
        </div>
        <div>
          <MigrationCard item={ITEMS[1]} />
        </div>
        <div className="lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-5">
          <MigrationCard item={ITEMS[2]} />
          <div className="mt-5 lg:mt-0">
            <MigrationCard item={ITEMS[3]} />
          </div>
        </div>
      </div>
    </Section>
  );
}
