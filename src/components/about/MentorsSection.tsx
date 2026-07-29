import TeamCard from "./MemberCardsComponent";
import { mentors, team } from "@/lib/about/data";

export default function MentorsSection() {
  return (
    //  py-20  → vertical padding (top/bottom). Change here.
    <section className="py-20">
      {/*  px-[5.5%]  → horizontal padding (left/right). Change here.
           max-w-[1900px] + mx-auto → caps width and centers on the page. */}
      <div className="mx-auto max-w-[1900px] px-[5.5%]">
        {/* Our Mentors */}
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-[#00932A]">Our Mentors</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 mx-auto max-w-4xl justify-items-center">
          {mentors.map((mentor, _) => (
            <div key={_} className="w-full max-w-sm"> 
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
        <div className="text-center mt-20 mb-4">
          <h2 className="text-5xl font-bold text-[#00932A]">Our Team</h2>
        </div>
        <div className="grid grid-cols-1 gap-18 mt-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mx-auto max-w-7xl">
          {team.map((mentor, _) => (
            <div key={_} className="w-full max-w-md">
              <TeamCard
                image={mentor.avatar}
                name={mentor.name}
                position={mentor.role}
                tag={"FullStack"}
                github={mentor.github}
                telegram={mentor.telegram}
                linkedin={mentor.linkedin}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}