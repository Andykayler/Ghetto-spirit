"use client";

import { HeroCrown } from "./HeroCrown";

export function ArtistsHero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        padding: "48px 60px 36px",
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.82) 45%, rgba(10,10,10,0.55) 100%), url('/artists-bg.jpg') center/cover no-repeat",
          zIndex: 0,
        }}
      />

      {/* GOLD GLOW */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "10%",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 45%, transparent 75%)",
          filter: "blur(10px)",
          zIndex: 0,
        }}
      />

      {/* MAIN CONTENT */}
      <div
        className="hero-grid"
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
        <div>
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#888",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            HOME / <span style={{ color: "#D4AF37" }}>ARTISTS</span>
          </p>

          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 0.92,
              margin: 0,
              color: "#fff",
              letterSpacing: "0.03em",
            }}
          >
            OUR
            <br />
            <span style={{ color: "#D4AF37" }}>ARTISTS</span>
          </h1>

          <div
            style={{
              width: "72px",
              height: "3px",
              background: "#D4AF37",
              margin: "20px 0",
            }}
          />

          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: "#D4AF37",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              fontStyle: "italic",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            RAW TALENT. REAL STORIES. ONE MOVEMENT.
          </p>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "1px",
            height: "120px",
            background:
              "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
            opacity: 0.6,
          }}
        />

        {/* CENTER TEXT */}
        <div>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "#c5c5c5",
              fontSize: "14px",
              lineHeight: 1.85,
              maxWidth: "340px",
              margin: 0,
            }}
          >
            We represent a diverse family of artists who live the culture and
            speak the truth. From emerging voices to established forces, this
            is the future of entertainment.
          </p>
        </div>

        {/* RIGHT CROWN */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div style={{ opacity: 0.95 }}>
            <HeroCrown />
          </div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50px",
          background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* RESPONSIVE */}
      <style jsx>{`
        section {
          min-height: unset !important;
        }

        @media (max-width: 980px) {
          section {
            padding: 36px 24px 28px !important;
          }

          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          /* hide divider and crown on tablet/mobile */
          .hero-grid > div:nth-child(2),
          .hero-grid > div:nth-child(4) {
            display: none !important;
          }

          /* center text col takes full width */
          .hero-grid > div:nth-child(3) {
            grid-column: 1 !important;
          }

          h1 {
            font-size: 3rem !important;
          }
        }

        @media (max-width: 640px) {
          h1 {
            font-size: 2.6rem !important;
          }
        }
      `}</style>
    </section>
  );
}