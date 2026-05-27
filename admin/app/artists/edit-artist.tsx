"use client";
import { X, User, CheckCircle, Clock, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import "./artist-modals.css";

interface EditArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: any;
}

const UPLOAD_URL = "https://upload.titramw.com/upload.php";

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "artists");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.url) resolve(res.url);
        else reject(new Error(res.error || "Upload failed"));
      } catch {
        reject(new Error("Invalid server response"));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Upload error")));
    xhr.open("POST", UPLOAD_URL);
    xhr.timeout = 60000;
    xhr.send(formData);
  });
}

export default function EditArtistModal({ isOpen, onClose, artist }: EditArtistModalProps) {
  const [formData, setFormData] = useState({ name: "", genre: "", bio: "", status: "pending" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || "",
        genre: artist.genre || "",
        bio: artist.bio || "",
        status: artist.status || "pending",
      });
      setImagePreview(artist.image || null);
      setImageFile(null);
    }
  }, [artist, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist?.id) return;
    if (!formData.name.trim()) return toast.error("Artist name is required");
    setLoading(true);
    try {
      let imageUrl = artist.image || "";
      if (imageFile) {
        toast.loading("Uploading image...", { id: "img-upload" });
        imageUrl = await uploadImage(imageFile);
        toast.dismiss("img-upload");
      }
      await updateDoc(doc(db, "artists", artist.id), {
        name: formData.name.trim(),
        genre: formData.genre.trim(),
        bio: formData.bio.trim(),
        status: formData.status,
        ...(imageUrl && { image: imageUrl }),
      });
      toast.success(`${formData.name} updated successfully!`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update artist");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !artist) return null;

  return (
    <div className="am-overlay">
      <div className="am-modal">
        <div className="am-header">
          <div className="am-header-left">
            <img src="/images/logo.png" alt="logo" className="am-logo" />
            <h2>Edit Artist</h2>
          </div>
          <button className="am-close" onClick={onClose} disabled={loading}><X size={24} /></button>
        </div>

        <div className="am-body">
          <form onSubmit={handleSubmit}>

            <div className="am-avatar-section">
              <div className="am-avatar-wrap">
                <img
                  src={imagePreview || "/images/default.jpg"}
                  alt="Artist"
                  className="am-avatar-preview"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/default.jpg"; }}
                />
                <label className="am-avatar-overlay">
                  <Camera size={18} />
                  <span>Change</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              </div>
            </div>

            <div className="am-field">
              <label>Artist Name <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <User size={15} className="am-input-icon" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Artist name"
                  required
                />
              </div>
            </div>

            <div className="am-field">
              <label>Genre</label>
              <input
                type="text"
                list="edit-genre-list"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="e.g. Hip Hop, Afrobeats"
                className="am-plain-input"
              />
              <datalist id="edit-genre-list">
                <option value="Hip Hop" /><option value="Afrobeat" /><option value="Trap" />
                <option value="R&B" /><option value="Reggae" /><option value="Afrobeats" />
                <option value="Amapiano" /><option value="Pop" /><option value="Dancehall" />
              </datalist>
            </div>

            <div className="am-field">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Short artist biography..."
                rows={3}
                className="am-textarea"
              />
            </div>

            <div className="am-field">
              <label>Status</label>
              <div className="am-status-toggle">
                <button
                  type="button"
                  className={`am-status-btn ${formData.status === "verified" ? "active-verified" : ""}`}
                  onClick={() => setFormData({ ...formData, status: "verified" })}
                >
                  <CheckCircle size={15} /> Verified
                </button>
                <button
                  type="button"
                  className={`am-status-btn ${formData.status === "pending" ? "active-pending" : ""}`}
                  onClick={() => setFormData({ ...formData, status: "pending" })}
                >
                  <Clock size={15} /> Pending
                </button>
              </div>
            </div>

            <div className="am-actions">
              <button type="button" className="am-cancel" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="am-submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}