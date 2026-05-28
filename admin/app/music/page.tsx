"use client";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Plus, Search, Play, Edit, Trash2, Download } from "lucide-react";
import MusicPlayerBar from "../../components/MusicPlayerBar";
import UploadModal from "./upload";
import EditModal from "./edit";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import "./music.css";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { archiveSong } from "../../lib/archiveHelpers";
import { toast } from "react-hot-toast";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  audioUrl?: string;
  coverUrl?: string;
  streams?: number;
  createdAt?: any;
  duration?: string;
}

export default function MusicLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Song[];
        setSongs(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        toast.error("Failed to load songs");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (song: Song) => setCurrentlyPlaying(song);

  const handleEdit = (song: Song) => {
    setSelectedSong(song);
    setShowEditModal(true);
  };

  const handleDeleteClick = (song: Song) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedSong) return;
    try {
      await archiveSong(selectedSong.id);
      toast.success(`"${selectedSong.title}" moved to archive`);
      if (currentlyPlaying?.id === selectedSong.id) setCurrentlyPlaying(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive song");
    } finally {
      setShowDeleteModal(false);
      setSelectedSong(null);
    }
  };

  const handleDownload = async (song: Song) => {
    if (!song.audioUrl) return toast.error("No audio file available");
    setDownloadingId(song.id);
    try {
      const res = await fetch(song.audioUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.title} - ${song.artist}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatStreams = (n?: number) => {
    if (!n) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return "—";
    const diff = (Date.now() - ts.toDate().getTime()) / 1000;
    if (diff < 86400) return "Today";
    if (diff < 172800) return "Yesterday";
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return ts.toDate().toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Music Library</h1>
          <button className="add-btn" onClick={() => setShowUploadModal(true)}>
            <Plus size={20} />
            Upload New Song
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="content-card table-card">
          {loading ? (
            <p style={{ padding: "2rem", color: "#666" }}>Loading songs...</p>
          ) : filteredSongs.length === 0 ? (
            <p style={{ padding: "2rem", color: "#666" }}>No songs found.</p>
          ) : (
            <table className="music-table">
              <thead>
                <tr>
                  <th>Song Title</th>
                  <th>Artist</th>
                  <th>Genre</th>
                  <th>Streams</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song) => (
                  <tr key={song.id}>
                    <td className="song-title-cell">
                      <div className="song-info">
                        {song.coverUrl ? (
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              background: "linear-gradient(135deg, #d4a017, #8b0000)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span>{song.title}</span>
                      </div>
                    </td>
                    <td>{song.artist}</td>
                    <td>{song.genre || "—"}</td>
                    <td>{formatStreams(song.streams)}</td>
                    <td>{formatDate(song.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn"
                          onClick={() => handlePlay(song)}
                          title="Play"
                        >
                          <Play size={18} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleEdit(song)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleDownload(song)}
                          disabled={downloadingId === song.id}
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteClick(song)}
                          title="Archive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {currentlyPlaying && (
        <MusicPlayerBar
          song={currentlyPlaying}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        song={selectedSong}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        name={selectedSong?.title}
        type="song"
      />
    </div>
  );
}