"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const socialSideLinks = [
  { handle: "@GHETTOSPIRIT_ENT", platform: "Instagram" },
  { handle: "@GHETTOSPIRIT_ENT", platform: "TikTok" },
  { handle: "GHETTO SPIRIT ENT", platform: "YouTube" },
  { handle: "GHETTO SPIRIT ENT", platform: "Facebook" },
  { handle: "@GHETTOSPIRITENT", platform: "X" },
];

const NAVBAR_HEIGHT = 80; // match your actual navbar height in px

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingTop: `${NAVBAR_HEIGHT}px`,
        paddingBottom: "72px", // music player height
      }}
    >
      {/* ── FULL-BLEED BACKGROUND via CSS background-image ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Left dark vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.55) 100%)",
          zIndex: 1,
        }}
      />
      {/* Top/bottom vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.85) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── MAIN CONTENT ROW ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flex: 1,
          alignItems: "stretch",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px - 160px - 72px)`,
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 64px",
            maxWidth: "560px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-30px)",
            transition: "all 0.8s ease",
          }}
        >
          {/* Headline */}
          <div style={{ marginBottom: "16px" }}>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(56px, 7.5vw, 92px)",
                color: "#ffffff",
                textShadow: "0 2px 40px rgba(0,0,0,0.9)",
                lineHeight: 0.93,
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              FROM THE STREETS
            </h1>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(56px, 7.5vw, 92px)",
                background: "linear-gradient(90deg, #F5C842, #D4A017, #A07810)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 0.93,
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              TO THE STAGE
            </h1>
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: "50px",
              height: "3px",
              background: "linear-gradient(90deg, #D4A017, #F5C842)",
              marginBottom: "20px",
            }}
          />

          {/* Sub-headline */}
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              color: "#E0E0E0",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            RAW TALENT.{" "}
            <span style={{ color: "#CC0000" }}>REAL CULTURE.</span>{" "}
            BIGGER DREAMS.
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "14px",
              color: "#999",
              maxWidth: "340px",
              lineHeight: 1.75,
              marginBottom: "32px",
            }}
          >
            Ghetto Spirit Entertainment is more than a brand.
            It&apos;s a movement built to discover, develop and promote raw
            talents from the ghetto to the world.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                letterSpacing: "2px",
                fontSize: "13px",
                color: "#000",
                background: "linear-gradient(135deg, #F5C842, #D4A017)",
                border: "none",
                padding: "12px 24px",
                cursor: "pointer",
                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z" />
              </svg>
              WATCH NOW
            </button>

            <Link
              href="/artists"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                letterSpacing: "2px",
                fontSize: "13px",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "12px 24px",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#F5C842";
                e.currentTarget.style.color = "#F5C842";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              EXPLORE ARTISTS
            </Link>
          </div>
        </div>

        {/* CENTER — let bg photo show through */}
        <div style={{ flex: 1 }} />

        {/* RIGHT PANEL — social links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "48px 32px",
            width: "240px",
            flexShrink: 0,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(30px)",
            transition: "all 0.8s ease 0.4s",
          }}
        >
          {/* WE ARE THE FUTURE */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              right: "5%",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(18px, 2.2vw, 34px)",
              color: "rgba(255,255,255,0.12)",
              lineHeight: 1.1,
              textAlign: "right",
              transform: "rotate(-1deg)",
              letterSpacing: "3px",
              pointerEvents: "none",
            }}
          >
            WE ARE<br />THE FUTURE
          </div>

          {/* CONNECT WITH US */}
          <div>
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                color: "#D4A017",
                letterSpacing: "3px",
                marginBottom: "16px",
              }}
            >
              CONNECT WITH US
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {socialSideLinks.map((s) => (
                <a
                  key={s.platform}
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const span = e.currentTarget.querySelector("span:last-child") as HTMLElement;
                    if (span) span.style.color = "#F5C842";
                  }}
                  onMouseLeave={(e) => {
                    const span = e.currentTarget.querySelector("span:last-child") as HTMLElement;
                    if (span) span.style.color = "#ccc";
                  }}
                >
                  <span style={{ color: "#D4A017", opacity: 0.85, flexShrink: 0 }}>
                    <SocialIcon platform={s.platform} />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "1px",
                      color: "#ccc",
                      transition: "color 0.2s",
                    }}
                  >
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FEATURE CARDS ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          minHeight: "160px",
        }}
      >
        {[
          {
            icon: "mic",
            title: "RAW TALENTS",
            desc: "Discovering the next big stars from the streets.",
            img: "/images/card-raw-talents.jpg",
          },
          {
            icon: "play",
            title: "REAL CONTENT",
            desc: "Music, videos, interviews, freestyles & more.",
            img: "/images/card-real-content.jpg",
          },
          {
            icon: "calendar",
            title: "EVENTS & SHOWS",
            desc: "Competitions, concerts and live experiences.",
            img: "/images/card-events.jpg",
          },
          {
            icon: "chart",
            title: "GROWING TOGETHER",
            desc: "Building careers and creating lasting impact.",
            img: "/images/card-growing.jpg",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "20px",
              minHeight: "160px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            {/* Card bg via CSS */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${card.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            />
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
              }}
            />
            {/* Text */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <CardIcon type={card.icon} />
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  color: "#fff",
                  letterSpacing: "1.5px",
                  margin: "8px 0 4px",
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "12px",
                  color: "#aaa",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardIcon({ type }: { type: string }) {
  const s = { color: "#CC0000" };
  if (type === "mic")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  if (type === "play")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <polygon points="5,3 19,12 5,21" />
      </svg>
    );
  if (type === "calendar")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform === "Instagram")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  if (platform === "TikTok")
    return (
      <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.16 8.16 0 0 0 4.77 1.52V7.1a4.85 4.85 0 0 1-1-.41z" />
      </svg>
    );
  if (platform === "YouTube")
    return (
      <svg width="16" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  if (platform === "Facebook")
    return (
      <svg width="8" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}