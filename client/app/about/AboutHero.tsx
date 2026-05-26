"use client";

import { useEffect, useRef } from "react";

// ─── AboutHero ────────────────────────────────────────────────────────────────

export function AboutHero() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: 580,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      {/* Background concert image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/about/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.38) sepia(0.4)",
        }}
      />

      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Left content */}
      <div
        ref={headlineRef}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "60px 60px 60px 60px",
          maxWidth: 560,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.22em",
              color: "#D4AF37",
              textTransform: "uppercase",
            }}
          >
            ABOUT US
          </span>
          <div style={{ width: 48, height: 1, background: "#D4AF37" }} />
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(52px, 7vw, 84px)",
            lineHeight: 0.95,
            color: "#FFFFFF",
            margin: "0 0 4px 0",
            letterSpacing: "0.02em",
          }}
        >
          MORE THAN
          <br />
          MUSIC.{" "}
          <span style={{ color: "#D4AF37" }}>IT&apos;S A</span>
          <br />
          <span style={{ color: "#D4AF37" }}>MOVEMENT.</span>
        </h1>

        {/* Body copy */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)",
            margin: "24px 0 36px 0",
            maxWidth: 360,
          }}
        >
          Ghetto Spirit Entertainment is a global platform built to discover,
          develop, and empower raw talent. We represent the streets, the
          struggle, and the spirit of a generation that refuses to be ignored.
        </p>

        {/* CTA */}
        <a
          href="#mission"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            border: "1.5px solid #FFFFFF",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "background 0.25s, color 0.25s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#D4AF37";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D4AF37";
            (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FFFFFF";
            (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
          }}
        >
          JOIN THE MOVEMENT
          <span style={{ fontSize: 16 }}>→</span>
        </a>
      </div>

      {/* Right side tagline */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          textAlign: "right",
        }}
      >
        {["RAW TALENT.", "REAL CULTURE.", "BIGGER DREAMS."].map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(18px, 2.2vw, 28px)",
              letterSpacing: "0.08em",
              color: i === 2 ? "#D4AF37" : "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
              animationDelay: `${0.3 + i * 0.15}s`,
            }}
          >
            {line}
          </div>
        ))}
        {/* Crown icon */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <CrownIcon size={32} color="#D4AF37" />
        </div>
      </div>
    </section>
  );
}

// ─── Inline Crown Icon ─────────────────────────────────────────────────────────
function CrownIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M2 19h20v2H2v-2zM2 5l5 7 5-9 5 9 5-7v12H2V5z" />
    </svg>
  );
}
