"use client";

import { useState } from "react";

const navLinks = [
  { label: "HOME", href: "/", active: true },
  { label: "ABOUT US", href: "/about" },
  { label: "ARTISTS", href: "/artists" },
  { label: "MUSIC & VIDEOS", href: "/music" },
  { label: "EVENTS & COMPETITIONS", href: "/events" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
];

const socialIcons = [
  {
    name: "Instagram",
    href: "#",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    svg: (
      <svg width="15" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.16 8.16 0 0 0 4.77 1.52V7.1a4.85 4.85 0 0 1-1-.41z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    svg: (
      <svg width="20" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    svg: (
      <svg width="10" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&display=swap');

        .gs-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 24px 10px 20px;
          background: linear-gradient(180deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 100%);
          border-bottom: 1px solid rgba(212,160,23,0.18);
          min-height: 64px;
        }

        /* ── LOGO ── */
       .gs-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

        /* ── NAV LINKS ── */
        .gs-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-left: 32px;
        }
        .gs-nav-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #d1cfc9;
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 0.2s;
          white-space: nowrap;
          position: relative;
        }
        .gs-nav-link:hover {
          color: #D4A017;
        }
        .gs-nav-link.active {
          color: #D4A017;
        }
        .gs-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0; right: 0;
          height: 2px;
          background: #D4A017;
          border-radius: 1px;
        }

        /* ── RIGHT SIDE ── */
        .gs-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }
        .gs-socials {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .gs-social-icon {
          color: #c0bdb5;
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.2s;
        }
        .gs-social-icon:hover {
          color: #D4A017;
        }

        /* ── CTA BUTTON ── */
        .gs-cta {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 11.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #000;
          text-decoration: none;
          background: linear-gradient(135deg, #F7CC3A 0%, #D4A017 100%);
          padding: 9px 18px;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
          transition: transform 0.15s, filter 0.15s;
        }
        .gs-cta:hover {
          filter: brightness(1.08);
          transform: scale(1.03);
        }

        /* ── MOBILE HAMBURGER ── */
        .gs-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #D4A017;
          padding: 4px;
        }

        /* ── MOBILE MENU ── */
        .gs-mobile-menu {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: rgba(0,0,0,0.97);
          border-top: 1px solid rgba(212,160,23,0.3);
          padding: 16px 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .gs-mobile-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #d1cfc9;
          text-decoration: none;
          transition: color 0.2s;
        }
        .gs-mobile-link:hover, .gs-mobile-link.active { color: #D4A017; }
        .gs-mobile-socials {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 6px;
        }

        @media (max-width: 1023px) {
          .gs-nav-links, .gs-right { display: none; }
          .gs-hamburger { display: flex; }
        }
      `}</style>

      <nav className="gs-nav">
        {/* LOGO */}
        <a href="/" className="gs-logo">
           <img
    src="/images/logo.png"
    alt="Ghetto Spirit Entertainment"
    style={{
      height: "52px",
      width: "auto",
      objectFit: "contain",
    }}
  />
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="gs-nav-links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`gs-nav-link${link.active ? " active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT: Socials + CTA */}
        <div className="gs-right">
          <div className="gs-socials">
            {socialIcons.map((icon) => (
              <a key={icon.name} href={icon.href} className="gs-social-icon" aria-label={icon.name}>
                {icon.svg}
              </a>
            ))}
          </div>
          <a href="/contact" className="gs-cta">JOIN THE MOVEMENT</a>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="gs-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="gs-mobile-menu">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`gs-mobile-link${link.active ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="gs-mobile-socials">
              {socialIcons.map((icon) => (
                <a key={icon.name} href={icon.href} className="gs-social-icon" aria-label={icon.name}>
                  {icon.svg}
                </a>
              ))}
            </div>
            <a href="/contact" className="gs-cta" style={{ alignSelf: "flex-start", marginTop: 4 }}>
              JOIN THE MOVEMENT
            </a>
          </div>
        )}
      </nav>
    </>
  );
}