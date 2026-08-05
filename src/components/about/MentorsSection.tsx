"use client";

import { useTranslations } from "next-intl";

import TeamCard from "./MemberCardsComponent";
import { mentors, team } from "@/lib/about/data";

export default function MentorsSection() {
  const t = useTranslations("About.team");

  return (
    // py-20 → vertical padding (top/bottom). Change here.
    <section className="py-20">
      {/* px-[5.5%] → horizontal padding (left/right). Change here.
          max-w-[1900px] + mx-auto → caps width and centers on the page. */}
      <div className="mx-auto max-w-[1900px] px-[5.5%]">
        {/* Our Mentors */}
        <div className="mb-4 text-center">
          <h2 className="text-5xl font-bold text-[#00932A]">
            {t("mentors")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2">
          {mentors.map((mentor, index) => (
            <div key={index} className="w-full max-w-sm">
              <TeamCard
                image={mentor.avatar}
                name={mentor.name}
                position={mentor.title}
                tag={mentor.tag}
              />
            </div>
          ))}
        </div>

        {/* Our Team */}
        <div className="mb-4 mt-20 text-center">
          <h2 className="text-5xl font-bold text-[#00932A]">
            {t("members")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 justify-items-center gap-18 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <div key={index} className="w-full max-w-md">
              <TeamCard
                image={member.avatar}
                name={member.name}
                position={member.role}
                tag={t("fullStack")}
                github={member.github}
                telegram={member.telegram}
                linkedin={member.linkedin}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}