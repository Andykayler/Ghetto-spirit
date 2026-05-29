import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArtistCard } from "./ArtistCard";

interface Artist {
  id: string;
  name: string;
  genre: string;
  age: number | null;
  gender: string;
  location: string;
  bio: string;
  status: string;
  streams: string;
  songs: number;
  joined: string;
  image: string | null;
}

interface ArtistGridProps {
  searchQuery?: string;
  selectedGenre?: string;
  activeCategory?: string;
}

export function ArtistGrid({
  searchQuery = "",
  selectedGenre = "ALL GENRES",
  activeCategory = "ALL ARTISTS",
}: ArtistGridProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "artists"), (snapshot) => {
      setArtists(
        snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Artist, "id">) }))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = artists.filter((a) => {
    const matchesCat =
      activeCategory === "ALL ARTISTS" ||
      (activeCategory === "TRENDING" && parseInt(a.streams || "0") > 10000) ||
      (activeCategory === "NEW" && a.joined === new Date().getFullYear().toString()) ||
      (activeCategory === "VERIFIED" && a.status === "verified");

    return (
      matchesCat &&
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === "ALL GENRES" || a.genre === selectedGenre)
    );
  });

  const emptyMessage = loading ? "LOADING ARTISTS..." : filtered.length === 0 ? "NO ARTISTS FOUND" : null;

  if (emptyMessage) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 24px", background: "#0a0a0a" }}>
        <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: "#444", letterSpacing: "0.2em" }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .artist-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 3px;
        }
        @media (max-width: 1280px) {
          .artist-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 900px) {
          .artist-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .artist-grid { grid-template-columns: repeat(2, 1fr); }
          .artist-grid-wrap { padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 1280px) and (min-width: 601px) {
          .artist-grid-wrap { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>

      <div className="artist-grid-wrap" style={{ background: "#0a0a0a", padding: "20px 48px 40px" }}>
        <div className="artist-grid">
          {filtered.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </>
  );
}