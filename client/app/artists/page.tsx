"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

import { Category, ARTISTS, CATEGORIES, GENRES } from "./types";
import { ArtistsHero } from "./ArtistsHero";
import { FilterBar } from "./FilterBar";
import { ArtistGrid } from "./ArtistGrid";
import { JoinCTA } from "./JoinCTA";

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

        <Navbar />

        {/* Spacer that pushes page content below the fixed navbar */}
        <div style={{ height: 70, flexShrink: 0 }} />

        <ArtistsHero />

        <FilterBar
          categories={CATEGORIES}
          genres={GENRES}
          activeCategory={activeCategory}
          selectedGenre={selectedGenre}
          searchQuery={searchQuery}
          genreOpen={genreOpen}
          onCategoryChange={setActiveCategory}
          onGenreChange={(g) => { setSelectedGenre(g); setGenreOpen(false); }}
          onSearchChange={setSearchQuery}
          onGenreToggle={() => setGenreOpen((o) => !o)}
        />

        <section className="px-10 py-10" style={{ background: "#0A0A0A", flex: 1 }}>
          <ArtistGrid artists={filtered} />
        </section>

        <JoinCTA />

      </main>
    </>
  );
}