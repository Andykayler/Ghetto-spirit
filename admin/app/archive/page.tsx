"use client";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Search, RotateCcw, Trash2, X, Archive } from "lucide-react";
import "./archive.css";

import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface ArchivedItem {
  id: string;
  type: "song" | "artist";
  name?: string;
  title?: string;
  artist?: string;
  image?: string;
  coverUrl?: string;
  deletedAt?: any;
  originalData?: any;
  [key: string]: any;
}

type ModalType = "restore" | "delete" | null;

export default function ArchivePage() {
  const [items, setItems] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "song" | "artist">("all");
  const [selectedItem, setSelectedItem] = useState<ArchivedItem | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "archive"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ArchivedItem[];
        data.sort((a, b) => {
          const aTime = a.deletedAt?.toMillis?.() ?? 0;
          const bTime = b.deletedAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to load archive");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const getDisplayName = (item: ArchivedItem) =>
    item.type === "song" ? item.title || item.name || "Untitled" : item.name || item.title || "Unknown";

  const getSubtitle = (item: ArchivedItem) =>
    item.type === "song" ? item.artist || "" : "";

  const getImage = (item: ArchivedItem) =>
    item.type === "song" ? item.coverUrl || item.image : item.image || item.coverUrl;

  const getInitials = (item: ArchivedItem) => {
    const name = getDisplayName(item);
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (ts: any) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredItems = items.filter((item) => {
    const name = getDisplayName(item).toLowerCase();
    const sub = getSubtitle(item).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sub.includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const openModal = (item: ArchivedItem, type: ModalType) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const handleRestore = async () => {
    if (!selectedItem) return;
    setProcessing(true);
    try {
      const targetCollection = selectedItem.type === "song" ? "songs" : "artists";
      const { id, deletedAt, originalData, ...restoreData } = selectedItem;
      const dataToRestore = originalData || restoreData;
      await addDoc(collection(db, targetCollection), {
        ...dataToRestore,
        restoredAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "archive", selectedItem.id));
      toast.success(`"${getDisplayName(selectedItem)}" restored successfully`);
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore item");
    } finally {
      setProcessing(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedItem) return;
    setProcessing(true);
    try {
      await deleteDoc(doc(db, "archive", selectedItem.id));
      toast.success(`"${getDisplayName(selectedItem)}" permanently deleted`);
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    } finally {
      setProcessing(false);
    }
  };

  const totalSongs = items.filter((i) => i.type === "song").length;
  const totalArtists = items.filter((i) => i.type === "artist").length;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        {/* Header */}
        <div className="page-header">
          <h1>Archive</h1>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Archived</div>
            <div className="stat-value">{items.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Songs</div>
            <div className="stat-value">{totalSongs}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Artists</div>
            <div className="stat-value">{totalArtists}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search archive..."
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
              className={`filter-btn ${filter === "song" ? "active" : ""}`}
              onClick={() => setFilter("song")}
            >
              Songs
            </button>
            <button
              className={`filter-btn ${filter === "artist" ? "active" : ""}`}
              onClick={() => setFilter("artist")}
            >
              Artists
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="content-card table-card">
          {loading ? (
            <div className="empty-state">
              <p>Loading archive...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Archive size={48} />
              </div>
              <p>
                {searchTerm || filter !== "all"
                  ? "No items match your search."
                  : "Archive is empty. Deleted songs and artists will appear here."}
              </p>
            </div>
          ) : (
            <table className="archive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Artist</th>
                  <th>Archived On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const image = getImage(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="item-info">
                          {image ? (
                            <img
                              src={image}
                              alt={getDisplayName(item)}
                              className="item-avatar"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="item-avatar-placeholder">
                              {getInitials(item)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {getDisplayName(item)}
                            </div>
                            {getSubtitle(item) && (
                              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: 2 }}>
                                {getSubtitle(item)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${item.type}`}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ color: "#888" }}>
                        {item.type === "song" ? item.artist || "—" : "—"}
                      </td>
                      <td style={{ color: "#888", fontSize: "0.9rem" }}>
                        {formatDate(item.deletedAt)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn restore"
                            title="Restore"
                            onClick={() => openModal(item, "restore")}
                          >
                            <RotateCcw size={17} />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Permanently Delete"
                            onClick={() => openModal(item, "delete")}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Restore Modal */}
      {modalType === "restore" && selectedItem && (
        <div className="restore-modal-overlay">
          <div className="restore-modal">
            <div className="restore-modal-header">
              <h2>
                <RotateCcw size={22} color="#22c55e" />
                Restore {selectedItem.type === "song" ? "Song" : "Artist"}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={22} />
              </button>
            </div>
            <div className="restore-modal-body">
              <p>
                Restore <strong>"{getDisplayName(selectedItem)}"</strong> back to{" "}
                {selectedItem.type === "song" ? "Music Library" : "Artists"}?
              </p>
              <p className="sub">It will be removed from the archive.</p>
              <div className="restore-modal-actions">
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleRestore}
                  disabled={processing}
                >
                  {processing ? "Restoring..." : "Yes, Restore"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {modalType === "delete" && selectedItem && (
        <div className="restore-modal-overlay">
          <div className="restore-modal">
            <div className="restore-modal-header">
              <h2>
                <Trash2 size={22} color="#ef4444" />
                Permanent Delete
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={22} />
              </button>
            </div>
            <div className="restore-modal-body">
              <p>
                Permanently delete <strong>"{getDisplayName(selectedItem)}"</strong>?
              </p>
              <p className="sub">This cannot be undone. The item will be gone forever.</p>
              <div className="restore-modal-actions">
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="confirm-btn danger"
                  onClick={handlePermanentDelete}
                  disabled={processing}
                >
                  {processing ? "Deleting..." : "Yes, Delete Forever"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}