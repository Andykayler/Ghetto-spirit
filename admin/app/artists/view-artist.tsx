"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Play, Plus, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import UploadModal from "../music/upload";
import { getSongStreamStats } from "./streamstats";

interface Artist {
  id: string;
  name: string;
  image?: string;
  genre?: string;
  bio?: string;
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
}

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  // songId → stream count sourced from `tracks`
  const [streamStats, setStreamStats] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch Artist Details
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

  // Fetch Songs + real stream counts from `tracks`
  useEffect(() => {
    if (!artistId) return;

    const q = query(collection(db, "songs"), where("artistId", "==", artistId));
    const unsub = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Song[];
      setSongs(data);

      if (data.length > 0) {
        try {
          const statsMap = await getSongStreamStats(data.map((s) => s.id));
          setStreamStats(
            new Map(Array.from(statsMap.entries()).map(([id, stat]) => [id, stat.streams]))
          );
        } catch (err) {
          console.error("Failed to load stream stats:", err);
        }
      } else {
        setStreamStats(new Map());
      }
    });

    return () => unsub();
  }, [artistId]);

  // Total streams across all this artist's songs — sourced from `tracks`
  const totalStreams = Array.from(streamStats.values()).reduce((sum, n) => sum + n, 0);

  const formatStreams = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <p style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <p style={{ textAlign: "center", padding: "4rem", color: "red" }}>Artist not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <button
          onClick={() => router.push("/artists")}
          style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", marginBottom: "1rem" }}
        >
          <ArrowLeft size={20} /> Back to Artists
        </button>

        {/* Hero */}
        <div style={{
          height: "420px",
          borderRadius: "20px",
          background: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.95)), url(${artist.image || "/images/default.jpg"}) center/cover`,
          position: "relative",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "flex-end",
          padding: "3rem",
          backgroundSize: "cover"
        }}>
          <div>
            <p style={{ color: "#C9A84C", fontWeight: "700", letterSpacing: "2px" }}>ARTIST</p>
            <h1 style={{ fontSize: "4.8rem", fontFamily: "'Bebas Neue', sans-serif", margin: "0.2rem 0", color: "white" }}>
              {artist.name}
            </h1>
            <p style={{ color: "#ddd", fontSize: "1.3rem" }}>
              {artist.genre || "Unknown"} • {songs.length} songs
            </p>

            {/* Stats row — streams come from tracks, not the artist doc */}
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "1rem" }}>
              <div>
                <p style={{ color: "#C9A84C", fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>
                  {formatStreams(totalStreams)}
                </p>
                <p style={{ color: "#aaa", fontSize: "0.75rem", letterSpacing: "1px", margin: 0 }}>STREAMS</p>
              </div>
              <div>
                <p style={{ color: "#C9A84C", fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>
                  {songs.length}
                </p>
                <p style={{ color: "#aaa", fontSize: "0.75rem", letterSpacing: "1px", margin: 0 }}>SONGS</p>
              </div>
              {artist.joined && (
                <div>
                  <p style={{ color: "#C9A84C", fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>
                    {artist.joined}
                  </p>
                  <p style={{ color: "#aaa", fontSize: "0.75rem", letterSpacing: "1px", margin: 0 }}>JOINED</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "2rem" }}>
          <button
            className="add-btn"
            onClick={() => setShowUploadModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Plus size={22} /> Add New Song
          </button>
        </div>

        {/* Songs Table */}
        <div className="content-card table-card">
          <h2 style={{ marginBottom: "1.5rem", color: "white" }}>All Songs by {artist.name}</h2>

          {songs.length === 0 ? (
            <p style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
              No songs yet. Upload the first song above.
            </p>
          ) : (
            <table className="music-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Streams</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr key={song.id}>
                    <td>{index + 1}</td>
                    <td className="song-title-cell">
                      <div className="song-info">
                        {song.coverUrl && (
                          <img src={song.coverUrl} alt="" style={{ width: 45, height: 45, borderRadius: 6 }} />
                        )}
                        <span>{song.title}</span>
                      </div>
                    </td>
                    <td>{song.genre || "—"}</td>
                    <td>{formatStreams(streamStats.get(song.id) ?? 0)}</td>
                    <td>
                      <button className="action-btn" onClick={() => alert(`Playing: ${song.title}`)}>
                        <Play size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}