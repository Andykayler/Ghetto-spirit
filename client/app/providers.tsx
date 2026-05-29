"use client";

import { PlayerProvider } from "@/app/music/PlayerContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}