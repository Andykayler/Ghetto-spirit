"use client";

import { useEffect, useRef } from "react";

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
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0A0A0A",
        padding: "48px 60px 36px",
      }}
    >
      <style>{`
        @media (max-width: 980px) {
          .about-hero-section { padding: 36px 24px 28px !important; }
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .about-hero-divider,
          .about-hero-body,
          .about-hero-cta { display: none !important; }
        }
      `}</style>

      {/* Background */}
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

      {/* Grid */}
      <div
        className="about-hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 1px 0.8fr 0.8fr",
          gap: "36px",
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <div ref={headlineRef}>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.12em",
            color: "#888",
            marginBottom: 16,
            textTransform: "uppercase",
          }}>
            HOME / <span style={{ color: "#D4AF37" }}>ABOUT US</span>
          </p>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            lineHeight: 0.92,
            color: "#FFFFFF",
            margin: 0,
            letterSpacing: "0.02em",
          }}>
            MORE THAN
            <br />
            MUSIC.{" "}
            <span style={{ color: "#D4AF37" }}>IT&apos;S A</span>
            <br />
            <span style={{ color: "#D4AF37" }}>MOVEMENT.</span>
          </h1>

          <div style={{ width: 72, height: 3, background: "#D4AF37", margin: "20px 0" }} />

          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            color: "#D4AF37",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.2em",
            fontStyle: "italic",
            textTransform: "uppercase",
            margin: 0,
          }}>
            RAW TALENT. REAL CULTURE. BIGGER DREAMS.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="about-hero-divider" style={{
          width: 1,
          height: 120,
          background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
          opacity: 0.6,
        }} />

        {/* CENTER: body copy */}
        <div className="about-hero-body">
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            color: "#c5c5c5",
            fontSize: 14,
            lineHeight: 1.85,
            maxWidth: 340,
            margin: 0,
          }}>
            Ghetto Spirit Entertainment is a global platform built to discover,
            develop, and empower raw talent. We represent the streets, the
            struggle, and the spirit of a generation that refuses to be ignored.
          </p>
        </div>

        {/* RIGHT: CTA */}
        <div className="about-hero-cta" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
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
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = "#D4AF37";
              e.currentTarget.style.borderColor = "#D4AF37";
              e.currentTarget.style.color = "#0A0A0A";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#FFFFFF";
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
            JOIN THE MOVEMENT
            <span style={{ fontSize: 16 }}>→</span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
        zIndex: 1,
      }} />
    </section>
  );
}