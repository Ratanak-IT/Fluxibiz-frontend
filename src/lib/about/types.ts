// lib/about/types.ts
export interface TeamMember {
  name: string;
  role: "Frontend" | "Fullstack" | "Backend";
  level: "Team Leader" | "Member";
  avatar: string;
  github: string;
  telegram: string;
  linkedin: string;
}

export interface Mentor {
  name: string;
  title: string;
  avatar: string;
  tag: string;
}