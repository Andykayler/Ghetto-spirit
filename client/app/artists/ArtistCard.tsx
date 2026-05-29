import { useState } from "react";
import { useRouter } from "next/navigation";
import { CrownIcon, ArrowRightIcon, InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon } from "./Icons";

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

const SOCIAL_ICONS = [InstagramIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon];

export function ArtistCard({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    artist.image && !imageError
      ? artist.image
      : `https://placehold.co/280x330/0a0a0a/C9A84C?text=${encodeURIComponent(artist.name.charAt(0))}`;

  return (
    <>
      <style>{`
        .artist-card { transition: border-color 0.2s; }
        .artist-card:hover { border-color: rgba(201,168,76,0.35) !important; }
        .artist-card img { transition: transform 0.5s ease; }
        .artist-card:hover img { transform: scale(1.04); }
        .view-profile-btn { transition: background 0.15s; }
        .view-profile-btn:hover { background: rgba(201,168,76,0.08) !important; }
        .social-btn { transition: color 0.15s; }
        .social-btn:hover { color: #C9A84C !important; }

        @media (max-width: 600px) {
          .artist-card-name { font-size: 0.9rem !important; }
          .artist-card-body { padding: 6px 8px 8px !important; }
          .view-profile-btn { height: 22px !important; font-size: 0.6rem !important; }
        }
      `}</style>

      <div
        className="artist-card"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1e1e1e",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Image — reduced from 118% to 100% for shorter card */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", flexShrink: 0 }}>
          <img
            src={imageSrc}
            alt={artist.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
            onError={() => setImageError(true)}
          />
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

        {/* Body — tightened padding and font sizes */}
        <div
          className="artist-card-body"
          style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column" }}
        >
          {/* Name + Crown */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
            <span
              className="artist-card-name"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "1.1rem",
                color: "#ffffff",
                letterSpacing: "0.04em",
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {artist.name}
            </span>
            <CrownIcon />
          </div>

          {/* Genre */}
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#666",
              margin: "0 0 7px",
            }}
          >
            {artist.genre}
          </p>

          {/* View Profile */}
          <button
            className="view-profile-btn"
            onClick={() => router.push(`/${artist.id}`)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 26,
              border: "1px solid #C9A84C",
              background: "transparent",
              color: "#C9A84C",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginBottom: 7,
            }}
          >
            VIEW PROFILE <ArrowRightIcon />
          </button>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {SOCIAL_ICONS.map((Icon, i) => (
              <button
                key={i}
                className="social-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 4px",
                  color: "#4a4a4a",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}