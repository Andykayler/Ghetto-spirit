"use client";

import { useEffect, useRef } from "react";
import { STATS } from "./types";

function CrownIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="#D4AF37">
      <path d="M2 19h20v2H2v-2zM2 5l5 7 5-9 5 9 5-7v12H2V5z" />
    </svg>
  );
}
function MusicIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="#D4AF37">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="#D4AF37">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

const ICON_MAP = { crown: CrownIcon, music: MusicIcon, globe: GlobeIcon };

export function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll<HTMLElement>("[data-reveal]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      style={{
        background: "#111111",
        padding: "70px 60px",
        borderTop: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .mv-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 0 !important;
          }
          .mv-section {
            padding: 48px 24px !important;
          }
          .mv-logo-card {
            aspect-ratio: unset !important;
            padding: 32px 24px !important;
            min-height: 180px !important;
          }
          .mv-stats {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 20px !important;
          }
          .mv-stats > div {
            flex: 1 1 40% !important;
          }
        }
      `}</style>

      <div
        className="mv-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 1fr auto",
          gap: 48,
          alignItems: "start",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Logo card */}
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div
            className="mv-logo-card"
            style={{
              width: "100%",
              aspectRatio: "4/3",
              border: "1px solid rgba(212,175,55,0.3)",
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1610 50%, #0a0a0a 100%)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Corner accents */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: 24, height: 24,
              borderTop: "2px solid #D4AF37",
              borderLeft: "2px solid #D4AF37",
            }} />
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 24, height: 24,
              borderTop: "2px solid #D4AF37",
              borderRight: "2px solid #D4AF37",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: 24, height: 24,
              borderBottom: "2px solid #D4AF37",
              borderLeft: "2px solid #D4AF37",
            }} />
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 24, height: 24,
              borderBottom: "2px solid #D4AF37",
              borderRight: "2px solid #D4AF37",
            }} />

            {/* Gold glow behind logo */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <img
              src="/images/logo.png"
              alt="Ghetto Spirit Entertainment"
              style={{
                width: "75%",
                maxWidth: 200,
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 0 16px rgba(212,175,55,0.4))",
              }}
            />
          </div>
        </div>

        {/* Mission */}
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26,
            letterSpacing: "0.1em",
            color: "#D4AF37",
            margin: "0 0 16px 0",
          }}>
            OUR MISSION
          </h3>
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.7)",
            margin: 0,
          }}>
            To create opportunities for independent artists, elevate real
            stories, and build a legacy that inspires the world.
          </p>
          <div style={{ width: 32, height: 2, background: "#D4AF37", marginTop: 20 }} />
        </div>

        {/* Vision */}
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26,
            letterSpacing: "0.1em",
            color: "#D4AF37",
            margin: "0 0 16px 0",
          }}>
            OUR VISION
          </h3>
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.7)",
            margin: 0,
          }}>
            To be the leading entertainment brand that transforms lives through
            music, culture, and community.
          </p>
          <div style={{ width: 32, height: 2, background: "#D4AF37", marginTop: 20 }} />
        </div>

        {/* Stats */}
        <div
          data-reveal
          className="mv-stats"
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {STATS.map((stat) => {
            const Icon = ICON_MAP[stat.icon as keyof typeof ICON_MAP];
            return (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Icon />
                <div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 32,
                    color: "#FFFFFF",
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}