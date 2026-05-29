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
        padding: "28px 60px 24px",                       // ← tighter padding
        borderBottom: "1px solid rgba(212,175,55,0.4)",  // ← gold bottom border
      }}
    >
      <style>{`
        @media (max-width: 980px) {
          .about-hero-section { padding: 20px 24px 18px !important; }
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
        ref={headlineRef}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 1px 0.8fr 0.8fr",
          gap: "28px",                                   // ← tighter gap
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <div>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#888",
            marginBottom: 10,                            // ← tighter
            textTransform: "uppercase",
          }}>
            HOME / <span style={{ color: "#D4AF37" }}>ABOUT US</span>
          </p>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",        // ← much smaller
            lineHeight: 0.95,
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

          <div style={{ width: 48, height: 2, background: "#D4AF37", margin: "12px 0" }} />

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
            RAW TALENT. REAL CULTURE. BIGGER DREAMS.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="about-hero-divider" style={{
          width: 1,
          height: 80,                                    // ← shorter
          background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
          opacity: 0.6,
        }} />

        {/* CENTER: body copy */}
        <div className="about-hero-body">
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            color: "#c5c5c5",
            fontSize: 13,
            lineHeight: 1.75,
            maxWidth: 300,
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
              gap: 8,
              padding: "11px 22px",                      // ← smaller button
              border: "1.5px solid #FFFFFF",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.16em",
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
            <span style={{ fontSize: 14 }}>→</span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
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