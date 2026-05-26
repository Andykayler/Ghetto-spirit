"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import "./upload.css"; // Reuse same styles

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: any;
}

export default function EditModal({ isOpen, onClose, song }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    status: "published"
  });

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        genre: "Hip Hop", // You can expand later
        status: song.status
      });
    }
  }, [song]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ Song "${formData.title}" updated successfully!`);
    onClose();
  };

  if (!isOpen || !song) return null;

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <h2>Edit Song</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content">
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Song Title <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Artist Name <span className="required">*</span></label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="published">Published</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="upload-submit-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}