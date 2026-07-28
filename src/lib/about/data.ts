// lib/about/data.ts
import type { TeamMember, Mentor } from "./types";

export const mentors: Mentor[] = [
  { name: "Chan Chhaya",    title: "Senior IT Instructor", avatar: "/image/team/instructors/chhaya.jpg", tag:"Mentor"},
  { name: "Srorng Sokcheat", title: "IT Instructor",       avatar: "/image/team/instructors/sokcheat.JPG" , tag:"Mentor"},
];

export const team: TeamMember[] = [
  { name: "Liep Sokkeang",  role: "Fullstack", level: "Team Leader", avatar: "/image/team/members/keang.jpg",  github: "https://github.com/Sokkeang-Liep", telegram: "https://t.me/Liepsokkeang", linkedin: "https://www.linkedin.com/in/liep-sokkeang-23bbb6341/" },
  { name: "Srey ChanChhay", role: "Fullstack", level: "Team Leader", avatar: "/image/team/members/chhay.jpg", github: "", telegram: "", linkedin: "" },
  { name: "Pech Phakley",   role: "Fullstack",  level: "Member",      avatar: "/image/team/members/lokbong.png",   github: "", telegram: "", linkedin: "" },
  { name: "Dorn Dana",      role: "Fullstack", level: "Member",      avatar: "/image/team/members/dana.jpg",      github: "", telegram: "", linkedin: "" },
  { name: "Maiy Leangngim",     role: "Fullstack", level: "Member",      avatar: "/image/team/members/leangngim.JPG",       github: "https://github.com/maiyleangngim", telegram: "https://t.me/maiyleangngim", linkedin: "https://www.linkedin.com/in/maiy-leangngim-969715382/" },
  { name: "Leang Lyjing",   role: "Fullstack", level: "Member",      avatar: "/image/team/members/jing.jpg",   github: "", telegram: "", linkedin: "" },
  { name: "Khorn Sokkhim",  role: "Fullstack", level: "Member",      avatar: "/image/team/members/sokhim.JPG",  github: "", telegram: "", linkedin: "" },
  { name: "Thai Ratanak",  role: "Fullstack", level: "Member",     avatar: "/image/team/members/ratanak.png",  github: "https://github.com/Ratanak-IT", telegram: "https://t.me/Ratanak_Thai", linkedin: "https://www.linkedin.com/in/thai-ratanak-741747425/" },
  { name: "Rayya Yuma",     role: "Fullstack",  level: "Member",      avatar: "/image/team/members/yuma.jpg",     github: "", telegram: "", linkedin: "" },
];