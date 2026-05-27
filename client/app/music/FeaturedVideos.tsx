"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePlayer } from "./PlayerContext";
import type { Track } from "./PlayerContext";

export type Song = Track & {
  coverUrl: string;
};

export type SongCategory = "ALL" | "Hip Hop" | "Afrobeat" | "Trap" | "R&B" | "Reggae" | "Amapiano" | "Pop";

export function FeaturedSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<SongCategory>("ALL");

  const { play, currentTrack, playing, queue, setExpanded } = usePlayer();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");
        const snapshot = await getDocs(collection(db, "songs"));
        const fetched: Song[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // normalise: songs use coverUrl, but Track expects thumbnail too
          thumbnail: (doc.data() as any).coverUrl,
        } as Song));
        console.log("✅ Songs loaded:", fetched.length);
        setSongs(fetched);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message || "Failed to load songs");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const filteredSongs = active === "ALL"
    ? songs
    : songs.filter(s => s.genre === active);

  // Animate cards when they enter view or filter changes
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-scard]");
    cards.forEach(card => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll<HTMLElement>("[data-scard]");
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, i * 60);
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
    return () => observer.disconnect();
  }, [filteredSongs]);

  // When a song is played, set the full filtered list as the queue
  const handlePlay = (song: Song) => {
    // Normalise all songs for the queue with thumbnail alias
    const trackQueue: Track[] = filteredSongs.map(s => ({
      ...s,
      thumbnail: s.coverUrl,
    }));
    play(song, trackQueue);
  };

  if (loading) {
    return (
      <section style={{ background: "#0A0A0A", padding: "100px 20px", textAlign: "center", color: "#777" }}>
        Loading songs...
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ background: "#0A0A0A", padding: "100px 20px", textAlign: "center", color: "#ff6666" }}>
        Error: {error}<br /><br />
        <button onClick={() => window.location.reload()}>Retry</button>
      </section>
    );
  }

  if (songs.length === 0) {
    return (
      <section style={{ background: "#0A0A0A", padding: "100px 20px", textAlign: "center", color: "#888" }}>
        No songs found.<br />Upload some songs using the upload modal first.
      </section>
    );
  }

  return (
    <section id="featured" ref={sectionRef} style={{ background: "#0A0A0A", padding: "60px 60px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", margin: 0 }}>
              FEATURED SONGS
            </h2>
            <div style={{ width: 50, height: 2, background: "#D4AF37" }} />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["ALL", "Hip Hop", "Afrobeat", "Trap", "R&B", "Amapiano", "Pop"] as SongCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: "8px 16px",
                  background: active === cat ? "#D4AF37" : "transparent",
                  color: active === cat ? "#000" : "rgba(255,255,255,0.6)",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
          {filteredSongs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              index={i}
              isCurrent={currentTrack?.id === song.id}
              isPlaying={currentTrack?.id === song.id && playing}
              onPlay={() => handlePlay(song)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SongCard ─────────────────────────────────────────────────────────────────
function SongCard({ song, index, isCurrent, isPlaying, onPlay }: {
  song: Song;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-scard
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`,
        background: "#111",
        borderRadius: 6,
        overflow: "hidden",
        border: isCurrent ? "1px solid #D4AF37" : "1px solid #222",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div style={{ position: "relative", aspectRatio: "1/1" }}>
        <img
          src={song.coverUrl}
          alt={song.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "brightness(0.7)" : "brightness(0.85)",
            transition: "filter 0.3s",
          }}
        />

        {/* Play overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered || isCurrent ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: isPlaying ? "#D4AF37" : "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isPlaying ? 20 : 22,
          }}>
            {isPlaying ? "⏸" : "▶"}
          </div>
        </div>

        {/* Currently playing indicator */}
        {isCurrent && isPlaying && (
          <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 16,
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  background: "#D4AF37",
                  borderRadius: 2,
                  animation: `barBounce${i} 0.8s ease infinite`,
                  animationDelay: `${i * 0.15}s`,
                  height: "60%",
                }}
              />
            ))}
            <style>{`
              @keyframes barBounce0 { 0%,100%{height:40%} 50%{height:100%} }
              @keyframes barBounce1 { 0%,100%{height:80%} 50%{height:30%} }
              @keyframes barBounce2 { 0%,100%{height:55%} 50%{height:90%} }
            `}</style>
          </div>
        )}
      </div>

      <div style={{ padding: "14px" }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, color: isCurrent ? "#D4AF37" : "#fff", lineHeight: 1.2 }}>
          {song.title}
        </div>
        <div style={{ color: "#aaa", fontSize: 13.5, marginTop: 4 }}>
          {song.artist}
        </div>
        {song.genre && (
          <div style={{
            marginTop: 8,
            display: "inline-block",
            padding: "2px 8px",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#D4AF37",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}>
            {song.genre}
          </div>
        )}
      </div>
    </div>
  );
}