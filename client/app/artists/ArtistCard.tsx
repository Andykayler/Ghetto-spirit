import { Artist } from "./types";
import { CrownIcon, ArrowRightIcon, InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon } from "./Icons";

// ─── Artist Card ──────────────────────────────────────────────────────────────
// Matches design image:
//   - Dark #0a0a0a card body, 1px #1e1e1e border
//   - Tall portrait image (~72% of card height), heavy bottom gradient bleeding into body
//   - Name (Bebas Neue ~22px white) + inline crown icon
//   - Role (Barlow Condensed, #666, uppercase tiny)
//   - VIEW PROFILE — full width gold border button, compact 30px, arrow right
//   - 4 social icons: Instagram, YouTube, Spotify, Apple Music — grey, small, left-aligned
// ──────────────────────────────────────────────────────────────────────────────

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.35)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e";
      }}
    >
      {/* ── Image — tall portrait, heavy gradient ── */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "118%", flexShrink: 0 }}>
        <img
          src={artist.image}
          alt={artist.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            display: "block",
            transition: "transform 0.5s ease",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/280x330/0a0a0a/C9A84C?text=${encodeURIComponent(artist.name)}`;
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.transform = "scale(1)";
          }}
        />
        {/* Heavy bottom gradient — bleeds deep up the image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.85) 22%, rgba(10,10,10,0.3) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "10px 14px 12px 14px", display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Name + Crown */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "1.35rem",
              color: "#ffffff",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {artist.name}
          </span>
          <CrownIcon />
        </div>

        {/* Role */}
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#666666",
            margin: "0 0 10px 0",
          }}
        >
          {artist.role}
        </p>

        {/* VIEW PROFILE button */}
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 30,
            border: "1px solid #C9A84C",
            background: "transparent",
            color: "#C9A84C",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            marginBottom: 10,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          VIEW PROFILE <ArrowRightIcon />
        </button>

        {/* Social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon].map((Icon, i) => (
            <button
              key={i}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 5px",
                color: "#4a4a4a",
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#4a4a4a";
              }}
            >
              <Icon />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}