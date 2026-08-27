"use client";

import { useTranslations } from "next-intl";

import TeamCard from "./MemberCardsComponent";
import { mentors, team } from "@/lib/about/data";

export default function MentorsSection() {
  const t = useTranslations("About.team");

  return (
    <section className="py-20 font-body">
      <div className="mx-auto max-w-[1900px] px-[5.5%]">
        {/* Our Mentors */}
        <div className="mb-4 text-center">
          <h2 className="text-5xl font-bold text-[#00932A]">
            {t("mentors")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2">
          {mentors.map((mentor) => (
            <div
              key={mentor.nameKey}
              className="w-full max-w-sm"
            >
              <TeamCard
                image={mentor.avatar}
                name={t(`people.${mentor.nameKey}`)}
                position={t(`roles.${mentor.titleKey}`)}
                tag={t(`roles.${mentor.tagKey}`)}
                github={mentor.github}
                telegram={mentor.telegram}
                linkedin={mentor.linkedin}
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

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.nameKey}
              className="w-full max-w-sm"
            >
              <TeamCard
                image={member.avatar}
                name={t(`people.${member.nameKey}`)}
                position={t(`roles.${member.roleKey}`)}
                tag={t(`roles.${member.levelKey}`)}
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