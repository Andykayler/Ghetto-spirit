"use client";

import { useState, useEffect, useRef } from "react";
import { VIDEO_CATEGORIES, VIDEOS, VideoCategory, Video } from "./types";
import { usePlayer } from "./PlayerContext";

// ─── FeaturedVideos ───────────────────────────────────────────────────────────
export function FeaturedVideos() {
  const [active, setActive] = useState<VideoCategory>("ALL");
  const { play, currentVideo, playing } = usePlayer();
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = active === "ALL" ? VIDEOS : VIDEOS.filter((v) => v.category === active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll<HTMLElement>("[data-vcard]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured" ref={sectionRef} style={{ background: "#0A0A0A", padding: "60px 60px 20px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#FFFFFF", letterSpacing: "0.1em", margin: 0 }}>
              FEATURED VIDEOS
            </h2>
            <div style={{ width: 48, height: 1.5, background: "#D4AF37" }} />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {VIDEO_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12,
                letterSpacing: "0.14em", color: active === cat ? "#D4AF37" : "rgba(255,255,255,0.45)",
                background: "none", border: "none", cursor: "pointer", textTransform: "uppercase",
                borderBottom: active === cat ? "1.5px solid #D4AF37" : "1.5px solid transparent",
                padding: "6px 10px", transition: "color 0.2s",
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {filtered.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              isCurrent={currentVideo?.id === video.id}
              isPlaying={currentVideo?.id === video.id && playing}
              onPlay={() => play(video)}
            />
          ))}
        </div>

        {/* View all */}
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0 20px" }}>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px",
            border: "1.5px solid rgba(255,255,255,0.3)",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13,
            letterSpacing: "0.18em", color: "#FFFFFF", textDecoration: "none", textTransform: "uppercase",
            transition: "border-color 0.25s, color 0.25s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#D4AF37"; el.style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.color = "#FFFFFF"; }}
          >
            VIEW ALL VIDEOS →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  "OFFICIAL VIDEOS": "#D4AF37",
  "MUSIC": "#D4AF37",
  "FREESTYLES": "#E07B39",
  "BEHIND THE SCENES": "#A0C4A0",
};

function VideoCard({ video, index, isCurrent, isPlaying, onPlay }: {
  video: Video; index: number; isCurrent: boolean; isPlaying: boolean; onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-vcard
      style={{
        opacity: 0, transform: "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s, border-color 0.25s`,
        background: isCurrent ? "#161108" : "#111111",
        cursor: "pointer",
        border: `1px solid ${isCurrent ? "rgba(212,175,55,0.5)" : hovered ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.06)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#1A1212" }}>
        <img src={video.thumbnail} alt={video.title} style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hovered ? "brightness(0.65)" : "brightness(0.5)",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.4s ease, filter 0.4s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          background: "rgba(0,0,0,0.75)",
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
          fontSize: 11, color: "#FFFFFF", padding: "2px 6px",
        }}>
          {video.duration}
        </div>
        {/* Play button */}
        <button onClick={onPlay} style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", background: "none", border: "none", cursor: "pointer",
          opacity: hovered || isCurrent ? 1 : 0.6, transition: "opacity 0.25s",
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: isPlaying ? "#D4AF37" : "rgba(255,255,255,0.12)",
            border: `2px solid ${isPlaying ? "#D4AF37" : "rgba(255,255,255,0.7)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: hovered ? "scale(1.1)" : "scale(1)", transition: "all 0.25s",
            backdropFilter: "blur(4px)",
          }}>
            {isPlaying
              ? <div style={{ display: "flex", gap: 3 }}>
                  <div style={{ width: 3, height: 14, background: "#0A0A0A" }} />
                  <div style={{ width: 3, height: 14, background: "#0A0A0A" }} />
                </div>
              : <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "14px solid #FFFFFF", marginLeft: 3 }} />
            }
          </div>
        </button>
        {/* Currently playing gold bar */}
        {isCurrent && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#D4AF37" }}>
            <div style={{
              height: "100%", background: "rgba(0,0,0,0.3)",
              animation: "scanLine 2s linear infinite",
            }} />
          </div>
        )}
      </div>

      <div style={{ padding: "12px 12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 10,
            letterSpacing: "0.18em", color: CAT_COLORS[video.category] ?? "#D4AF37", textTransform: "uppercase",
          }}>
            {video.category}
          </span>
          <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, padding: "0 2px" }}>⋮</button>
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: isCurrent ? "#D4AF37" : "#FFFFFF",
          letterSpacing: "0.06em", lineHeight: 1.2, marginBottom: 4,
        }}>
          {video.title}
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {video.artist}
        </div>
      </div>
    </div>
  );
}
