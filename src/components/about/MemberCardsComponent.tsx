"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      className="group relative overflow-hidden flex flex-col py-8 px-6 items-center rounded-[32px] bg-[#FFFFFFE3]
             border border-transparent transition-all duration-500
             hover:shadow-[0_0_0_2px_rgba(254,185,13,0.12),0_18px_40px_-20px_rgba(254,185,13,0.28)]
             hover:-translate-y-1 "
    >
      {/* keyframes (move to globals.css if you prefer) */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1);    opacity: .85; }
          50%      { transform: scale(1.05); opacity: 1;   }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);    opacity: 0; }
          15%  { opacity: .5; }
          100% { transform: translateY(-160px) scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* content sits above the bubbles */}
      <section className="relative z-10 flex flex-col items-center ">
        {/* Avatar: green breathing ring + amber spinning dashed ring inside */}
        <div className="relative flex items-center justify-center w-[230px] h-[230px] mb-6">
          {/* green ring — breathing */}
          <div
            className="absolute inset-0 rounded-full border-[1px] border-[#00932A]"
            style={{ animation: "breathe 3.5s ease-in-out infinite" }}
          />

          {/* amber dashed ring — spinning, inside the green */}
          <div className="absolute inset-[10px] rounded-full border-1 border-dashed border-[#FEB90D] animate-[spin_50s_linear_infinite]" />

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

          {/* yellow dot */}
          {/* <div className="absolute bottom-[6px] right-[6px] w-4 h-4 rounded-full bg-[#FEB90D] border-2 border-white" /> */}
        </div>

        {/* Name */}
        <span className="text-[24px] font-bold uppercase text-[#00932A] text-center">
          {name}
        </span>

        {/* Position */}
        <span className="mt-1 mb-5 text-sm uppercase text-[#D14341] text-center">
          {position}
        </span>

        {/* Divider */}
        <div className="h-[2px] w-12 rounded bg-[#FEB90D]" />

        {/* Mentor tag */}
        <Button
          className="mt-7 rounded-full border-2 border-[#FEB90D] bg-[#FEB90D0D] px-8 py-2 h-auto hover:bg-[#FEB90D1A]"
          onClick={() => alert("Pressed!")}
        >
          <span className="text-xs font-bold uppercase text-[#00932A]">
            {tag}
          </span>
        </Button>

{/* Socials */}
<div className="mt-7 flex gap-4">
  {[
    {
      icon: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/715dc708-6ded-45d2-8907-7cce89a5db00",
      link: github,
      alt: "GitHub",
    },
    {
      icon: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d2547c56-1452-40d7-bfdc-26be83174eed",
      link: telegram,
      alt: "Telegram",
    },
    {
      icon: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/37ee4b26-eb61-4205-9712-7ca4d6d43e45",
      link: linkedin,
      alt: "LinkedIn",
    },
  ].map(({ icon, link, alt }) => (
    <Button
      key={alt}
      variant="outline"
      size="icon"
      className="rounded-full border border-[#E5E7EB]"
      disabled={!link}
    >
      <a
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={icon}
          width={20}
          height={20}
          alt={alt}
          style={{
            borderRadius: 9999,
            width: 20,
            height: 20,
            objectFit: "cover",
          }}
        />
      </a>
    </Button>
  ))}
</div>      </section>
    </Card>
  );
}
