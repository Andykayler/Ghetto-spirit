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
  activeCategory = "ALL ARTISTS" 
}: ArtistGridProps) {
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "artists"), (snapshot) => {
      const data: Artist[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Artist, "id">),
      }));
      setArtists(data);
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

    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "ALL GENRES" || a.genre === selectedGenre;

    return matchesCat && matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 48px", background: "#0a0a0a" }}>
        <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: "#444", letterSpacing: "0.2em" }}>
          LOADING ARTISTS...
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 48px", background: "#0a0a0a" }}>
        <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: "#444444", letterSpacing: "0.2em" }}>
          NO ARTISTS FOUND
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", padding: "20px 48px 40px 48px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 3 }}>
        {filtered.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}