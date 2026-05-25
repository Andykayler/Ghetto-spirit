"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "ALL ARTISTS" | "RAPPERS" | "SINGERS" | "PRODUCERS" | "DJS" | "SONGWRITERS";

interface Artist {
  id: number;
  name: string;
  role: string;
  category: Category;
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ARTISTS: Artist[] = [
  { id: 1, name: "YOUNG LEGEND", role: "RAPPER",      category: "RAPPERS",     image: "/images/young-legend.jpg" },
  { id: 2, name: "LADY RYDER",   role: "RAPPER",      category: "RAPPERS",     image: "/images/lady-ryder.jpg"   },
  { id: 3, name: "KING DRE",     role: "RAPPER",      category: "RAPPERS",     image: "/images/king-dre.jpg"     },
  { id: 4, name: "REAL BEATZ",   role: "PRODUCER",    category: "PRODUCERS",   image: "/images/real-beatz.jpg"   },
  { id: 5, name: "NIA VOX",      role: "SINGER",      category: "SINGERS",     image: "/images/nia-vox.jpg"      },
  { id: 6, name: "DJ SPIRIT",    role: "DJ",          category: "DJS",         image: "/images/dj-spirit.jpg"    },
];

const CATEGORIES: Category[] = ["ALL ARTISTS", "RAPPERS", "SINGERS", "PRODUCERS", "DJS", "SONGWRITERS"];
const GENRES = ["ALL GENRES", "HIP HOP", "R&B", "TRAP", "AFROBEATS", "POP"];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const CrownIcon = () => (
  <svg width="18" height="16" viewBox="0 0 30 26" fill="none">
    <defs>
      <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5D78E" />
        <stop offset="50%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
    </defs>
    <polygon points="2,22 6,8 12,15 15,2 18,15 24,8 28,22" fill="url(#crownGrad)" stroke="#8B6914" strokeWidth="0.8" />
    <rect x="2" y="21" width="26" height="3" rx="1" fill="url(#crownGrad)" />
    <circle cx="8" cy="18" r="1.5" fill="#111" stroke="#C9A84C" strokeWidth="0.8" />
    <circle cx="15" cy="18" r="1.5" fill="#111" stroke="#C9A84C" strokeWidth="0.8" />
    <circle cx="22" cy="18" r="1.5" fill="#111" stroke="#C9A84C" strokeWidth="0.8" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ─── Torn Paper Edge ──────────────────────────────────────────────────────────

const TornEdgeBottom = () => (
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
      <path
        d="M0,0 L0,40 Q30,58 60,42 Q90,26 130,48 Q170,62 210,44 Q250,28 290,50 Q330,62 375,45 Q415,30 455,52 Q495,62 535,44 Q575,28 615,50 Q655,62 700,43 Q740,26 780,48 Q820,62 860,44 Q900,28 940,50 Q985,63 1025,46 Q1065,30 1105,52 Q1145,62 1185,44 Q1230,26 1280,50 Q1350,64 1440,46 L1440,0 Z"
        fill="#0A0A0A"
      />
    </svg>
  </div>
);

const TornEdgeTop = () => (
  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
      <path
        d="M0,60 L0,20 Q30,4 60,18 Q90,32 130,12 Q170,0 210,16 Q250,32 290,10 Q330,0 375,15 Q415,30 455,8 Q495,0 535,16 Q575,32 615,10 Q655,0 700,17 Q740,34 780,12 Q820,0 860,16 Q900,32 940,10 Q985,0 1025,14 Q1065,30 1105,8 Q1145,0 1185,16 Q1230,34 1280,10 Q1350,0 1440,14 L1440,60 Z"
        fill="#0d0d0d"
      />
    </svg>
  </div>
);

// ─── Large Drip Crown SVG (hero) ──────────────────────────────────────────────

const HeroCrown = () => (
  <svg viewBox="0 0 160 140" className="w-48 h-40" style={{ filter: "drop-shadow(0 0 24px rgba(201,168,76,0.45))" }}>
    <defs>
      <linearGradient id="hcg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5D78E" />
        <stop offset="40%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#7A5C10" />
      </linearGradient>
      <filter id="roughen">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    {/* Crown body */}
    <polygon
      points="14,110 28,38 55,72 80,10 105,72 132,38 146,110"
      fill="url(#hcg1)"
      stroke="#6B4F0E"
      strokeWidth="2"
      filter="url(#roughen)"
    />
    {/* Base bar */}
    <rect x="14" y="107" width="132" height="14" rx="3" fill="url(#hcg1)" filter="url(#roughen)" />
    {/* Gems */}
    <circle cx="40" cy="90" r="7" fill="#0a0a0a" stroke="#C9A84C" strokeWidth="2" />
    <circle cx="80" cy="90" r="7" fill="#0a0a0a" stroke="#C9A84C" strokeWidth="2" />
    <circle cx="120" cy="90" r="7" fill="#0a0a0a" stroke="#C9A84C" strokeWidth="2" />
    {/* Drips */}
    <path d="M30,121 Q32,134 30,142 Q28,134 30,121" fill="#C9A84C" opacity="0.85" />
    <path d="M55,121 Q57,130 55,136 Q53,130 55,121" fill="#C9A84C" opacity="0.7" />
    <path d="M80,121 Q83,136 80,145 Q77,136 80,121" fill="#C9A84C" opacity="0.9" />
    <path d="M105,121 Q107,129 105,135 Q103,129 105,121" fill="#C9A84C" opacity="0.65" />
    <path d="M130,121 Q132,133 130,140 Q128,133 130,121" fill="#C9A84C" opacity="0.8" />
    {/* Gold dust speckles */}
    <circle cx="20" cy="60" r="1.5" fill="#F5D78E" opacity="0.6" />
    <circle cx="145" cy="55" r="1" fill="#F5D78E" opacity="0.5" />
    <circle cx="70" cy="25" r="1" fill="#F5D78E" opacity="0.7" />
    <circle cx="110" cy="30" r="1.5" fill="#F5D78E" opacity="0.5" />
  </svg>
);

// ─── Artist Card ──────────────────────────────────────────────────────────────

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#111111",
        border: "1px solid #222222",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#222222";
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "125%" }}>
        <img
          src={artist.image}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/300x375/111111/C9A84C?text=${encodeURIComponent(artist.name)}`;
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Name + Crown */}
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-white text-xl tracking-wide"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            {artist.name}
          </span>
          <CrownIcon />
        </div>

        {/* Role */}
        <p
          className="text-xs tracking-widest font-semibold uppercase mb-3"
          style={{ color: "#666666", fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {artist.role}
        </p>

        {/* View Profile */}
        <button
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors mb-3"
          style={{
            border: "1px solid #C9A84C",
            color: "#C9A84C",
            fontFamily: "'Barlow Condensed', sans-serif",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          VIEW PROFILE <ArrowRightIcon />
        </button>

        {/* Socials */}
        <div className="flex gap-1">
          {[InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 transition-colors"
              style={{ color: "#555555" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#555555"; }}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArtistsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL ARTISTS");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("ALL GENRES");
  const [genreOpen, setGenreOpen] = useState(false);

  const filtered = ARTISTS.filter((a) => {
    const matchesCat = activeCategory === "ALL ARTISTS" || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,600&family=Barlow:wght@400;500&display=swap');
      `}</style>

      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A0A" }}>

        {/* ── NAVBAR (imported) ── */}
        <Navbar />

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden px-10 pt-14 pb-24"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)",
            minHeight: 220,
          }}
        >
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full" style={{ background: "rgba(201,168,76,0.05)", filter: "blur(80px)" }} />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full" style={{ background: "rgba(201,168,76,0.04)", filter: "blur(60px)" }} />
            {/* Gold speckle texture overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, #C9A84C 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
                maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative flex items-center gap-10 flex-wrap">
            {/* Title block */}
            <div className="flex-shrink-0">
              <h1
                className="leading-none tracking-wide text-white"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  textShadow: "0 0 40px rgba(201,168,76,0.15)",
                }}
              >
                OUR ARTISTS
              </h1>
              <p
                className="mt-1 font-semibold italic tracking-widest"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "#C9A84C",
                  fontSize: "1.1rem",
                }}
              >
                RAW TALENT. REAL STORIES. ONE MOVEMENT.
              </p>
            </div>

            {/* Vertical separator */}
            <div
              className="hidden md:block flex-shrink-0"
              style={{
                width: 1,
                height: 80,
                background: "linear-gradient(to bottom, transparent, #C9A84C, transparent)",
              }}
            />

            {/* Description */}
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "#999999", fontFamily: "'Barlow', sans-serif" }}
            >
              We represent a diverse family of artists who live the culture and speak the truth. From emerging voices to established forces, this is the future of entertainment.
            </p>

            {/* Crown — pushed right */}
            <div className="ml-auto hidden lg:block">
              <HeroCrown />
            </div>
          </div>

          <TornEdgeBottom />
        </section>

        {/* ── FILTER BAR ── */}
        <section
          className="flex items-center justify-between flex-wrap gap-4 px-10 py-5 relative z-10"
          style={{
            background: "#0d0d0d",
            borderBottom: "1px solid #222222",
          }}
        >
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: activeCategory === cat ? "#C9A84C" : "#666666",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) (e.currentTarget as HTMLButtonElement).style.color = "#aaaaaa";
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) (e.currentTarget as HTMLButtonElement).style.color = "#666666";
                }}
              >
                {cat}
                {activeCategory === cat && (
                  <span
                    className="absolute bottom-0 left-4 right-4"
                    style={{ height: 2, background: "#C9A84C", display: "block" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search + Genre */}
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{
                background: "#181818",
                border: "1px solid #2a2a2a",
                minWidth: 210,
              }}
            >
              <input
                type="text"
                placeholder="SEARCH ARTISTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1"
                style={{
                  color: "#cccccc",
                  fontSize: "0.75rem",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.1em",
                }}
              />
              <span style={{ color: "#555555" }}><SearchIcon /></span>
            </div>

            {/* Genre dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreOpen(!genreOpen)}
                className="flex items-center gap-2 justify-between px-3 py-2 transition-colors"
                style={{
                  background: "#181818",
                  border: "1px solid #2a2a2a",
                  color: "#bbbbbb",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  minWidth: 140,
                  cursor: "pointer",
                }}
              >
                {selectedGenre} <ChevronDownIcon />
              </button>
              {genreOpen && (
                <div
                  className="absolute top-full left-0 right-0 z-50 mt-0.5"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                >
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => { setSelectedGenre(g); setGenreOpen(false); }}
                      className="block w-full text-left px-3 py-2 transition-colors"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: selectedGenre === g ? "#C9A84C" : "#888888",
                        background: selectedGenre === g ? "rgba(201,168,76,0.08)" : "transparent",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── ARTIST GRID ── */}
        <section className="px-10 py-10" style={{ background: "#0A0A0A", flex: 1 }}>
          {filtered.length > 0 ? (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              }}
            >
              {filtered.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-24">
              <p
                className="tracking-widest"
                style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: "#555555" }}
              >
                NO ARTISTS FOUND
              </p>
            </div>
          )}
        </section>

        {/* ── CTA SECTION ── */}
        <section
          className="relative flex items-center justify-center py-16 overflow-hidden"
          style={{ background: "#0d0d0d", borderTop: "1px solid #1e1e1e" }}
        >
          <TornEdgeTop />

          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)",
            }}
          />

          <div
            className="relative flex flex-col items-center gap-2 px-14 py-8"
            style={{
              border: "1px solid #C9A84C",
              background: "rgba(201,168,76,0.02)",
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#777777" }}
            >
              Think you have what it takes?
            </p>
            <button
              className="flex items-center gap-3 text-2xl tracking-widest text-white transition-colors"
              style={{ fontFamily: "'Bebas Neue', cursive", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            >
              JOIN THE MOVEMENT <ArrowRightIcon />
            </button>
          </div>
        </section>

      </main>
    </>
  );
}