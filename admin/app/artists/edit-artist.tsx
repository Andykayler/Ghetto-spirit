"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface EditArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: any;
}

export default function EditArtistModal({ isOpen, onClose, artist }: EditArtistModalProps) {
  const [formData, setFormData] = useState({ name: "", status: "verified" });

  useEffect(() => {
    if (artist) {
      setFormData({ name: artist.name, status: artist.status });
    }
  }, [artist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ ${formData.name} has been updated successfully!`);
    onClose();
  };

  if (!isOpen || !artist) return null;

  return (
    <div className="modal-overlay">
      <div className="add-artist-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <h2>Edit Artist</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content">
          <form className="add-artist-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Artist Name <span className="required">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="add-submit-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}