// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | "ALL ARTISTS"
  | "RAPPERS"
  | "SINGERS"
  | "PRODUCERS"
  | "DJS"
  | "SONGWRITERS";

export interface Artist {
  id: number;
  name: string;
  role: string;
  category: Category;
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const ARTISTS: Artist[] = [
  { id: 1, name: "YOUNG LEGEND", role: "RAPPER",   category: "RAPPERS",   image: "/images/young-legend.jpg" },
  { id: 2, name: "LADY RYDER",   role: "RAPPER",   category: "RAPPERS",   image: "/images/lady-ryder.jpg"   },
  { id: 3, name: "KING DRE",     role: "RAPPER",   category: "RAPPERS",   image: "/images/king-dre.jpg"     },
  { id: 4, name: "REAL BEATZ",   role: "PRODUCER", category: "PRODUCERS", image: "/images/real-beatz.jpg"   },
  { id: 5, name: "NIA VOX",      role: "SINGER",   category: "SINGERS",   image: "/images/nia-vox.jpg"      },
  { id: 6, name: "DJ SPIRIT",    role: "DJ",       category: "DJS",       image: "/images/dj-spirit.jpg"    },
];

export const CATEGORIES: Category[] = [
  "ALL ARTISTS",
  "RAPPERS",
  "SINGERS",
  "PRODUCERS",
  "DJS",
  "SONGWRITERS",
];

export const GENRES = [
  "ALL GENRES",
  "HIP HOP",
  "R&B",
  "TRAP",
  "AFROBEATS",
  "POP",
];
