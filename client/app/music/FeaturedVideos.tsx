"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePlayer } from "./PlayerContext";
import type { Track } from "./PlayerContext";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { ExpandedVideoPlayer } from "./ExpandedVideoPlayer";

export type Song = Track & {
  coverUrl: string;
};

export type Video = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre: string;
  videoUrl: string;
  coverUrl: string;
  views: number;
};

export type SongCategory =
  | "ALL"
  | "Hip Hop"
  | "Afrobeat"
  | "Trap"
  | "R&B"
  | "Reggae"
  | "Amapiano"
  | "Pop";

type MediaTab = "music" | "videos";

const CATEGORIES: SongCategory[] = [
  "ALL",
  "Hip Hop",
  "Afrobeat",
  "Trap",
  "R&B",
  "Amapiano",
  "Pop",
];

// ─── FeaturedSongs ─────────────────────────────────────────────────────────────
export function FeaturedSongs() {
  const [mediaTab, setMediaTab] = useState<MediaTab>("music");

  // Music state
  const [songs, setSongs] = useState<Song[]>([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState("");

  // Video state
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");
  const videosFetched = useRef(false);

  // Active genre filter
  const [active, setActive] = useState<SongCategory>("ALL");

  // Active video player state
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const { play, currentTrack, playing } = usePlayer();
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setSongsLoading(true);
        setSongsError("");
        const snapshot = await getDocs(collection(db, "songs"));
        const fetched: Song[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
          thumbnail: (doc.data() as any).coverUrl,
        }));
        setSongs(fetched);
      } catch (err: any) {
        setSongsError(err.message || "Failed to load songs");
      } finally {
        setSongsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Fetch videos lazily when Videos tab is first opened
  useEffect(() => {
    if (mediaTab !== "videos" || videosFetched.current) return;
    videosFetched.current = true;
    const fetchVideos = async () => {
      try {
        setVideosLoading(true);
        setVideosError("");
        const snapshot = await getDocs(collection(db, "videos"));
        const fetched: Video[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setVideos(fetched);
      } catch (err: any) {
        setVideosError(err.message || "Failed to load videos");
      } finally {
        setVideosLoading(false);
      }
    };
    fetchVideos();
  }, [mediaTab]);

  const filteredSongs =
    active === "ALL" ? songs : songs.filter((s) => s.genre === active);

  const filteredVideos =
    active === "ALL" ? videos : videos.filter((v) => v.genre === active);

  // Animate cards on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>("[data-scard]");
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards =
              entry.target.querySelectorAll<HTMLElement>("[data-scard]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 60);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [filteredSongs, filteredVideos, mediaTab]);

  const handlePlaySong = (song: Song) => {
    const trackQueue: Track[] = filteredSongs.map((s) => ({
      ...s,
      thumbnail: s.coverUrl,
    }));
    play(song, trackQueue);
  };

  const handleOpenVideo = (video: Video) => {
    setActiveVideo(video);
    setVideoExpanded(false);
  };

  // Loading/error states (songs only — videos are handled inline)
  if (mediaTab === "music") {
    if (songsLoading)
      return (
        <section style={{ background: "#0A0A0A", padding: "100px 20px", textAlign: "center", color: "#777" }}>
          Loading songs...
        </section>
      );
    if (songsError)
      return (
        <section style={{ background: "#0A0A0A", padding: "100px 20px", textAlign: "center", color: "#ff6666" }}>
          Error: {songsError}
          <br /><br />
          <button onClick={() => window.location.reload()}>Retry</button>
        </section>
      );
  }

  return (
    <>
      <section
        id="featured"
        ref={sectionRef}
        style={{ background: "#0A0A0A", padding: "60px 60px 40px" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {mediaTab === "music" ? "FEATURED SONGS" : "MUSIC VIDEOS"}
              </h2>
              <div style={{ width: 50, height: 2, background: "#D4AF37" }} />
            </div>

            {/* Genre filters */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    padding: "6px 12px",
                    background: active === cat ? "#D4AF37" : "transparent",
                    color: active === cat ? "#000" : "rgba(255,255,255,0.6)",
                    border: "none",
                    fontWeight: 600,
                    fontSize: 12,
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

          {/* ── Music / Videos toggle ── */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 28,
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 6,
              overflow: "hidden",
              width: "fit-content",
            }}
          >
            {(["music", "videos"] as MediaTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMediaTab(tab)}
                style={{
                  padding: "8px 24px",
                  background: mediaTab === tab ? "#D4AF37" : "transparent",
                  color: mediaTab === tab ? "#000" : "rgba(255,255,255,0.55)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  transition: "background 0.2s, color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {tab === "music" ? (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                    </svg>
                    Music
                  </>
                ) : (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                    Videos
                  </>
                )}
              </button>
            ))}
          </div>

          {/* ── Songs Grid ── */}
          {mediaTab === "music" && (
            <>
              {songs.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888", padding: "60px 0" }}>
                  No songs found. Upload some songs first.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 14,
                  }}
                >
                  {filteredSongs.map((song, i) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      index={i}
                      isCurrent={currentTrack?.id === song.id}
                      isPlaying={currentTrack?.id === song.id && playing}
                      onPlay={() => handlePlaySong(song)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Videos Grid ── */}
          {mediaTab === "videos" && (
            <>
              {videosLoading && (
                <div style={{ textAlign: "center", color: "#777", padding: "60px 0" }}>Loading videos...</div>
              )}
              {videosError && (
                <div style={{ textAlign: "center", color: "#ff6666", padding: "60px 0" }}>Error: {videosError}</div>
              )}
              {!videosLoading && !videosError && videos.length === 0 && (
                <div style={{ textAlign: "center", color: "#888", padding: "60px 0" }}>
                  No videos found. Upload some videos first.
                </div>
              )}
              {!videosLoading && !videosError && videos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 18,
                  }}
                >
                  {filteredVideos.map((video, i) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={i}
                      isActive={activeVideo?.id === video.id}
                      onPlay={() => handleOpenVideo(video)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Video Player Modal ── */}
      {activeVideo && !videoExpanded && (
        <VideoPlayerModal
          video={activeVideo}
          allVideos={filteredVideos}
          onClose={() => setActiveVideo(null)}
          onExpand={() => setVideoExpanded(true)}
          onSelectVideo={(v) => setActiveVideo(v)}
        />
      )}

      {/* ── Expanded Video Player ── */}
      {activeVideo && videoExpanded && (
        <ExpandedVideoPlayer
          video={activeVideo}
          allVideos={filteredVideos}
          onClose={() => { setVideoExpanded(false); setActiveVideo(null); }}
          onCollapse={() => setVideoExpanded(false)}
          onSelectVideo={(v) => setActiveVideo(v)}
        />
      )}
    </>
  );
}

// ─── SongCard ─────────────────────────────────────────────────────────────────
function SongCard({
  song,
  index,
  isCurrent,
  isPlaying,
  onPlay,
}: {
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
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: isPlaying ? "#D4AF37" : "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isPlaying ? 16 : 17,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </div>
        </div>
        {isCurrent && isPlaying && (
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              height: 14,
            }}
          >
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
      <div style={{ padding: "10px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: isCurrent ? "#D4AF37" : "#fff",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {song.title}
        </div>
        <div style={{ color: "#aaa", fontSize: 11.5, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {song.artist}
        </div>
        {song.genre && (
          <div
            style={{
              marginTop: 6,
              display: "inline-block",
              padding: "2px 6px",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#D4AF37",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {song.genre}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────
function VideoCard({
  video,
  index,
  isActive,
  onPlay,
}: {
  video: Video;
  index: number;
  isActive: boolean;
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
        borderRadius: 8,
        overflow: "hidden",
        border: isActive ? "1px solid #D4AF37" : "1px solid #222",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onPlay}
    >
      <div style={{ position: "relative", aspectRatio: "16/9" }}>
        <img
          src={video.coverUrl}
          alt={video.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "brightness(0.55)" : "brightness(0.75)",
            transition: "filter 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered || isActive ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: isActive ? "#D4AF37" : "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill={isActive ? "#000" : "#fff"}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(212,175,55,0.4)",
            padding: "2px 7px",
            borderRadius: 3,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#D4AF37",
            textTransform: "uppercase",
          }}
        >
          VIDEO
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: isActive ? "#D4AF37" : "#fff",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.title}
        </div>
        <div style={{ color: "#aaa", fontSize: 11.5, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {video.artist}
        </div>
        {video.genre && (
          <div
            style={{
              marginTop: 6,
              display: "inline-block",
              padding: "2px 6px",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#D4AF37",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {video.genre}
          </div>
        )}
      </div>
    </div>
  );
}