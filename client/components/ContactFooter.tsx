import React from "react";
import "./ContactFooter.css";
const NAV_LINKS = [
  { label: "Home", href: "/" },
  
  { label: "About Us", href: "/about" },
  
  { label: "Artists", href: "/artists" },
  { label: "Contact", href: "/contact" },
  { label: "Music & Videos", href: "/music" },
  { label: "Join The Movement", href: "/contact" },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ghettospiritent?igsh=MWxnYmg0c3U3Y3Y1NQ==",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@ghetto.spirit.ent",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@ghettospiritentertainment?si=RL6ngQQMCzp09AzI",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Spotify",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 15c2.3-1 5.3-1.3 7.5 0M7 12c3-1.3 6.5-1.3 10 0M8 9c2.8-.8 5.5-.8 8 0" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1KKdya5cTN/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ContactFooter() {
  return (
    <footer className="footer">
      <div className="footer-main">

        {/* ── Join the Movement ── */}
        <div>
          <div className="footer-join-heading">
            <svg viewBox="0 0 24 24" strokeWidth="1.5">
              <path d="M12 2L8 8H2l5 4-2 6 7-4 7 4-2-6 5-4h-6L12 2z" />
            </svg>
            <span className="footer-join-title">Join the Movement</span>
          </div>
          <p className="footer-join-desc">
            Stay updated with the latest music, events,
            <br />
            releases and opportunities.
          </p>
          <div className="email-subscribe">
            <input
              className="email-input-footer"
              type="email"
              placeholder="Enter your email address"
            />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <p className="footer-col-title">Quick Links</p>
          <div className="footer-links-grid">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="footer-link">
                <ArrowRight />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Connect With Us ── */}
        <div>
          <p className="footer-col-title">Connect With Us</p>
          <div className="social-icons">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                className="social-icon"
                href={s.href}
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.svg}
              </a>
            ))}
          </div>
          <p className="hashtag">#GHETTOSPIRITENT</p>
        </div>

        {/* ── Ghost logo watermark ── */}
        <div className="footer-logo-watermark" aria-hidden="true">
          GHETTO
          <br />
          SPIRIT
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © 2025 Ghetto Spirit Entertainment. All Rights Reserved.
        </p>
        <p className="footer-tagline">Raw Talent. Real Culture. Bigger Dreams.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  );
}