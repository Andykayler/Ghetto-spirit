"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import "./artists.css";

import AddArtistModal from "./addartist";
import ViewArtistModal from "./view-artist";
import EditArtistModal from "./edit-artist";
import DeleteConfirmModal from "./delete-confirm";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // REAL FIREBASE DATA
  const [artists, setArtists] = useState<any[]>([]);

  // 🔥 REAL-TIME FETCH FROM FIRESTORE
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "artists"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setArtists(data);
    });

    return () => unsub();
  }, []);

  // FILTERING
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = artist.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" || artist.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ACTIONS
  const handleView = (artist: any) => {
    setSelectedArtist(artist);
    setShowViewModal(true);
  };

  const handleEdit = (artist: any) => {
    setSelectedArtist(artist);
    setShowEditModal(true);
  };

  const handleDeleteClick = (artist: any) => {
    setSelectedArtist(artist);
    setShowDeleteModal(true);
  };

  // DELETE FROM FIRESTORE
  const confirmDelete = async () => {
    if (selectedArtist?.id) {
      await deleteDoc(doc(db, "artists", selectedArtist.id));
    }

    setShowDeleteModal(false);
    setSelectedArtist(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Artist Management</h1>

          <button
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add New Artist
          </button>
        </div>

        {/* SEARCH + FILTER */}
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
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={`filter-btn ${
                filter === "verified" ? "active" : ""
              }`}
              onClick={() => setFilter("verified")}
            >
              Verified
            </button>

            <button
              className={`filter-btn ${
                filter === "pending" ? "active" : ""
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>
        </div>

        {/* TABLE */}
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
                      <img
                        src={artist.image || "/images/default.jpg"}
                        alt={artist.name}
                        className="artist-avatar"
                      />
                      <span>{artist.name}</span>
                    </div>
                  </td>

                  <td>{artist.streams || "0"}</td>
                  <td>{artist.songs || 0}</td>
                  <td>{artist.joined || "N/A"}</td>

                  <td>
                    <span
                      className={`status-badge ${artist.status}`}
                    >
                      {artist.status === "verified"
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => handleView(artist)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(artist)}
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleDeleteClick(artist)
                        }
                      >
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

      {/* MODALS */}
      <AddArtistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ViewArtistModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        artist={selectedArtist}
      />

      <EditArtistModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        artist={selectedArtist}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        name={selectedArtist?.name}
        type="artist"
      />
    </div>
  );
}