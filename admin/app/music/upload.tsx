"use client";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import "./upload.css";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [coverFileName, setCoverFileName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");   // ← New state for genre

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Song uploaded successfully! (Demo)");
    onClose();
    // Reset form
    setCoverPreview(null);
    setAudioFileName("");
    setCoverFileName("");
    setGenre("");
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAudioFileName(file.name);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload New Song</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          {/* Song Title */}
          <div className="form-group">
            <label>Song Title <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Enter song title"
              required
            />
          </div>

          {/* Artist Name */}
          <div className="form-group">
            <label>Artist Name <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Artist name"
              required
            />
          </div>

          <div className="form-row">
            {/* Audio File */}
            <div className="form-group">
              <label>Audio File <span className="required">*</span></label>
              <div className="file-input-wrapper audio">
                <input
                  type="file"
                  accept="audio/mp3,audio/wav,audio/mpeg"
                  onChange={handleAudioChange}
                  required
                />
                <div className="file-placeholder">
                  <Upload size={20} />
                  <span>{audioFileName || "Choose Audio File"}</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="form-group">
              <label>Cover Photo <span className="required">*</span></label>
              <div className="file-input-wrapper cover">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  required
                />
                <div className="file-placeholder">
                  <ImageIcon size={20} />
                  <span>{coverFileName || "Choose Cover Image"}</span>
                </div>
              </div>

              {coverPreview && (
                <div className="cover-preview">
                  <img src={coverPreview} alt="Cover preview" />
                </div>
              )}
            </div>
          </div>

          {/* Genre - Now Editable (Can type custom genre) */}
          <div className="form-group">
            <label>Genre <span className="required">*</span></label>
            <input
              type="text"
              list="genre-list"
              placeholder="Select or type genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
            <datalist id="genre-list">
              <option value="Hip Hop" />
              <option value="Afrobeat" />
              <option value="Trap" />
              <option value="R&B" />
              <option value="Reggae" />
              <option value="Afrobeats" />
              <option value="Amapiano" />
              <option value="Pop" />
              <option value="Dancehall" />
              <option value="Highlife" />
            </datalist>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="upload-submit-btn">
              Upload Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}