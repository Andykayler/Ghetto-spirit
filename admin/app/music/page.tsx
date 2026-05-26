"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Plus, Search, Play, Edit, Trash2, Download } from "lucide-react";
import MusicPlayerBar from "../../components/MusicPlayerBar";
import UploadModal from "./upload";
import EditModal from "./edit";           // ← New
import DeleteConfirmModal from "./delete-confirm"; // ← New
import "./music.css";

export default function MusicLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Sample Music Data
  const [songs, setSongs] = useState([
    { 
      id: 1, 
      title: "Night in the Ghetto", 
      artist: "Lil Zulu", 
      streams: "2.3M", 
      duration: "3:45", 
      uploaded: "2 days ago", 
      status: "published",
      cover: "/images/covers/night-in-ghetto.jpg" 
    },
    // ... rest of your songs
    { id: 2, title: "Street Prayer", artist: "Mama Africa", streams: "1.9M", duration: "4:12", uploaded: "1 week ago", status: "published", cover: "/images/covers/street-prayer.jpg" },
    { id: 3, title: "Hustle Season", artist: "Trap King", streams: "1.6M", duration: "3:28", uploaded: "3 days ago", status: "published", cover: "/images/covers/hustle-season.jpg" },
    { id: 4, title: "New Flame", artist: "FireBoy", streams: "892K", duration: "3:50", uploaded: "Today", status: "pending", cover: "/images/covers/new-flame.jpg" },
    { id: 5, title: "Ghetto Love", artist: "Queen V", streams: "1.1M", duration: "4:05", uploaded: "5 days ago", status: "published", cover: "/images/covers/ghetto-love.jpg" },
  ]);

  const filteredSongs = songs.filter(song => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || song.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePlay = (song: any) => {
    setCurrentlyPlaying(song);
  };

  const handleEdit = (song: any) => {
    setSelectedSong(song);
    setShowEditModal(true);
  };

  const handleDeleteClick = (song: any) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  const handleDownload = (song: any) => {
    setDownloadingId(song.id);
    
    // Simulate download
    setTimeout(() => {
      alert(`✅ Downloading: ${song.title} by ${song.artist}`);
      setDownloadingId(null);
    }, 1200);
  };

  const confirmDelete = () => {
    if (selectedSong) {
      setSongs(songs.filter(s => s.id !== selectedSong.id));
      alert(`🗑️ ${selectedSong.title} has been deleted`);
    }
    setShowDeleteModal(false);
    setSelectedSong(null);
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

        {/* Search & Filters */}
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

          <div className="filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Songs</button>
            <button className={`filter-btn ${filter === 'published' ? 'active' : ''}`} onClick={() => setFilter('published')}>Published</button>
            <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          </div>
        </div>

        {/* Music Table */}
        <div className="content-card table-card">
          <table className="music-table">
            <thead>
              <tr>
                <th>Song Title</th>
                <th>Artist</th>
                <th>Streams</th>
                <th>Duration</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song.id}>
                  <td className="song-title-cell">
                    <div className="song-info">
                      <Play 
                        size={18} 
                        className="play-icon" 
                        onClick={() => handlePlay(song)}
                        style={{ cursor: "pointer" }}
                      />
                      <span>{song.title}</span>
                    </div>
                  </td>
                  <td>{song.artist}</td>
                  <td>{song.streams}</td>
                  <td>{song.duration}</td>
                  <td>{song.uploaded}</td>
                  <td>
                    <span className={`status-badge ${song.status}`}>
                      {song.status === 'published' ? 'Published' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" onClick={() => handlePlay(song)} title="Play">
                        <Play size={18} />
                      </button>
                      <button className="action-btn" onClick={() => handleEdit(song)} title="Edit">
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
                      <button className="action-btn delete" onClick={() => handleDeleteClick(song)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Music Player */}
      {currentlyPlaying && (
        <MusicPlayerBar 
          song={currentlyPlaying} 
          onClose={() => setCurrentlyPlaying(null)} 
        />
      )}

      {/* Modals */}
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      
      <EditModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        song={selectedSong}
      />

      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        songTitle={selectedSong?.title}
      />
    </div>
  );
}