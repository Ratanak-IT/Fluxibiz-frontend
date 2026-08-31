"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaGithub, FaTelegram, FaLinkedin } from "react-icons/fa6";

export type MemberType = {
  image: string;
  name: string;
  position: string;
  tag: string;
  github?: string;
  telegram?: string;
  linkedin?: string;
};

export default function TeamCard({
  image,
  name,
  position,
  tag,
  github,
  telegram,
  linkedin,
}: MemberType) {
  return (
    <Card
      className="
        group relative overflow-hidden flex flex-col 
        py-8 px-6 items-center rounded-[32px] 
        bg-card
        border border-transparent 
        transition-all duration-400
        hover:shadow-[0_0_0_2px_rgba(254,185,13,0.12),0_18px_40px_-20px_rgba(254,185,13,0.28)]
        hover:-translate-y-1
      "
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: .85; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: .5; }
          100% { transform: translateY(-160px) scale(1.3); opacity: 0; }
        }
      `}</style>

      <section className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-[230px] h-[230px] mb-6">
          {/* green breathing ring */}
          <div
            className="
              absolute inset-0 rounded-full 
              border-[1px] border-brand
            "
            style={{ animation: "breathe 2.5s ease-in-out infinite" }}
          />

          {/* amber dashed ring */}
          <div
            className="
              absolute inset-[10px] rounded-full 
              border border-dashed border-secondary
              animate-[spin_50s_linear_infinite]
            "
          />

          {/* photo */}
          <div className="absolute inset-[18px] rounded-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              priority
              quality={100}
              sizes="(min-resolution: 2dppx) 320px, 160px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Name */}
        <span
          className="
            text-[24px] font-bold uppercase 
            text-brand text-center
          "
        >
          {name}
        </span>

        {/* Position */}
        <span
          className="
            mt-1 mb-5 text-sm uppercase 
            text-destructive text-center
          "
        >
          {position}
        </span>

        {/* Divider */}
        <div className="h-[2px] w-12 rounded bg-secondary" />

        {/* Mentor tag */}
        <Button
          className="
            mt-7 rounded-full 
            border-2 border-secondary 
            bg-secondary/10
            px-8 py-2 h-auto
            hover:bg-secondary/20
          "
        >
          <span
            className="
              text-xs font-bold uppercase 
              text-brand
            "
          >
            {tag}
          </span>
        </Button>

        {/* Socials */}
        <div className="mt-7 flex items-center justify-center gap-4">
          {/* GitHub */}
          {(() => {
            const targetUrl = github && github.trim() !== "" ? github : "#";
            return (
              <a
                href={targetUrl}
                target={targetUrl !== "#" ? "_blank" : undefined}
                rel={targetUrl !== "#" ? "noopener noreferrer" : undefined}
                aria-label="GitHub"
                className="
                  group/social flex items-center justify-center
                  w-10 h-10 rounded-full
                  bg-slate-100 border border-slate-200
                  dark:bg-slate-800 dark:border-slate-700
                  text-[#181717] dark:text-gray-200
                  hover:bg-[#181717] hover:border-[#181717] hover:text-white
                  dark:hover:bg-[#181717] dark:hover:text-white
                  transition-all duration-300 hover:scale-110 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                "
              >
                <FaGithub className="w-5 h-5 transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            );
          })()}

          {/* Telegram */}
          {(() => {
            const targetUrl = telegram && telegram.trim() !== "" ? telegram : "#";
            return (
              <a
                href={targetUrl}
                target={targetUrl !== "#" ? "_blank" : undefined}
                rel={targetUrl !== "#" ? "noopener noreferrer" : undefined}
                aria-label="Telegram"
                className="
                  group/social relative flex items-center justify-center
                  w-10 h-10 rounded-full
                  bg-slate-100 border border-slate-200
                  dark:bg-slate-800 dark:border-slate-700
                  hover:bg-[#24A1DE] hover:border-[#24A1DE]
                  transition-all duration-300 hover:scale-110 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                "
              >
                <FaTelegram className="relative z-10 w-5 h-5 text-[#24A1DE] group-hover/social:text-white transition-all duration-300 group-hover/social:scale-110" />
              </a>
            );
          })()}

          {/* LinkedIn */}
          {(() => {
            const targetUrl = linkedin && linkedin.trim() !== "" ? linkedin : "#";
            return (
              <a
                href={targetUrl}
                target={targetUrl !== "#" ? "_blank" : undefined}
                rel={targetUrl !== "#" ? "noopener noreferrer" : undefined}
                aria-label="LinkedIn"
                className="
                  group/social relative flex items-center justify-center
                  w-10 h-10 rounded-full
                  bg-slate-100 border border-slate-200
                  dark:bg-slate-800 dark:border-slate-700
                  hover:bg-[#0077B5] hover:border-[#0077B5]
                  transition-all duration-300 hover:scale-110 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                "
              >
                <FaLinkedin className="relative z-10 w-5 h-5 text-[#0077B5] group-hover/social:text-white transition-all duration-300 group-hover/social:scale-110" />
              </a>
            );
          })()}
        </div>
      </section>
    </Card>
  );
}
