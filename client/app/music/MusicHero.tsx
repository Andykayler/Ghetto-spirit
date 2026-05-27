"use client";

import { useEffect, useRef } from "react";

// ─── MusicHero ────────────────────────────────────────────────────────────────
export function MusicHero() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      {/* Background – two artists image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/music-videos/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.42) sepia(0.35)",
        }}
      />

      {/* Dark left vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.1) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold haze */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 70% at 65% 50%, rgba(212,175,55,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Crown watermark – top right */}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 40,
          zIndex: 2,
          opacity: 0.55,
        }}
      >
        <CrownWatermark />
      </div>

      {/* Left content */}
      <div
        ref={headRef}
        style={{
          position: "relative",
          zIndex: 3,
          padding: "64px 60px",
          maxWidth: 580,
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.24em",
              color: "#D4AF37",
              textTransform: "uppercase",
            }}
          >
            MUSIC &amp; VIDEOS
          </span>
          <div style={{ width: 44, height: 1, background: "#D4AF37" }} />
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(60px, 8vw, 100px)",
            lineHeight: 0.92,
            margin: "0 0 6px 0",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>RAW SOUNDS.</span>
          <br />
          <span style={{ color: "#D4AF37" }}>REAL STORIES.</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.65)",
            margin: "22px 0 36px",
            maxWidth: 360,
          }}
        >
          Explore the latest music, official videos, freestyles, and
          behind-the-scenes content from our artists.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <HeroButton
            label="LATEST RELEASES →"
            variant="gold"
            href="#featured"
          />
          <HeroButton label="BROWSE ALL" variant="outline" href="#featured" />
        </div>
      </div>
    </section>
  );
}

// ─── HeroButton ───────────────────────────────────────────────────────────────
function HeroButton({
  label,
  variant,
  href,
}: {
  label: string;
  variant: "gold" | "outline";
  href: string;
}) {
  const isGold = variant === "gold";
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 28px",
        background: isGold ? "#D4AF37" : "transparent",
        border: isGold ? "none" : "1.5px solid rgba(255,255,255,0.5)",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.16em",
        color: isGold ? "#0A0A0A" : "#FFFFFF",
        textDecoration: "none",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.25s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (isGold) {
          el.style.background = "#F0CB50";
        } else {
          el.style.borderColor = "#D4AF37";
          el.style.color = "#D4AF37";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (isGold) {
          el.style.background = "#D4AF37";
        } else {
          el.style.borderColor = "rgba(255,255,255,0.5)";
          el.style.color = "#FFFFFF";
        }
      }}
    >
      {label}
    </a>
  );
}

// ─── Crown Watermark (SVG) ───────────────────────────────────────────────────
function CrownWatermark() {
  return (
    <svg
      width={160}
      height={130}
      viewBox="0 0 160 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crown shape */}
      <path
        d="M20 110 L10 35 L50 65 L80 10 L110 65 L150 35 L140 110 Z"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Drip lines */}
      <line x1="35" y1="110" x2="35" y2="125" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="110" x2="60" y2="122" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="110" x2="80" y2="128" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="110" x2="100" y2="120" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="110" x2="125" y2="124" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      {/* GS in center */}
      <text
        x="80"
        y="90"
        textAnchor="middle"
        fill="#D4AF37"
        fontSize="22"
        fontWeight="bold"
        fontFamily="serif"
      >
        GS
      </text>
    </svg>
  );
}
