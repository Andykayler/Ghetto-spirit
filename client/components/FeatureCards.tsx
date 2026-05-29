"use client";

import Link from "next/link";
import "./feature-cards.css";

const cards = [
  {
    id: "raw-talents",
    num: "01",
    title: "RAW TALENTS",
    desc: "We find and develop the next generation of artists straight from the streets — unfiltered, authentic, unstoppable.",
    href: "/artists",
    cta: "Meet the Artists",
    bg: "/images/card-raw-talents.jpg",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
  },
  {
    id: "real-content",
    num: "02",
    title: "REAL CONTENT",
    desc: "Original music, music videos, freestyle sessions, interviews and behind-the-scenes content — culture in its rawest form.",
    href: "/music",
    cta: "Watch & Listen",
    bg: "/images/card-real-content.jpg",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
  {
    id: "events-shows",
    num: "03",
    title: "EVENTS & SHOWS",
    desc: "Live competitions, concerts, showcases and cultural events that bring the community together and put talent on the map.",
    href: "/events",
    cta: "See Events",
    bg: "/images/card-events.jpg",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
        <path d="m9 16 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: "growing-together",
    num: "04",
    title: "GROWING TOGETHER",
    desc: "From mentorship to management, we build long-term careers and create real opportunities that last beyond the moment.",
    href: "/about",
    cta: "Our Story",
    bg: "/images/card-growing.jpg",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10"/>
        <line x1="12" x2="12" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="14"/>
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <section className="fc-section">
      <div className="fc-grid">
        {cards.map((card) => (
          <div key={card.id} className="fc-card">
            {/* Background photo */}
            <div
              className="fc-card-bg"
              style={{ backgroundImage: `url('${card.bg}')` }}
            />

            {/* Overlay */}
            <div className="fc-card-overlay" />

            {/* Gold top accent */}
            <div className="fc-card-accent" />

            {/* Number watermark */}
            <div className="fc-card-number">{card.num}</div>

            {/* Content */}
            <div className="fc-card-content">
              <div className="fc-card-icon">{card.icon}</div>
              <h3 className="fc-card-title">{card.title}</h3>
              <p className="fc-card-desc">{card.desc}</p>
              <Link href={card.href} className="fc-card-arrow">
                {card.cta}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}