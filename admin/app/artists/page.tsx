"use client";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import "./artists.css";

import AddArtistModal from "./addartist";
import EditArtistModal from "./edit-artist";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { archiveArtist } from "../../lib/archiveHelpers";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function ArtistsPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "artists"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setArtists(data);
    });
    return () => unsub();
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filter === "all" || artist.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleView = (artist: any) => {
    router.push(`/artists/${artist.id}`);
  };

  const handleEdit = (artist: any) => {
    setSelectedArtist(artist);
    setShowEditModal(true);
  };

  const handleDeleteClick = (artist: any) => {
    setSelectedArtist(artist);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedArtist) return;
    try {
      await archiveArtist(selectedArtist.id);
      toast.success(`"${selectedArtist.name}" archived`);
    } catch {
      toast.error("Failed to archive artist");
    } finally {
      setShowDeleteModal(false);
      setSelectedArtist(null);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Artist Management</h1>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add New Artist
          </button>
        </div>

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
              className={`filter-btn ${filter === "verified" ? "active" : ""}`}
              onClick={() => setFilter("verified")}
            >
              Verified
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>
        </div>

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
              {filteredArtists.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "3rem", color: "#666" }}
                  >
                    No artists found.
                  </td>
                </tr>
              ) : (
                filteredArtists.map((artist) => (
                  <tr key={artist.id}>
                    <td>
                      <div className="artist-info">
                        <img
                          src={artist.image || "/images/default.jpg"}
                          alt={artist.name}
                          className="artist-avatar"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/default.jpg";
                          }}
                        />
                        <span>{artist.name}</span>
                      </div>
                    </td>
                    <td>{artist.streams || "0"}</td>
                    <td>{artist.songs || 0}</td>
                    <td>{artist.joined || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge ${artist.status || "pending"}`}
                      >
                        {artist.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          title="View Profile"
                          onClick={() => handleView(artist)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(artist)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDeleteClick(artist)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddArtistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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