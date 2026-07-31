import Image from "next/image";
import { ArrowDownLeft, ArrowLeftRight, Check } from "lucide-react";

/* Portraits ringing the headline. Drop files in /public/images/support/ and fill
   in `src`; without one, the circle renders as a tinted disc with an initial. */
const AVATARS = [
  { name: "Sokkeang", src: undefined as string | undefined, tint: "bg-[#E9E9E9]", size: 100, x: "17%", y: "4%" },
  { name: "Dara", src: undefined as string | undefined, tint: "bg-[#C9A8E0]", size: 84, x: "11%", y: "36%" },
  { name: "Nita", src: undefined as string | undefined, tint: "bg-[#EDEDED]", size: 90, x: "25%", y: "56%" },
  { name: "Vanna", src: undefined as string | undefined, tint: "bg-[#A9D9E8]", size: 100, x: "83%", y: "4%" },
  { name: "Rith", src: undefined as string | undefined, tint: "bg-[#F4B333]", size: 84, x: "88%", y: "36%" },
  { name: "Chan", src: undefined as string | undefined, tint: "bg-[#B9A7D6]", size: 90, x: "75%", y: "56%" },
];

const REQUESTS = [
  {
    icon: ArrowDownLeft,
    title: "Receipt printer setup",
    date: "Apr 27",
    value: "Solved in 12m",
    tone: "text-[#1B8A5A]",
  },
  {
    icon: ArrowLeftRight,
    title: "KHQR not scanning",
    date: "Apr 25",
    value: "In progress",
    tone: "text-[#C9761E]",
  },
  {
    icon: Check,
    title: "Stock import help",
    date: "Mar 1",
    value: "Solved in 8m",
    tone: "text-[#1B8A5A]",
  },
];

function Avatar({
  name,
  src,
  tint,
  size,
}: {
  name: string;
  src?: string;
  tint: string;
  size: number;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ring-1 ring-black/5 ${tint}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={"src"} alt={name} fill sizes="100px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white/90">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F6F5] px-6 pb-12 pt-16 text-[#0c1a14]">
      <div className="relative mx-auto max-w-[1400px]">
        {/* Headline block, with portraits floating around it on large screens */}
        <div className="relative py-6 lg:min-h-[440px] lg:py-16">
          {AVATARS.map((a, i) => (
            <div
              key={a.name}
              aria-hidden
              className="pointer-events-none absolute hidden -translate-x-1/2 lg:block"
              style={{
                left: a.x,
                top: a.y,
                animation: "float 7s ease-in-out infinite",
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <Avatar {...a} />
            </div>
          ))}

          <div className="relative mx-auto max-w-2xl text-center">
            <h1 className="w-full max-w-5xl font-display text-[2.4rem] text-primary font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem">
              Your shop deserves support that actually answers
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#12261D]/60">
              Whether you are setting up your first register, migrating from
              another system, or stuck mid-shift with a queue at the counter -
              our team in Phnom Penh replies fast, in Khmer or English.
            </p>

            <a
              href="#message"
              className="mt-10 inline-flex items-center rounded-full bg-primary px-9 py-4 text-sm font-medium text-white transition-colors hover:bg-[#0C2A1F]"
            >
              Explore our support
            </a>
          </div>

          {/* Portraits collapse into a simple row on small screens */}
          <div className="mt-10 flex justify-center gap-3 lg:hidden">
            {AVATARS.slice(0, 5).map((a) => (
              <Avatar key={a.name} {...a} size={52} />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes float { 0%, 100% { transform: none; } }
        }
      `}</style>
    </section>
  );
} 