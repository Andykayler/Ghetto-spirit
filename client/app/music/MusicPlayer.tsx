"use client";

import { useState, useEffect, useRef } from "react";
import { LATEST_RELEASE } from "./types";

// ─── MusicPlayer ──────────────────────────────────────────────────────────────
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(LATEST_RELEASE.progress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Animate waveform bars
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 28 }, (_, i) => 20 + Math.sin(i * 0.8) * 18 + Math.random() * 14)
  );

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 0.15, 100));
      setWaveHeights(
        Array.from({ length: 28 }, () => 10 + Math.random() * 38)
      );
    }, 120);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const totalSec = 3 * 60 + 24;
  const currentSec = Math.floor((progress / 100) * totalSec);
  const currentMin = Math.floor(currentSec / 60);
  const currentSecRem = currentSec % 60;
  const currentStr = `${currentMin}:${String(currentSecRem).padStart(2, "0")}`;

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

  return (
    <section
      style={{
        background: "#1A0A00",
        borderTop: "2px solid rgba(212,175,55,0.25)",
        padding: "22px 60px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Left: Cover + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              flexShrink: 0,
              border: "2px solid #D4AF37",
              overflow: "hidden",
              background: "#2A1500",
              position: "relative",
            }}
          >
            <img
              src={LATEST_RELEASE.cover}
              alt="cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Crown overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <svg width={32} height={26} viewBox="0 0 32 26" fill="#D4AF37">
                <path d="M2 22h28v3H2v-3zM2 4l7 9 7-13 7 13 7-9v17H2V4z" />
              </svg>
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "#D4AF37",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              LATEST RELEASE
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18,
                color: "#FFFFFF",
                letterSpacing: "0.07em",
                lineHeight: 1,
              }}
            >
              {LATEST_RELEASE.title}
            </div>
          </div>
        </div>

        {/* Center: Play + waveform + time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Play/Pause button */}
          <button
            onClick={() => setPlaying((p) => !p)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#D4AF37",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#F0CB50";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#D4AF37";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            {playing ? (
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ width: 3, height: 14, background: "#0A0A0A" }} />
                <div style={{ width: 3, height: 14, background: "#0A0A0A" }} />
              </div>
            ) : (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "14px solid #0A0A0A",
                  marginLeft: 3,
                }}
              />
            )}
          </button>

          {/* Waveform + scrubber */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Waveform visual */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                height: 40,
                cursor: "pointer",
              }}
              onClick={handleBarClick}
            >
              {waveHeights.map((h, i) => {
                const barPct = (i / waveHeights.length) * 100;
                const isPast = barPct <= progress;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}px`,
                      maxHeight: 38,
                      minHeight: 4,
                      background: isPast ? "#D4AF37" : "rgba(212,175,55,0.25)",
                      borderRadius: 2,
                      transition: playing ? "height 0.1s ease" : "none",
                    }}
                  />
                );
              })}
            </div>

            {/* Progress bar */}
            <div
              ref={barRef}
              onClick={handleBarClick}
              style={{
                height: 3,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 2,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${progress}%`,
                  background: "#D4AF37",
                  borderRadius: 2,
                  transition: playing ? "width 0.12s linear" : "none",
                }}
              />
            </div>
          </div>

          {/* Time */}
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
              flexShrink: 0,
              minWidth: 80,
              textAlign: "right",
            }}
          >
            {currentStr} / {LATEST_RELEASE.totalTime}
          </div>
        </div>

        {/* Right: Listen Now + platform icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="#"
            style={{
              padding: "12px 24px",
              border: "1.5px solid rgba(255,255,255,0.4)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.18em",
              color: "#FFFFFF",
              textDecoration: "none",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#D4AF37";
              el.style.color = "#D4AF37";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.4)";
              el.style.color = "#FFFFFF";
            }}
          >
            LISTEN NOW
          </a>

          {/* Spotify icon */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              transition: "color 0.2s",
              padding: 4,
            }}
            title="Open in Spotify"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#1DB954")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)")
            }
          >
            <SpotifyIcon />
          </button>

          {/* Music note icon */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              transition: "color 0.2s",
              padding: 4,
            }}
            title="Open in Apple Music"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#FC3C44")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)")
            }
          >
            <MusicNoteIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function SpotifyIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 0 1-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 0 1 .207.857zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 0 1-.973-.52.781.781 0 0 1 .52-.974c3.632-1.102 8.147-.568 11.233 1.329a.78.78 0 0 1 .257 1.074zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 1 1-.543-1.792c3.532-1.072 9.404-.865 13.115 1.338a.937.937 0 0 1-.955 1.611z" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}
