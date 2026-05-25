"use client";

import Sidebar from "../../components/NavBar/Sidebar";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import "./artists.css";

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Sample data (you can replace with real data later)
  const artists = [
    { id: 1, name: "Lil Zulu", image: "/images/artists/lilzulu.jpg", streams: "12.4M", songs: 45, status: "verified", joined: "Jan 2024" },
    { id: 2, name: "Mama Africa", image: "/images/artists/mamaafrica.jpg", streams: "8.9M", songs: 32, status: "verified", joined: "Mar 2024" },
    { id: 3, name: "Trap King", image: "/images/artists/trapking.jpg", streams: "5.2M", songs: 28, status: "pending", joined: "May 2024" },
    { id: 4, name: "Queen V", image: "/images/artists/queenv.jpg", streams: "3.8M", songs: 19, status: "verified", joined: "Feb 2024" },
    { id: 5, name: "Young Lion", image: "/images/artists/younglion.jpg", streams: "2.1M", songs: 14, status: "pending", joined: "Jun 2024" },
  ];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || artist.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Artist Management</h1>
          <button className="add-btn">
            <Plus size={20} />
            Add New Artist
          </button>
        </div>

        {/* Search & Filters */}
        <div className="controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={`filter-btn ${filter === 'verified' ? 'active' : ''}`} onClick={() => setFilter('verified')}>
              Verified
            </button>
            <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              Pending
            </button>
          </div>
        </div>

        {/* Artists Table */}
        <div className="content-card table-card">
          <table className="artists-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Total Streams</th>
                <th>Songs</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists.map((artist) => (
                <tr key={artist.id}>
                  <td>
                    <div className="artist-info">
                      <img src={artist.image} alt={artist.name} className="artist-avatar" />
                      <span>{artist.name}</span>
                    </div>
                  </td>
                  <td>{artist.streams}</td>
                  <td>{artist.songs}</td>
                  <td>{artist.joined}</td>
                  <td>
                    <span className={`status-badge ${artist.status}`}>
                      {artist.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view"><Eye size={18} /></button>
                      <button className="action-btn edit"><Edit size={18} /></button>
                      <button className="action-btn delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}