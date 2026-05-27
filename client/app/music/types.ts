// ─── Types ────────────────────────────────────────────────────────────────────

export type VideoCategory = "ALL" | "OFFICIAL VIDEOS" | "MUSIC" | "FREESTYLES" | "BEHIND THE SCENES";

export interface Video {
  id: string;
  title: string;
  artist: string;
  category: Exclude<VideoCategory, "ALL">;
  duration: string; // "3:24"
  thumbnail: string; // /music-videos/thumb-N.jpg
  youtubeId?: string;
}

export interface LatestRelease {
  title: string;
  artist: string;
  cover: string;       // /music-videos/cover-latest.jpg
  currentTime: string; // "1:47"
  totalTime: string;   // "3:24"
  progress: number;    // 0–100
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "ALL",
  "OFFICIAL VIDEOS",
  "MUSIC",
  "FREESTYLES",
  "BEHIND THE SCENES",
];

export const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "YOUNG LEGEND – NO LIMIT",
    artist: "Young Legend",
    category: "OFFICIAL VIDEOS",
    duration: "3:24",
    thumbnail: "/music-videos/thumb-1.jpg",
  },
  {
    id: "v2",
    title: "KING DRE – HUSTLE HARD",
    artist: "King Dre",
    category: "MUSIC",
    duration: "2:58",
    thumbnail: "/music-videos/thumb-2.jpg",
  },
  {
    id: "v3",
    title: "LADY RYDER – ON MY WAY",
    artist: "Lady Ryder",
    category: "OFFICIAL VIDEOS",
    duration: "3:47",
    thumbnail: "/music-videos/thumb-3.jpg",
  },
  {
    id: "v4",
    title: "DJ SPIRIT – FREESTYLE #12",
    artist: "DJ Spirit",
    category: "FREESTYLES",
    duration: "2:15",
    thumbnail: "/music-videos/thumb-4.jpg",
  },
  {
    id: "v5",
    title: "BEHIND THE MOVEMENT EP.1",
    artist: "Ghetto Spirit ENT",
    category: "BEHIND THE SCENES",
    duration: "4:05",
    thumbnail: "/music-videos/thumb-5.jpg",
  },
  {
    id: "v6",
    title: "STREET PSALM – RISE UP",
    artist: "Street Psalm",
    category: "OFFICIAL VIDEOS",
    duration: "3:12",
    thumbnail: "/music-videos/thumb-6.jpg",
  },
  {
    id: "v7",
    title: "NOVA – LIGHTS OUT",
    artist: "Nova",
    category: "MUSIC",
    duration: "2:44",
    thumbnail: "/music-videos/thumb-7.jpg",
  },
  {
    id: "v8",
    title: "CIPHER SESSION VOL. 3",
    artist: "GS Collective",
    category: "FREESTYLES",
    duration: "5:30",
    thumbnail: "/music-videos/thumb-8.jpg",
  },
  {
    id: "v9",
    title: "MAKING OF NO LIMIT",
    artist: "Young Legend",
    category: "BEHIND THE SCENES",
    duration: "6:18",
    thumbnail: "/music-videos/thumb-9.jpg",
  },
  {
    id: "v10",
    title: "ECHO – CITY NEVER SLEEPS",
    artist: "Echo",
    category: "OFFICIAL VIDEOS",
    duration: "4:02",
    thumbnail: "/music-videos/thumb-10.jpg",
  },
];

export const LATEST_RELEASE: LatestRelease = {
  title: "YOUNG LEGEND – NO LIMIT",
  artist: "Young Legend",
  cover: "/music-videos/cover-latest.jpg",
  currentTime: "1:47",
  totalTime: "3:24",
  progress: 53,
};
