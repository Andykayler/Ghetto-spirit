"use client";

export function AboutCTA() {
  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "80px 60px",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .about-cta-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 32px !important;
          }
          .about-cta-section {
            padding: 48px 24px !important;
          }
        }
      `}</style>

      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/about/cta-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.15) sepia(0.6)",
        }}
      />

      {/* Gold diagonal accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="about-cta-inner"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
        }}
      >
        {/* Left text */}
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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
              BECOME PART OF THE MOVEMENT
            </span>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 5vw, 68px)",
              color: "#FFFFFF",
              margin: "0 0 20px 0",
              letterSpacing: "0.03em",
              lineHeight: 0.95,
            }}
          >
            YOUR STORY
            <br />
            <span style={{ color: "#D4AF37" }}>BELONGS HERE.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 15,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              maxWidth: 460,
            }}
          >
            Whether you are an artist, producer, or believer in the culture —
            Ghetto Spirit is your platform. Join a community that refuses to be
            silent.
          </p>
        </div>

        {/* Right: single button */}
        <div style={{ flexShrink: 0 }}>
          <a
            href="/artists"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 40px",
              border: "1.5px solid rgba(255,255,255,0.3)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.16em",
              color: "#FFFFFF",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "border-color 0.25s, background 0.25s",
              minWidth: 220,
              textAlign: "center",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = "#D4AF37";
              e.currentTarget.style.background = "rgba(212,175,55,0.08)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            MEET OUR ARTISTS
          </a>
        </div>
      </div>
    </section>
  );
}