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
          .artist-card-name { font-size: 1.1rem !important; }
          .artist-card-body { padding: 8px 10px 10px !important; }
          .view-profile-btn { height: 26px !important; font-size: 0.65rem !important; }
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
        {/* Image */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "118%", flexShrink: 0 }}>
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

        {/* Body */}
        <div
          className="artist-card-body"
          style={{ padding: "10px 14px 12px", display: "flex", flexDirection: "column" }}
        >
          {/* Name + Crown */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            <span
              className="artist-card-name"
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

          {/* Genre */}
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#666",
              margin: "0 0 10px",
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
            }}
          >
            VIEW PROFILE <ArrowRightIcon />
          </button>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {SOCIAL_ICONS.map((Icon, i) => (
              <button
                key={i}
                className="social-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 5px",
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