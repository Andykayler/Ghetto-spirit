"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const waveformHeights = [
  4,8,12,18,24,16,28,20,14,30,22,18,26,12,20,28,16,24,10,22,30,18,14,26,20,
  16,28,12,24,18,30,22,14,20,26,16,10,28,18,24,12,20,30,22,16,14,26,18,28,20,
  8,12,20,16,24,10,22,14,28,18,12,26,20,16,30,14,22,18,10,24,
];

export default function MusicPlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.2));
        setTick((t) => t + 1);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100vw",
        height: "72px",
        zIndex: 9999,
        background: "linear-gradient(90deg, #6a0000 0%, #8b0000 25%, #720000 55%, #4a0000 100%)",
        borderTop: "1px solid rgba(255,90,90,0.2)",
        boxShadow: "0 -4px 30px rgba(139,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT: Headphone + track info + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <svg
          width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,170,170,0.65)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>

        <div>
          <div style={{ fontSize: "9px", color: "rgba(255,170,170,0.65)", letterSpacing: "2.5px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", lineHeight: 1 }}>
            LATEST RELEASE
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: "#fff", letterSpacing: "2px", lineHeight: 1, marginTop: "2px", whiteSpace: "nowrap" }}>
            YOUNG LEGEND – NO LIMIT
          </div>
        </div>

        <div style={{ flexShrink: 0, border: "1px solid rgba(255,255,255,0.35)", padding: "3px 8px", fontSize: "9px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "1.5px", background: "rgba(255,255,255,0.1)", whiteSpace: "nowrap" }}>
          OUT NOW
        </div>
      </div>

      {/* CENTER: Album art + waveform + play */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", minWidth: 0, overflow: "hidden" }}>
        {/* Album art */}
        <div style={{ flexShrink: 0, width: "48px", height: "48px", background: "linear-gradient(135deg, rgba(212,160,23,0.25), rgba(80,30,0,0.6))", border: "1px solid rgba(212,160,23,0.3)" }}>
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect width="48" height="48" fill="rgba(15,8,0,0.85)" />
            <circle cx="24" cy="24" r="13" fill="none" stroke="rgba(212,160,23,0.35)" strokeWidth="1" />
            <circle cx="24" cy="24" r="5" fill="rgba(212,160,23,0.25)" />
            <circle cx="24" cy="24" r="1.5" fill="rgba(212,160,23,0.5)" />
          </svg>
        </div>

        {/* Waveform */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2px", height: "44px", overflow: "hidden", minWidth: 0 }}>
          {waveformHeights.map((h, i) => {
            const isActive = (i / waveformHeights.length) * 100 < progress;
            const animH = isPlaying ? h * (0.7 + 0.3 * Math.sin((tick + i) * 0.4)) : h;
            return (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: "3px",
                  height: `${animH}px`,
                  borderRadius: "1px",
                  background: isActive
                    ? "linear-gradient(to top, #d4a017, #f5c842)"
                    : "rgba(255,255,255,0.18)",
                  transition: isPlaying ? "height 0.12s ease" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            flexShrink: 0,
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f5c842, #d4a017)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* RIGHT: View all releases */}
      <div style={{ flexShrink: 0 }}>
        <Link
          href="/music"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "#fff",
            textDecoration: "none",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5c842")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
        >
          VIEW ALL RELEASES
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}