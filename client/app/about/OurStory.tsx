"use client";

import { useEffect, useRef } from "react";
import { MILESTONES } from "./types";

// ─── OurStory ─────────────────────────────────────────────────────────────────
export function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>("[data-milestone]");
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateX(0)";
              }, i * 160);
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
        background: "#0A0A0A",
        padding: "80px 60px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 56 }}>
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
              OUR JOURNEY
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
            THE STORY SO FAR
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 0,
              bottom: 0,
              width: 1,
              background:
                "linear-gradient(to bottom, transparent, #D4AF37 15%, #D4AF37 85%, transparent)",
              opacity: 0.35,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                data-milestone
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 48,
                  padding: "36px 0",
                  borderBottom:
                    i < MILESTONES.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  opacity: 0,
                  transform: "translateX(-24px)",
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                  alignItems: "flex-start",
                }}
              >
                {/* Year with dot */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 24,
                    paddingTop: 4,
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#D4AF37",
                      border: "2px solid #0A0A0A",
                      outline: "2px solid #D4AF37",
                      flexShrink: 0,
                      marginLeft: 75,
                      marginTop: 6,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 36,
                      color: i === MILESTONES.length - 1 ? "#D4AF37" : "rgba(255,255,255,0.2)",
                      letterSpacing: "0.06em",
                      lineHeight: 1,
                    }}
                  >
                    {m.year}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22,
                      color: "#FFFFFF",
                      letterSpacing: "0.08em",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {m.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.6)",
                      margin: 0,
                      maxWidth: 520,
                    }}
                  >
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
