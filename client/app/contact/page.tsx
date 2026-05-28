"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&family=Barlow:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-page {
          font-family: 'Barlow', sans-serif;
          background-color: #0A0A0A;
          color: #fff;
          min-height: 100vh;
        }

        /* ── HERO SECTION ── */
        .hero-section {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 580px;
          overflow: hidden;
        }

        .hero-left {
          position: relative;
          z-index: 2;
          padding: 60px 48px 60px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* torn-paper vertical divider */
        .hero-left::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 32px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='600' preserveAspectRatio='none'%3E%3Cpath d='M32,0 L20,30 L32,60 L18,95 L30,130 L16,165 L28,200 L14,235 L26,270 L12,305 L24,340 L10,375 L22,410 L8,445 L20,480 L6,515 L18,550 L4,580 L32,600 L32,0Z' fill='%230A0A0A'/%3E%3C/svg%3E") no-repeat center/cover;
          z-index: 10;
        }

        .hero-bg-image {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              to right,
              rgba(10,10,10,0.85) 0%,
              rgba(10,10,10,0.4) 60%,
              rgba(10,10,10,0.1) 100%
            ),
            url('/contact-hero.jpg') center/cover no-repeat;
          /* Fallback dark atmospheric background */
          background-color: #1a1510;
        }

        /* Atmospheric city-light glow */
        .hero-bg-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 60% 50%, rgba(212,175,55,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 80% 80%, rgba(180,120,30,0.12) 0%, transparent 60%);
        }

        .hero-right {
          position: relative;
          z-index: 2;
          padding: 40px 48px 40px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* ── BREADCRUMB ── */
        .breadcrumb {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #888;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        .breadcrumb span { color: #D4AF37; }

        /* ── HEADLINE ── */
        .hero-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          line-height: 0.92;
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }
        .hero-headline .line-white { color: #fff; display: block; }
        .hero-headline .line-gold  { color: #D4AF37; display: block; }

        /* gold underline accent */
        .headline-underline {
          width: 48px;
          height: 3px;
          background: #D4AF37;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 14px;
          line-height: 1.6;
          color: #aaa;
          max-width: 340px;
          margin-bottom: 8px;
        }
        .hero-subtitle a {
          color: #D4AF37;
          text-decoration: none;
        }

        /* ── CONTACT INFO CARDS ── */
        .contact-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 36px;
        }
        .contact-info-grid .full-width { grid-column: 1 / -1; }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .info-icon {
          width: 38px;
          height: 38px;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-icon svg { width: 18px; height: 18px; stroke: #D4AF37; fill: none; stroke-width: 2; }

        .info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 4px;
        }
        .info-text {
          font-size: 13px;
          color: #ccc;
          line-height: 1.5;
        }

        /* ── CONTACT FORM PANEL ── */
        .form-panel {
          background: rgba(18,16,14,0.96);
          border: 1px solid #2a2520;
          padding: 32px 32px 28px;
          position: relative;
        }

        .form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 6px;
        }
        .form-title-underline {
          width: 36px;
          height: 2px;
          background: #D4AF37;
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }

        .contact-input,
        .contact-textarea {
          background: #1a1814;
          border: 1px solid #2e2c28;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          padding: 11px 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .contact-input::placeholder,
        .contact-textarea::placeholder {
          color: #555;
          font-size: 12px;
          letter-spacing: 0.1em;
        }
        .contact-input:focus,
        .contact-textarea:focus { border-color: #D4AF37; }

        .contact-textarea {
          resize: none;
          height: 100px;
          text-transform: none;
        }

        /* checkbox row */
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .contact-checkbox {
          width: 14px;
          height: 14px;
          border: 1px solid #555;
          background: transparent;
          appearance: none;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
        }
        .contact-checkbox:checked {
          background: #D4AF37;
          border-color: #D4AF37;
        }
        .contact-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 3px; top: 1px;
          width: 5px; height: 8px;
          border: 2px solid #000;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }
        .checkbox-label {
          font-size: 12px;
          color: #888;
          line-height: 1.4;
        }

        /* send button */
        .send-btn {
          background: #D4AF37;
          color: #000;
          border: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 13px 28px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s, transform 0.1s;
        }
        .send-btn:hover { background: #e8c547; }
        .send-btn:active { transform: scale(0.98); }
        .send-btn svg { width: 16px; height: 16px; }

        /* watermark tagline inside form */
        .form-watermark {
          position: absolute;
          bottom: 28px;
          right: 28px;
          text-align: right;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          color: #3a3530;
          line-height: 1.3;
          pointer-events: none;
          user-select: none;
        }

        /* ── FOOTER ── */
        .footer {
          background: #060606;
          border-top: 1px solid #1a1814;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 40px;
          padding: 52px 60px 48px;
          border-bottom: 1px solid #1a1814;
          align-items: start;
        }

        /* join the movement column */
        .footer-join-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .footer-join-heading svg { width: 22px; height: 22px; stroke: #D4AF37; fill: none; }
        .footer-join-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
        }
        .footer-join-desc {
          font-size: 13px;
          color: #777;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .email-subscribe {
          display: flex;
          gap: 0;
        }
        .email-input-footer {
          background: #111;
          border: 1px solid #2a2520;
          border-right: none;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 12px;
          padding: 10px 14px;
          outline: none;
          flex: 1;
          min-width: 0;
        }
        .email-input-footer::placeholder { color: #444; }
        .subscribe-btn {
          background: #D4AF37;
          color: #000;
          border: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 10px 18px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .subscribe-btn:hover { background: #e8c547; }

        /* quick links */
        .footer-col-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 20px;
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
        }
        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #D4AF37; }
        .footer-link svg { width: 12px; height: 12px; stroke: currentColor; flex-shrink: 0; }

        /* connect column */
        .social-icons {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .social-icon {
          width: 38px;
          height: 38px;
          border: 1px solid #2a2520;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          cursor: pointer;
        }
        .social-icon:hover { border-color: #D4AF37; color: #D4AF37; }
        .social-icon svg { width: 16px; height: 16px; }

        .hashtag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #555;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #1a1814;
        }

        /* logo watermark in footer */
        .footer-logo-watermark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: #1e1c18;
          text-align: right;
          align-self: center;
          user-select: none;
        }

        /* ── FOOTER BOTTOM BAR ── */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 60px;
          gap: 16px;
        }
        .footer-copy {
          font-size: 11px;
          color: #444;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .footer-tagline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-style: italic;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #D4AF37;
        }
        .footer-legal {
          display: flex;
          gap: 20px;
        }
        .footer-legal a {
          font-size: 11px;
          color: #444;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal a:hover { color: #D4AF37; }

        @media (max-width: 900px) {
          .hero-section { grid-template-columns: 1fr; }
          .hero-left::after { display: none; }
          .hero-right { padding: 0 24px 40px; }
          .footer-main { grid-template-columns: 1fr 1fr; padding: 40px 24px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; padding: 16px 24px; }
        }
      `}</style>

      <main className="contact-page">
        {/* ── HERO ── */}
        <section className="hero-section">
          {/* atmospheric bg */}
          <div className="hero-bg-image" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

          {/* LEFT: headline + info */}
          <div className="hero-left">
            <Navbar />

            <h1 className="hero-headline">
              <span className="line-white">CONNECT.</span>
              <span className="line-gold">COLLABORATE.</span>
              <span className="line-gold">CREATE IMPACT.</span>
            </h1>
            <div className="headline-underline" />

            <p className="hero-subtitle">
              We&apos;re always looking to work with passionate individuals,
              brands, and communities who align with the movement.{" "}
              <a href="#">Let&apos;s build something legendary together.</a>
            </p>

            <div className="contact-info-grid">
              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="#D4AF37" strokeWidth="1.5" fill="none"/></svg>
                </div>
                <div>
                  <p className="info-label">Visit Us</p>
                  <p className="info-text">23 Movement Way,<br />Lagos, Nigeria</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                </div>
                <div>
                  <p className="info-label">Email Us</p>
                  <p className="info-text">info@ghettospiritent.com<br />bookings@ghettospiritent.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div>
                  <p className="info-label">Call Us</p>
                  <p className="info-text">+234 803 123 4567<br />+234 909 876 5432</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <p className="info-label">Working Hours</p>
                  <p className="info-text">Mon – Fri: 9AM – 6PM<br />Sat: 10AM – 4PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="hero-right">
            <div className="form-panel">
              <h2 className="form-title">Send Us a Message</h2>
              <div className="form-title-underline" />

              <div className="form-row">
                <input
                  className="contact-input"
                  type="text"
                  name="fullName"
                  placeholder="FULL NAME"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <input
                  className="contact-input"
                  type="email"
                  name="email"
                  placeholder="EMAIL ADDRESS"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <input
                  className="contact-input"
                  type="text"
                  name="subject"
                  placeholder="SUBJECT"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <textarea
                  className="contact-textarea"
                  name="message"
                  placeholder="MESSAGE"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="checkbox-row">
                <input
                  className="contact-checkbox"
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleChange}
                />
                <label className="checkbox-label" htmlFor="subscribe">
                  I&apos;d like to receive updates and news from Ghetto Spirit ENT.
                </label>
              </div>

              <button className="send-btn" onClick={handleSubmit}>
                SEND MESSAGE
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div className="form-watermark">
                RESPECT<br />THE CULTURE.<br />REP THE MOVEMENT.
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-main">
            {/* Join the movement */}
            <div>
              <div className="footer-join-heading">
                <svg viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M12 2L8 8H2l5 4-2 6 7-4 7 4-2-6 5-4h-6L12 2z"/>
                </svg>
                <span className="footer-join-title">Join the Movement</span>
              </div>
              <p className="footer-join-desc">
                Stay updated with the latest music, events,<br />releases and opportunities.
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

            {/* Quick links */}
            <div>
              <p className="footer-col-title">Quick Links</p>
              <div className="footer-links-grid">
                {[
                  "Home", "Events & Competitions",
                  "About Us", "Gallery",
                  "Artists", "Contact",
                  "Music & Videos", "Join The Movement",
                ].map((link) => (
                  <a key={link} href="#" className="footer-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <p className="footer-col-title">Connect With Us</p>
              <div className="social-icons">
                {/* Instagram */}
                <a className="social-icon" href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a className="social-icon" href="#" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a className="social-icon" href="#" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="5" width="20" height="14" rx="4"/>
                    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                {/* Spotify */}
                <a className="social-icon" href="#" aria-label="Spotify">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 15c2.3-1 5.3-1.3 7.5 0M7 12c3-1.3 6.5-1.3 10 0M8 9c2.8-.8 5.5-.8 8 0"/>
                  </svg>
                </a>
                {/* X / Twitter */}
                <a className="social-icon" href="#" aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
              <p className="hashtag">#GHETTOSPIRITENT</p>
            </div>

            {/* Logo watermark */}
            <div className="footer-logo-watermark" aria-hidden="true">
              GHETTO<br />SPIRIT
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 Ghetto Spirit Entertainment. All Rights Reserved.</p>
            <p className="footer-tagline">Raw Talent. Real Culture. Bigger Dreams.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}