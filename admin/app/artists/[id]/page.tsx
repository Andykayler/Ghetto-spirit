"use client";

import Sidebar from "../../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Play, Plus, ArrowLeft, Music, Headphones, Calendar, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import UploadModal from "../../music/upload";
import { toast } from "react-hot-toast";
import "./profile.css";

interface Artist {
  id: string;
  name: string;
  image?: string;
  genre?: string;
  bio?: string;
  streams?: string | number;
  songs?: number;
  joined?: string;
  status?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre?: string;
  audioUrl?: string;
  coverUrl?: string;
  streams?: number;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!artistId) return;
    const fetchArtist = async () => {
      try {
        const artistDoc = await getDoc(doc(db, "artists", artistId));
        if (artistDoc.exists()) {
          setArtist({ id: artistDoc.id, ...artistDoc.data() } as Artist);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    if (!artistId) return;
    const q = query(collection(db, "songs"), where("artistId", "==", artistId));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Song[];
      setSongs(data);
    });
    return () => unsub();
  }, [artistId]);

  useEffect(() => {
    return () => {
      if (audio) { audio.pause(); audio.src = ""; }
    };
  }, [audio]);

  const handlePlay = (song: Song) => {
    if (!song.audioUrl) return toast.error("No audio available");
    if (playingId === song.id) {
      audio?.pause();
      setPlayingId(null);
      return;
    }
    if (audio) { audio.pause(); audio.src = ""; }
    const newAudio = new Audio(song.audioUrl);
    newAudio.play().catch(() => toast.error("Could not play audio"));
    newAudio.onended = () => setPlayingId(null);
    setAudio(newAudio);
    setPlayingId(song.id);
  };

  const handleDeleteSong = async (song: Song) => {
    if (!confirm(`Delete "${song.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "songs", song.id));
      await updateDoc(doc(db, "artists", artistId), { songs: increment(-1) });
      toast.success(`"${song.title}" deleted`);
      if (playingId === song.id) { audio?.pause(); setPlayingId(null); }
    } catch {
      toast.error("Failed to delete song");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="profile-main">
          <div className="profile-loading">
            <div className="loading-spinner" />
            <p>Loading artist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="profile-main">
          <div className="profile-loading">
            <p style={{ color: "#ef4444" }}>Artist not found.</p>
            <button className="back-btn" onClick={() => router.push("/artists")}>
              <ArrowLeft size={18} /> Back to Artists
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* ← CSS class replaces the old inline mainStyle object */}
      <div className="profile-main">

        {/* Back */}
        <button className="back-btn" onClick={() => router.push("/artists")}>
          <ArrowLeft size={18} /> Back to Artists
        </button>

        {/* Hero Banner */}
        <div
          className="artist-hero"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 60%, #0d0d0d 100%), url(${artist.image || "/images/default.jpg"})`,
          }}
        >
          <div className="hero-avatar-wrap">
            <img
              src={artist.image || "/images/default.jpg"}
              alt={artist.name}
              className="hero-avatar"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/default.jpg"; }}
            />
            <span className={`hero-status-dot ${artist.status === "verified" ? "verified" : "pending"}`} />
          </div>

          <div className="hero-info">
            <p className="hero-label">ARTIST</p>
            <h1 className="hero-name">{artist.name}</h1>
            <p className="hero-meta">
              {artist.genre || "Unknown Genre"}
              {artist.joined && <>&nbsp;•&nbsp;Joined {artist.joined}</>}
              &nbsp;•&nbsp;
              <span className={`hero-badge ${artist.status === "verified" ? "verified" : "pending"}`}>
                {artist.status === "verified" ? "✓ Verified" : "⏳ Pending"}
              </span>
            </p>

            {artist.bio && <p className="hero-bio">{artist.bio}</p>}

            <div className="hero-stats">
              <div className="hero-stat">
                <Headphones size={18} />
                <span>{artist.streams || "0"}</span>
                <label>Streams</label>
              </div>
              <div className="hero-stat">
                <Music size={18} />
                <span>{songs.length}</span>
                <label>Songs</label>
              </div>
              {artist.joined && (
                <div className="hero-stat">
                  <Calendar size={18} />
                  <span>{artist.joined}</span>
                  <label>Joined</label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Songs Section */}
        <div className="songs-section">
          <div className="songs-header">
            <h2>Discography</h2>
            <button className="add-btn" onClick={() => setShowUploadModal(true)}>
              <Plus size={18} /> Add Song
            </button>
          </div>

          {songs.length === 0 ? (
            <div className="songs-empty">
              <Music size={48} />
              <p>No songs yet.</p>
              <span>Upload the first track for {artist.name}.</span>
              <button
                className="add-btn"
                style={{ marginTop: "1.2rem" }}
                onClick={() => setShowUploadModal(true)}
              >
                <Plus size={18} /> Upload First Song
              </button>
            </div>
          ) : (
            <div className="content-card table-card">
              <table className="music-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Streams</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, index) => (
                    <tr key={song.id} className={playingId === song.id ? "playing-row" : ""}>
                      <td className="song-num">
                        {playingId === song.id ? (
                          <span className="eq-bars"><span /><span /><span /></span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td>
                        <div className="song-info">
                          <div className="song-cover-wrap">
                            <img
                              src={song.coverUrl || "/images/default.jpg"}
                              alt={song.title}
                              className="song-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/images/default.jpg"; }}
                            />
                            <button
                              className="song-play-overlay"
                              onClick={() => handlePlay(song)}
                            >
                              {playingId === song.id
                                ? <span className="pause-icon">⏸</span>
                                : <Play size={14} fill="white" />}
                            </button>
                          </div>
                          <span className="song-title">{song.title}</span>
                        </div>
                      </td>
                      <td className="song-genre">{song.genre || "—"}</td>
                      <td>{song.streams?.toLocaleString() || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn"
                            title="Play / Pause"
                            onClick={() => handlePlay(song)}
                          >
                            <Play size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete Song"
                            onClick={() => handleDeleteSong(song)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        lockedArtist={{ id: artist.id, name: artist.name, songs: songs.length }}
      />
    </div>
  );
}