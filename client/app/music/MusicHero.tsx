"use client";

import { useEffect, useRef } from "react";

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
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0A0A0A",
        padding: "28px 60px 24px",        // ← tighter padding
        borderBottom: "1px solid rgba(212,175,55,0.4)", // ← gold bottom border
      }}
    >
      <style>{`
        @media (max-width: 980px) {
          .music-hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .music-hero-divider,
          .music-hero-body,
          .music-hero-cta { display: none !important; }
          .music-hero-section { padding: 20px 24px 18px !important; }
        }
      `}</style>

      {/* Background */}
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

      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(212,175,55,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Crown watermark */}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 24,
          zIndex: 2,
          opacity: 0.45,
        }}
      >
        <CrownWatermark />
      </div>

      {/* Grid */}
      <div
        ref={headRef}
        className="music-hero-grid"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 1px 0.8fr 0.8fr",
          gap: "28px",                    // ← tighter gap
          alignItems: "center",
        }}
      >
        {/* LEFT: headline */}
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#888",
            marginBottom: 10,             // ← tighter
            textTransform: "uppercase",
          }}>
            HOME / <span style={{ color: "#D4AF37" }}>MUSIC &amp; VIDEOS</span>
          </p>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)", // ← much smaller
            lineHeight: 0.95,
            color: "#FFFFFF",
            margin: 0,
            letterSpacing: "0.02em",
          }}>
            RAW SOUNDS.
            <br />
            <span style={{ color: "#D4AF37" }}>REAL STORIES.</span>
          </h1>

          <div style={{ width: 48, height: 2, background: "#D4AF37", margin: "12px 0" }} /> {/* ← smaller bar */}

          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            color: "#D4AF37",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            fontStyle: "italic",
            textTransform: "uppercase",
            margin: 0,
          }}>
            LATEST MUSIC. OFFICIAL VIDEOS. FREESTYLES.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="music-hero-divider" style={{
          width: 1,
          height: 80,                     // ← shorter
          background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
          opacity: 0.6,
        }} />

        {/* CENTER: body copy */}
        <div className="music-hero-body">
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            color: "#c5c5c5",
            fontSize: 13,
            lineHeight: 1.75,
            maxWidth: 300,
            margin: 0,
          }}>
            Explore the latest music, official videos, freestyles, and
            behind-the-scenes content from our artists.
          </p>
        </div>

        {/* RIGHT: CTAs */}
        <div className="music-hero-cta" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <a
            href="#featured"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",       // ← smaller buttons
              background: "#D4AF37",
              border: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "#0A0A0A",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "background 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = "#F0CB50";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = "#D4AF37";
            }}
          >
            LATEST RELEASES →
          </a>
          <a
            href="#featured"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.4)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "#FFFFFF",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "all 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = "#D4AF37";
              e.currentTarget.style.color = "#D4AF37";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
            BROWSE ALL
          </a>
        </div>
      </div>

      {/* Bottom fade — sits just above the border */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 36,
        background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
        zIndex: 1,
      }} />
    </section>
  );
}

// ─── Crown Watermark ──────────────────────────────────────────────────────────
function CrownWatermark() {
  return (
    <svg width={100} height={82} viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 110 L10 35 L50 65 L80 10 L110 65 L150 35 L140 110 Z"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <line x1="35" y1="110" x2="35" y2="125" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="110" x2="60" y2="122" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="110" x2="80" y2="128" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="110" x2="100" y2="120" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="110" x2="125" y2="124" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <text x="80" y="90" textAnchor="middle" fill="#D4AF37" fontSize="22" fontWeight="bold" fontFamily="serif">GS</text>
    </svg>
  );
}