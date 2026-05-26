"use client";

import { useEffect, useRef } from "react";
import { TEAM_MEMBERS } from "./types";

// ─── TeamSection ──────────────────────────────────────────────────────────────
export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll<HTMLElement>("[data-card]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 130);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#111111",
        padding: "80px 60px",
        borderTop: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
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
              THE PEOPLE BEHIND THE MOVEMENT
            </span>
            <div style={{ width: 40, height: 1, background: "#D4AF37" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 5vw, 64px)",
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            MEET THE TEAM
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────
function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM_MEMBERS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = (hover: boolean) => {
    const el = cardRef.current;
    if (!el) return;
    const overlay = el.querySelector<HTMLElement>("[data-overlay]");
    if (overlay) overlay.style.opacity = hover ? "1" : "0";
    el.style.borderColor = hover ? "#D4AF37" : "rgba(255,255,255,0.08)";
  };

  return (
    <div
      ref={cardRef}
      data-card
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{
        opacity: 0,
        transform: "translateY(32px)",
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s, border-color 0.25s`,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        cursor: "default",
        background: "#0D0D0D",
      }}
    >
      {/* Photo */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          background: "#1A1A1A",
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
            filter: "grayscale(20%) brightness(0.85)",
            transition: "transform 0.5s ease, filter 0.5s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.transform = "scale(1.05)";
            (e.target as HTMLImageElement).style.filter = "grayscale(0%) brightness(1)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.transform = "scale(1)";
            (e.target as HTMLImageElement).style.filter = "grayscale(20%) brightness(0.85)";
          }}
        />
        {/* Gold gradient bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          }}
        />
        {/* Hover bio overlay */}
        <div
          data-overlay
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              margin: 0,
            }}
          >
            {member.bio}
          </p>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "16px 18px 20px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            color: "#FFFFFF",
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "#D4AF37",
            textTransform: "uppercase",
            marginTop: 5,
          }}
        >
          {member.role}
        </div>
      </div>
    </div>
  );
}
