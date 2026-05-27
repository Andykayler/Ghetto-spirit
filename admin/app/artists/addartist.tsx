"use client";
import { X, User, Upload } from "lucide-react";
import { useState } from "react";
import "./addartist.css";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface AddArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPLOAD_URL = "https://upload.titramw.com/upload.php";

async function uploadToServer(
  file: File, 
  folder: string = "", 
  onProgress: (msg: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder); // Send folder to PHP

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(`${pct}%`);
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.url) resolve(res.url);
        else reject(new Error(res.error || "Upload failed"));
      } catch {
        reject(new Error("Invalid server response"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Cannot connect to upload server"));
    });

    xhr.open("POST", UPLOAD_URL);
    xhr.timeout = 90000;
    xhr.send(formData);
  });
}

export default function AddArtistModal({ isOpen, onClose }: AddArtistModalProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");

  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profileFileName, setProfileFileName] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfileFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName || !location || !bio || !profileFile) {
      return toast.error("Please fill all required fields and select a profile picture");
    }

    setLoading(true);
    setProgress("");

    try {
      setProgress("Uploading profile picture...");
      const imageUrl = await uploadToServer(
        profileFile, 
        "artists",           // ← Different folder for profile pictures
        (p) => setProgress(`Profile Upload: ${p}`)
      );

      setProgress("Saving artist...");
      await addDoc(collection(db, "artists"), {
        name: artistName,
        genre: genre,
        age: age ? parseInt(age) : null,
        gender: gender,
        location: location,
        bio: bio,
        status: "pending",
        streams: "0",
        songs: 0,
        joined: new Date().getFullYear() + "",
        createdAt: serverTimestamp(),
        image: imageUrl,        // ← Now saving the uploaded image URL
      });

      toast.success("✅ Artist added successfully!");
      onClose();
      resetForm();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add artist");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const resetForm = () => {
    setArtistName("");
    setGenre("");
    setAge("");
    setGender("");
    setLocation("");
    setBio("");
    setProfileFileName("");
    setProfilePreview(null);
    setProfileFile(null);
  };

  return (
    <div className="modal-overlay">
      <div className="add-artist-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src="/images/logo.png" alt="Ghetto Spirit Logo" className="modal-logo" />
            <h2>Add New Artist</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content">
          <form className="add-artist-form" onSubmit={handleSubmit}>
            {/* ... your existing form fields ... */}

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

            {/* Age & Gender */}
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

            {/* Profile Picture Upload */}
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

            <div className="form-group">
              <label>Artist Bio <span className="required">*</span></label>
              <textarea
                placeholder="Write a short biography about the artist..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            {progress && (
              <p style={{ color: "#aaa", fontSize: "0.9rem", margin: "10px 0" }}>
                {progress}
              </p>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="add-submit-btn" disabled={loading}>
                {loading ? "Uploading..." : "Add Artist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}