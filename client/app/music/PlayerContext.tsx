"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { Video, VIDEOS } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerState {
  currentVideo: Video | null;
  queue: Video[];
  queueIndex: number;
  playing: boolean;
  progress: number;       // 0–100
  volume: number;         // 0–100
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  expanded: boolean;
}

interface PlayerCtx extends PlayerState {
  play: (video: Video) => void;
  togglePlay: () => void;
  seek: (pct: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (v: boolean) => void;
  artistTrackCount: (artist: string) => number;
  artistTracks: (artist: string) => Video[];
}

const Ctx = createContext<PlayerCtx | null>(null);
export const usePlayer = () => useContext(Ctx)!;

// ─── Provider ─────────────────────────────────────────────────────────────────
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentVideo: null,
    queue: VIDEOS,
    queueIndex: 0,
    playing: false,
    progress: 0,
    volume: 80,
    shuffle: false,
    repeat: "off",
    expanded: false,
  });

  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance progress
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (!state.playing || !state.currentVideo) return;
    tickRef.current = setInterval(() => {
      setState((s) => {
        if (s.progress >= 100) {
          // handle end of track
          if (s.repeat === "one") return { ...s, progress: 0 };
          const nextIdx = s.queueIndex + 1 < s.queue.length ? s.queueIndex + 1 : 0;
          if (s.repeat === "off" && s.queueIndex + 1 >= s.queue.length) {
            return { ...s, playing: false, progress: 100 };
          }
          return { ...s, queueIndex: nextIdx, currentVideo: s.queue[nextIdx], progress: 0 };
        }
        return { ...s, progress: s.progress + 100 / (parseDuration(s.currentVideo!.duration) * 10) };
      });
    }, 100);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [state.playing, state.currentVideo]);

  const play = useCallback((video: Video) => {
    const idx = VIDEOS.findIndex((v) => v.id === video.id);
    setState((s) => ({
      ...s,
      currentVideo: video,
      queueIndex: idx >= 0 ? idx : 0,
      queue: VIDEOS,
      playing: true,
      progress: 0,
      expanded: true,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, playing: s.currentVideo ? !s.playing : s.playing }));
  }, []);

  const seek = useCallback((pct: number) => {
    setState((s) => ({ ...s, progress: Math.max(0, Math.min(100, pct)) }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      let nextIdx: number;
      if (s.shuffle) {
        nextIdx = Math.floor(Math.random() * s.queue.length);
      } else {
        nextIdx = (s.queueIndex + 1) % s.queue.length;
      }
      return { ...s, queueIndex: nextIdx, currentVideo: s.queue[nextIdx], progress: 0, playing: true };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (s.progress > 10) return { ...s, progress: 0 };
      const prevIdx = s.queueIndex - 1 >= 0 ? s.queueIndex - 1 : s.queue.length - 1;
      return { ...s, queueIndex: prevIdx, currentVideo: s.queue[prevIdx], progress: 0, playing: true };
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((s) => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const cycleRepeat = useCallback(() => {
    setState((s) => ({
      ...s,
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  }, []);

  const setExpanded = useCallback((v: boolean) => {
    setState((s) => ({ ...s, expanded: v }));
  }, []);

  const artistTrackCount = useCallback((artist: string) => {
    return VIDEOS.filter((v) => v.artist === artist).length;
  }, []);

  const artistTracks = useCallback((artist: string) => {
    return VIDEOS.filter((v) => v.artist === artist);
  }, []);

  return (
    <Ctx.Provider value={{
      ...state,
      play, togglePlay, seek, next, prev, setVolume,
      toggleShuffle, cycleRepeat, setExpanded,
      artistTrackCount, artistTracks,
    }}>
      {children}
    </Ctx.Provider>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function parseDuration(dur: string): number {
  const [m, s] = dur.split(":").map(Number);
  return m * 60 + s;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
