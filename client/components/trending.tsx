"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePlayer } from "@/app/music/PlayerContext";
import "./trending.css";

/* ── Types ─────────────────────────────────────────────────── */
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

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre?: string;
  category?: string;
  coverUrl?: string;
  thumbnail?: string;
  audioUrl?: string;
  url?: string;
  streams?: number;
  likes?: number;
  createdAt?: any;
}

/* ── Helpers ────────────────────────────────────────────────── */
function formatStreams(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n > 0 ? n.toString() : "—";
}

function firstChar(str?: string | null, fallback = "?"): string {
  return str?.trim() ? str.trim().charAt(0).toUpperCase() : fallback;
}

/* ════════════════════════════════════════════════════════════
   RECENT SONG CARD
════════════════════════════════════════════════════════════ */
function RecentSongCard({ track, onPlay, active }: { track: Track; onPlay: () => void; active: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const cover = (track.coverUrl || track.thumbnail) && !imgErr ? (track.coverUrl || track.thumbnail) : null;
  const title = track.title || "Untitled";
  const artist = track.artist || "Unknown Artist";

  return (
    <div
      className={`rs-card${active ? " rs-card--active" : ""}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPlay()}
    >
      <div className="rs-card-art">
        {cover
          ? <img src={cover} alt={title} className="rs-card-img" onError={() => setImgErr(true)} />
          : <div className="rs-card-fallback">{firstChar(title)}</div>
        }
        <div className={`rs-card-overlay`}>
          <div className="rs-card-play">
            {active
              ? <svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3.5" height="12" fill="currentColor" /><rect x="6.5" y="0" width="3.5" height="12" fill="currentColor" /></svg>
              : <svg width="10" height="12" viewBox="0 0 10 12"><path d="M1 1l8 5-8 5V1z" fill="currentColor" /></svg>
            }
          </div>
        </div>
      </div>
      <div className="rs-card-info">
        <div className="rs-card-title">{title}</div>
        <div className="rs-card-artist">{artist}</div>
        {track.genre && <div className="rs-card-genre">{track.genre}</div>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MINI ARTIST CARD
════════════════════════════════════════════════════════════ */
function MiniArtistCard({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);

  const src =
    artist.image && !imgErr
      ? artist.image
      : `https://placehold.co/280x330/0a0a0a/C9A84C?text=${encodeURIComponent(firstChar(artist.name))}`;

  const streams = parseInt(artist.streams || "0");

  return (
    <div
      className="ra-card"
      onClick={() => router.push(`/${artist.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/${artist.id}`)}
    >
      <div className="ra-card-img-wrap">
        <img src={src} alt={artist.name ?? "Artist"} className="ra-card-img" onError={() => setImgErr(true)} />
        <div className="ra-card-img-overlay" />
        {artist.status === "verified" && <div className="ra-card-badge">✦ VERIFIED</div>}
      </div>
      <div className="ra-card-body">
        <div className="ra-card-name">{artist.name || "Unknown Artist"}</div>
        <div className="ra-card-genre">{artist.genre || ""}</div>
        <div className="ra-card-stats">
          {streams > 0 && <span className="ra-card-stat">{formatStreams(streams)} streams</span>}
          {artist.songs > 0 && <span className="ra-card-stat">{artist.songs} songs</span>}
        </div>
        <button className="ra-card-btn">
          VIEW PROFILE
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SPOTLIGHT CARD
════════════════════════════════════════════════════════════ */
function SpotlightCard({ artist, rank }: { artist: Artist; rank: number }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);

  const src =
    artist.image && !imgErr
      ? artist.image
      : `https://placehold.co/600x300/0a0a0a/C9A84C?text=${encodeURIComponent(firstChar(artist.name))}`;

  const streams = parseInt(artist.streams || "0");
  const rankColors = ["#F5C842", "#C0C0C0", "#CD7F32"];

  return (
    <div
      className="sp-card"
      onClick={() => router.push(`/${artist.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/${artist.id}`)}
    >
      <div className="sp-card-img-wrap">
        <img src={src} alt={artist.name ?? "Artist"} className="sp-card-img" onError={() => setImgErr(true)} />
        <div className="sp-card-overlay" />
        <div className="sp-card-rank" style={{ color: rankColors[rank - 1] ?? "#fff" }}>#{rank}</div>
      </div>
      <div className="sp-card-body">
        <div className="sp-card-name">{artist.name || "Unknown Artist"}</div>
        <div className="sp-card-genre">{artist.genre || ""}</div>
        <div className="sp-card-row">
          <span className="sp-card-streams">{formatStreams(streams)} streams</span>
          {artist.status === "verified" && <span className="sp-card-verified">✦ Verified</span>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN SECTION
════════════════════════════════════════════════════════════ */
export default function TrendingSection() {
  const { play, playing, currentTrack, togglePlay } = usePlayer();

  const [tracks, setTracks]               = useState<Track[]>([]);
  const [recentSongs, setRecentSongs]     = useState<Track[]>([]);
  const [artists, setArtists]             = useState<Artist[]>([]);
  const [tracksLoading, setTracksLoading]             = useState(true);
  const [recentSongsLoading, setRecentSongsLoading]   = useState(true);
  const [artistsLoading, setArtistsLoading]           = useState(true);

  /* Top 5 trending — songs merged with tracks stats */
  useEffect(() => {
    const statsUnsub = onSnapshot(collection(db, "tracks"), (statsSnap) => {
      const statsMap: Record<string, number> = {};
      statsSnap.docs.forEach((doc) => { statsMap[doc.id] = doc.data().streams ?? 0; });

      const q = query(collection(db, "songs"), limit(20));
      onSnapshot(q, (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Track, "id">),
          streams: statsMap[doc.id] ?? (doc.data().streams ?? 0),
        }));
        setTracks(data.sort((a, b) => (b.streams ?? 0) - (a.streams ?? 0)).slice(0, 5));
        setTracksLoading(false);
      });
    });
    return () => statsUnsub();
  }, []);

  /* Recently added songs — newest 6 */
  useEffect(() => {
    const q = query(collection(db, "songs"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, (snap) => {
      setRecentSongs(snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Track, "id">) })));
      setRecentSongsLoading(false);
    }, () => {
      const q2 = query(collection(db, "songs"), limit(6));
      onSnapshot(q2, (snap) => {
        setRecentSongs(snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Track, "id">) })));
        setRecentSongsLoading(false);
      });
    });
    return () => unsub();
  }, []);

  /* Artists — newest 6 */
  useEffect(() => {
    const q = query(collection(db, "artists"), orderBy("joined", "desc"), limit(6));
    const unsub = onSnapshot(q, (snap) => {
      setArtists(snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Artist, "id">) })));
      setArtistsLoading(false);
    }, () => {
      const q2 = query(collection(db, "artists"), limit(6));
      onSnapshot(q2, (snap) => {
        setArtists(snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Artist, "id">) })));
        setArtistsLoading(false);
      });
    });
    return () => unsub();
  }, []);

  const spotlight = [...artists]
    .sort((a, b) => parseInt(b.streams || "0") - parseInt(a.streams || "0"))
    .slice(0, 3);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) { togglePlay(); return; }
    play({
      id: track.id,
      title: track.title || "Untitled",
      artist: track.artist || "Unknown Artist",
      duration: track.duration || "--:--",
      genre: track.genre || track.category || "",
      coverUrl: track.coverUrl || "",
      thumbnail: track.coverUrl || "",
      audioUrl: track.audioUrl || "",
    } as any);
  };

  const isPlaying = (id: string) => playing && currentTrack?.id === id;

  return (
    <>
      {/* ════════════════════════════════════════
          TWO-COLUMN: Trending + Recently Added Songs
      ════════════════════════════════════════ */}
      <section className="dual-section">

        {/* LEFT: Trending Now */}
        <div className="dual-col">
          <div className="tr-header">
            <h2 className="tr-title">
              <span className="tr-title-bar" />
              Trending Now
            </h2>
            <Link href="/music" className="tr-view-all">
              View All
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {tracksLoading ? (
            <div className="tr-skeleton-list">
              {[...Array(5)].map((_, i) => <div key={i} className="tr-skeleton-row" />)}
            </div>
          ) : tracks.length === 0 ? (
            <p className="ra-empty">No tracks yet.</p>
          ) : (
            <div className="tr-list">
              {tracks.map((track, idx) => {
                const active = isPlaying(track.id);
                const cover  = track.coverUrl || track.thumbnail;
                const title  = track.title || "Untitled";
                const artist = track.artist || "Unknown Artist";
                return (
                  <div
                    key={track.id}
                    className={`tr-track${active ? " tr-track--active" : ""}`}
                    onClick={() => handlePlayTrack(track)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handlePlayTrack(track)}
                  >
                    <div className="tr-num">{active ? <PlayingBars /> : idx + 1}</div>
                    <div className="tr-art">
                      {cover
                        ? <img src={cover} alt={title} className="tr-art-img" />
                        : <div className="tr-art-fallback">{firstChar(title)}</div>
                      }
                    </div>
                    <div className="tr-info">
                      <div className="tr-name">{title}</div>
                      <div className="tr-artist">{artist}</div>
                    </div>
                    <div className="tr-meta">
                      {(track.genre || track.category) && (
                        <span className="tr-genre">{track.genre || track.category}</span>
                      )}
                      {(track.streams ?? 0) > 0 && (
                        <span className="tr-plays">{formatStreams(track.streams!)} plays</span>
                      )}
                      <span className="tr-dur">{track.duration || "--:--"}</span>
                    </div>
                    <div className={`tr-play-btn${active ? " tr-play-btn--active" : ""}`} aria-label={active ? "Pause" : `Play ${title}`}>
                      {active ? <PauseIcon /> : <svg width="10" height="12" viewBox="0 0 10 12"><path d="M1 1l8 5-8 5V1z" /></svg>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="dual-divider" />

        {/* RIGHT: Recently Added Songs */}
        <div className="dual-col">
          <div className="tr-header">
            <h2 className="tr-title">
              <span className="tr-title-bar" style={{ background: "#CC0000" }} />
              New Releases
            </h2>
            <Link href="/music" className="tr-view-all">
              View All
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentSongsLoading ? (
            <div className="rs-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="rs-skeleton" />)}
            </div>
          ) : recentSongs.length === 0 ? (
            <p className="ra-empty">No songs yet.</p>
          ) : (
            <div className="rs-grid">
              {recentSongs.map((song) => (
                <RecentSongCard
                  key={song.id}
                  track={song}
                  active={isPlaying(song.id)}
                  onPlay={() => handlePlayTrack(song)}
                />
              ))}
            </div>
          )}
        </div>

      </section>

      {/* ════════════════════════════════════════
          RECENTLY ADDED ARTISTS
      ════════════════════════════════════════ */}
      <section className="ra-section">
        <div className="tr-header">
          <h2 className="tr-title">
            <span className="tr-title-bar" style={{ background: "#D4A017" }} />
            Recently Added Artists
          </h2>
          <Link href="/artists" className="tr-view-all">
            All Artists
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {artistsLoading ? (
          <div className="ra-loading">
            {[...Array(6)].map((_, i) => <div key={i} className="ra-skeleton" />)}
          </div>
        ) : artists.length === 0 ? (
          <p className="ra-empty">No artists yet.</p>
        ) : (
          <div className="ra-grid">
            {artists.map((artist) => (
              <MiniArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          ARTIST SPOTLIGHT
      ════════════════════════════════════════ */}
      {!artistsLoading && spotlight.length > 0 && (
        <section className="sp-section">
          <div className="tr-header" style={{ marginBottom: 20 }}>
            <h2 className="tr-title">
              <span className="tr-title-bar" style={{ background: "#CC0000" }} />
              Artist Spotlight
            </h2>
            <Link href="/artists" className="tr-view-all">
              Discover More
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="sp-grid">
            {spotlight.map((artist, idx) => (
              <SpotlightCard key={artist.id} artist={artist} rank={idx + 1} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

/* ── Small sub-components ───────────────────────────────────── */
function PlayingBars() {
  return (
    <div className="tr-playing-bars">
      {[0, 1, 2].map((i) => (
        <div key={i} className="tr-playing-bar" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12">
      <rect x="0" y="0" width="3.5" height="12" fill="currentColor" />
      <rect x="6.5" y="0" width="3.5" height="12" fill="currentColor" />
    </svg>
  );
}