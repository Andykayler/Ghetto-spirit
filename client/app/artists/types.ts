// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
   "ALL ARTISTS";

export interface Artist {
  id: number;
  name: string;
  role: string;
  category: Category;
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const ARTISTS: Artist[] = [
  {
    id: 1, name: "YOUNG LEGEND", role: "RAPPER", image: "/images/young-legend.jpg",
    category: "ALL ARTISTS"
  },
  { id: 2, name: "LADY RYDER",   role: "RAPPER",   category: "ALL ARTISTS",   image: "/images/lady-ryder.jpg"   },
  { id: 3, name: "KING DRE",     role: "RAPPER",   category: "ALL ARTISTS",   image: "/images/king-dre.jpg"     },
  { id: 4, name: "REAL BEATZ",   role: "PRODUCER", category: "ALL ARTISTS", image: "/images/real-beatz.jpg"   },
  { id: 5, name: "NIA VOX",      role: "SINGER",   category: "ALL ARTISTS",   image: "/images/nia-vox.jpg"      },
  { id: 6, name: "DJ SPIRIT",    role: "DJ",       category: "ALL ARTISTS",       image: "/images/dj-spirit.jpg"    },
];

export const CATEGORIES: Category[] = [
  "ALL ARTISTS",
 
];

export const GENRES = [
  "ALL GENRES",
  "HIP HOP",
  "R&B",
  "TRAP",
  "AFROBEATS",
  "POP",
];
