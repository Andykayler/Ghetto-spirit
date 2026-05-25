"use client";

import { useState } from "react";

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
  { id: 1, name: "YOUNG LEGEND", role: "RAPPER",   category: "RAPPERS",   image: "/images/young-legend.jpg" },
  { id: 2, name: "LADY RYDER",   role: "RAPPER",   category: "RAPPERS",   image: "/images/lady-ryder.jpg"   },
  { id: 3, name: "KING DRE",     role: "RAPPER",   category: "RAPPERS",   image: "/images/king-dre.jpg"     },
  { id: 4, name: "REAL BEATZ",   role: "PRODUCER", category: "PRODUCERS", image: "/images/real-beatz.jpg"   },
  { id: 5, name: "NIA VOX",      role: "SINGER",   category: "SINGERS",   image: "/images/nia-vox.jpg"      },
  { id: 6, name: "DJ SPIRIT",    role: "DJ",       category: "DJS",       image: "/images/dj-spirit.jpg"    },
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A84C">
    <path d="M2 19h20v2H2v-2zM2 7l5 5 5-7 5 7 5-5v10H2V7z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

// ─── Torn Edge SVG ────────────────────────────────────────────────────────────

const TornEdgeBottom = () => (
  <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-14">
      <path
        d="M0,0 L0,38 Q48,54 96,40 Q144,26 192,46 Q240,58 288,42 Q336,26 384,48 Q432,60 480,43 Q528,28 576,50 Q624,60 672,40 Q720,22 768,46 Q816,60 864,42 Q912,26 960,48 Q1008,60 1056,43 Q1104,26 1152,48 Q1200,60 1248,42 Q1320,26 1440,50 L1440,0 Z"
        fill="#0a0a0a"
      />
    </svg>
  </div>
);

const TornEdgeTop = () => (
  <div className="absolute top-0 left-0 right-0 leading-none pointer-events-none">
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-14">
      <path
        d="M0,56 L0,18 Q48,2 96,16 Q144,30 192,10 Q240,0 288,14 Q336,30 384,8 Q432,0 480,13 Q528,28 576,6 Q624,0 672,16 Q720,34 768,10 Q816,0 864,14 Q912,30 960,8 Q1008,0 1056,13 Q1104,30 1152,8 Q1200,0 1248,14 Q1320,30 1440,6 L1440,56 Z"
        fill="#0d0d0d"
      />
    </svg>
  </div>
);

// ─── Gold Crown SVG ───────────────────────────────────────────────────────────

const GoldCrown = () => (
  <svg viewBox="0 0 120 100" className="w-36 h-28 drop-shadow-[0_0_20px_rgba(201,168,76,0.5)]">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5D78E" />
        <stop offset="50%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
    </defs>
    <polygon points="10,80 20,28 42,54 60,8 78,54 100,28 110,80" fill="url(#g1)" stroke="#8B6914" strokeWidth="1.5" />
    <path d="M22,80 Q24,94 22,100 Q20,94 22,80" fill="#C9A84C" />
    <path d="M60,80 Q63,96 60,104 Q57,96 60,80" fill="#C9A84C" />
    <path d="M98,80 Q100,92 98,98 Q96,92 98,80" fill="#C9A84C" />
    <rect x="10" y="78" width="100" height="8" rx="2" fill="url(#g1)" />
    <circle cx="32" cy="67" r="5" fill="#111" stroke="#C9A84C" strokeWidth="1.5" />
    <circle cx="60" cy="67" r="5" fill="#111" stroke="#C9A84C" strokeWidth="1.5" />
    <circle cx="88" cy="67" r="5" fill="#111" stroke="#C9A84C" strokeWidth="1.5" />
  </svg>
);

// ─── Artist Card ──────────────────────────────────────────────────────────────

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="group bg-[#111] border border-[#222] overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-300 hover:-translate-y-1">
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Name + crown */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-['Bebas_Neue'] text-xl tracking-wide text-white">
            {artist.name}
          </span>
          <CrownIcon />
        </div>

        {/* Role */}
        <p className="text-[#666] text-xs tracking-[0.18em] font-['Barlow_Condensed'] font-semibold uppercase mb-3">
          {artist.role}
        </p>

        {/* View Profile btn */}
        <button className="w-full flex items-center justify-center gap-2 border border-[#C9A84C] text-[#C9A84C] py-1.5 text-xs font-['Barlow_Condensed'] font-bold tracking-[0.14em] uppercase hover:bg-[#C9A84C]/10 transition-colors mb-3">
          VIEW PROFILE <ArrowRightIcon />
        </button>

        {/* Social icons */}
        <div className="flex gap-1">
          {[InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 text-[#555] hover:text-[#C9A84C] transition-colors"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Artists() {
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
    <div className="bg-[#0a0a0a] min-h-screen text-white font-['Barlow',sans-serif] relative">

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,600&family=Barlow:wght@400;500&display=swap');
      `}</style>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-8 h-16 bg-[#080808] border-b border-[#222] relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#F5D78E] to-[#8B6914] rounded flex items-center justify-center font-['Bebas_Neue'] text-black text-sm font-bold">
            GS
          </div>
          <div>
            <div className="font-['Bebas_Neue'] text-sm tracking-[0.14em] leading-tight">GHETTO SPIRIT</div>
            <div className="text-[#777] text-[0.55rem] tracking-[0.22em] uppercase">Entertainment</div>
          </div>
        </div>

        {/* Nav Links */}
        <ul className="hidden lg:flex items-center gap-7 list-none">
          {["HOME", "ABOUT US", "ARTISTS", "MUSIC & VIDEOS", "EVENTS & COMPETITIONS", "GALLERY", "CONTACT"].map((link) => (
            <li key={link}>
              <a
                href="#"
                className={`font-['Barlow_Condensed'] text-[0.78rem] font-semibold tracking-[0.1em] relative pb-0.5 transition-colors
                  ${link === "ARTISTS" ? "text-[#C9A84C]" : "text-[#999] hover:text-white"}`}
              >
                {link}
                {link === "ARTISTS" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-3">
          {[InstagramIcon, YoutubeIcon, SpotifyIcon].map((Icon, i) => (
            <button key={i} className="text-[#777] hover:text-[#C9A84C] transition-colors">
              <Icon />
            </button>
          ))}
          <button className="bg-[#C9A84C] text-black px-4 py-2 font-['Bebas_Neue'] text-sm tracking-[0.1em] hover:bg-[#F5D78E] transition-colors ml-2">
            JOIN THE MOVEMENT
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1208] to-[#0a0a0a] px-10 pt-14 pb-20 overflow-hidden min-h-[200px]">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#C9A84C]/4 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-10 flex-wrap">
          {/* Left: title + tagline */}
          <div className="flex-shrink-0">
            <h1 className="font-['Bebas_Neue'] text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-white drop-shadow-[0_0_40px_rgba(201,168,76,0.15)]">
              OUR ARTISTS
            </h1>
            <p className="font-['Barlow_Condensed'] italic text-[#C9A84C] text-lg tracking-[0.08em] font-semibold mt-1">
              RAW TALENT. REAL STORIES. ONE MOVEMENT.
            </p>
          </div>

          {/* Vertical separator */}
          <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent flex-shrink-0" />

          {/* Description */}
          <p className="text-[#999] text-sm leading-relaxed max-w-sm">
            We represent a diverse family of artists who live the culture and speak the truth. From emerging voices to established forces, this is the future of entertainment.
          </p>

          {/* Crown — pushed right */}
          <div className="ml-auto hidden lg:block">
            <GoldCrown />
          </div>
        </div>

        <TornEdgeBottom />
      </section>

      {/* ── FILTER BAR ── */}
      <section className="flex items-center justify-between flex-wrap gap-4 px-10 py-5 bg-[#0d0d0d] border-b border-[#222] relative z-10">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-1.5 font-['Barlow_Condensed'] text-[0.8rem] font-bold tracking-[0.12em] transition-colors
                ${activeCategory === cat ? "text-[#C9A84C]" : "text-[#666] hover:text-[#aaa]"}`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A84C]" />
              )}
            </button>
          ))}
        </div>

        {/* Search + Genre */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#181818] border border-[#2a2a2a] px-3 py-2 min-w-[210px]">
            <input
              type="text"
              placeholder="SEARCH ARTISTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[#ccc] text-[0.75rem] font-['Barlow_Condensed'] tracking-[0.1em] flex-1 placeholder:text-[#444]"
            />
            <span className="text-[#555]"><SearchIcon /></span>
          </div>

          {/* Genre dropdown */}
          <div className="relative">
            <button
              onClick={() => setGenreOpen(!genreOpen)}
              className="flex items-center gap-2 justify-between bg-[#181818] border border-[#2a2a2a] px-3 py-2 text-[#bbb] font-['Barlow_Condensed'] text-[0.75rem] font-semibold tracking-[0.1em] min-w-[140px] hover:border-[#444] transition-colors"
            >
              {selectedGenre} <ChevronDownIcon />
            </button>
            {genreOpen && (
              <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#2a2a2a] z-50 mt-0.5">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setSelectedGenre(g); setGenreOpen(false); }}
                    className={`block w-full text-left px-3 py-2 font-['Barlow_Condensed'] text-[0.75rem] font-semibold tracking-[0.1em] transition-colors
                      ${selectedGenre === g ? "text-[#C9A84C] bg-[#C9A84C]/8" : "text-[#888] hover:text-[#ccc] hover:bg-white/5"}`}
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
      <section className="px-10 py-10 bg-[#0a0a0a]">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="font-['Bebas_Neue'] text-2xl text-[#555] tracking-widest">NO ARTISTS FOUND</p>
          </div>
        )}
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative bg-[#0d0d0d] border-t border-[#1e1e1e] py-16 flex items-center justify-center overflow-hidden">
        <TornEdgeTop />

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="relative border border-[#C9A84C] px-14 py-8 flex flex-col items-center gap-2 bg-[#C9A84C]/[0.02]">
          <p className="font-['Barlow_Condensed'] text-[0.75rem] font-semibold tracking-[0.22em] text-[#777] uppercase">
            Think you have what it takes?
          </p>
          <button className="flex items-center gap-3 font-['Bebas_Neue'] text-2xl tracking-[0.1em] text-white hover:text-[#C9A84C] transition-colors">
            JOIN THE MOVEMENT <ArrowRightIcon />
          </button>
        </div>
      </section>
    </div>
  );
}