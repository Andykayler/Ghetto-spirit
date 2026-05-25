"use client";
import { X, User } from "lucide-react";
import { useState } from "react";
import "./addartist.css";

interface AddArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddArtistModal({ isOpen, onClose }: AddArtistModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");
  
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Artist added successfully! (Demo)");
    onClose();
    
    // Reset form
    setProfilePreview(null);
    setProfileFileName("");
    setArtistName("");
    setGenre("");
    setAge("");
    setGender("");
    setLocation("");
    setBio("");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-artist-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img 
              src="/images/logo.png" 
              alt="Ghetto Spirit Logo" 
              className="modal-logo" 
            />
            <h2>Add New Artist</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <form className="add-artist-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Artist Name <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Enter full artist name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Main Genre <span className="required">*</span></label>
              <input
                type="text"
                list="genre-list"
                placeholder="Hip Hop, Afrobeats..."
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
              <datalist id="genre-list">
                <option value="Hip Hop" />
                <option value="Afrobeats" />
                <option value="Afrobeat" />
                <option value="Trap" />
                <option value="R&B" />
                <option value="Reggae" />
                <option value="Amapiano" />
                <option value="Dancehall" />
              </datalist>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="16"
                max="70"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Based In (Location) <span className="required">*</span></label>
            <input
              type="text"
              placeholder="e.g. Zomba, Matawale"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Profile Picture */}
          <div className="form-group">
            <label>Profile Picture <span className="required">*</span></label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfileChange}
                required
              />
              <div className="file-placeholder">
                <User size={20} />
                <span>{profileFileName || "Choose Profile Image"}</span>
              </div>
            </div>

            {profilePreview && (
              <div className="profile-preview">
                <img src={profilePreview} alt="Profile preview" />
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Artist Bio <span className="required">*</span></label>
            <textarea
              placeholder="Write a short biography about the artist..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-submit-btn">
              Add Artist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}