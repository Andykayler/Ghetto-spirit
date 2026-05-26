import { Artist } from "./types";
import { ArtistCard } from "./ArtistCard";

// ─── Artist Grid ──────────────────────────────────────────────────────────────
// Matches design image:
//   - 6 equal-width columns filling full width, no gap between cards
//   - Section padding matches hero/filter (48px horizontal), tight vertical (20px top)
//   - Background #0a0a0a (same as page — no visible section bg change)
// ──────────────────────────────────────────────────────────────────────────────

interface ArtistGridProps {
  artists: Artist[];
}

export function ArtistGrid({ artists }: ArtistGridProps) {
  if (artists.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 48px",
          background: "#0a0a0a",
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "1.5rem",
            color: "#444444",
            letterSpacing: "0.2em",
          }}
        >
          NO ARTISTS FOUND
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0a0a0a",
        padding: "20px 48px 40px 48px",
      }}
    >
      <div
        style={{
          display: "grid",
          // 6 equal columns — fills viewport like the image
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 3,
        }}
      >
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}