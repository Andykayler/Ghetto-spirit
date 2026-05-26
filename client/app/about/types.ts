// ─── Types ────────────────────────────────────────────────────────────────────

export interface Stat {
  icon: "crown" | "music" | "globe";
  value: string;
  label: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string; // path to generated image
  bio: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const STATS: Stat[] = [
  { icon: "crown",  value: "100+", label: "ARTISTS EMPOWERED" },
  { icon: "music",  value: "500+", label: "SONGS RELEASED" },
  { icon: "globe",  value: "20+",  label: "COUNTRIES REACHED" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "MARCUS KING",
    role: "FOUNDER & CEO",
    image: "/about/team-1.jpg",
    bio: "Visionary behind the movement. Built Ghetto Spirit from the streets up.",
  },
  {
    name: "DIANA SOUL",
    role: "HEAD OF A&R",
    image: "/about/team-2.jpg",
    bio: "Ear for raw talent. Signed over 60 artists across 15 countries.",
  },
  {
    name: "LEON CROSS",
    role: "CREATIVE DIRECTOR",
    image: "/about/team-3.jpg",
    bio: "Shapes the visual identity of every release, event, and campaign.",
  },
  {
    name: "KEMI OSEI",
    role: "COMMUNITY LEAD",
    image: "/about/team-4.jpg",
    bio: "Bridges the gap between the artists and the people they represent.",
  },
];

export const MILESTONES: Milestone[] = [
  {
    year: "2018",
    title: "THE BEGINNING",
    description: "Ghetto Spirit was born in a basement studio with one mic and an unbreakable dream.",
  },
  {
    year: "2020",
    title: "FIRST 50 ARTISTS",
    description: "Broke through with 50 independent artists signed and the first major compilation album.",
  },
  {
    year: "2022",
    title: "GLOBAL EXPANSION",
    description: "Opened offices in 5 cities. Reached audiences in 20+ countries across 3 continents.",
  },
  {
    year: "2024",
    title: "500 SONGS MILESTONE",
    description: "Crossed 500 released tracks with over 200 million cumulative streams worldwide.",
  },
];
