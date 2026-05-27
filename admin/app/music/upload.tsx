"use client";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import "./upload.css";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ UPDATED URL
const UPLOAD_URL = "https://upload.titramw.com/upload.php";

async function uploadToServer(file: File, onProgress: (msg: string) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

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
        reject(new Error("Invalid server response: " + xhr.responseText));
      }
    });

    xhr.addEventListener("error", () => {
      console.error("Network Error - Tried URL:", UPLOAD_URL);
      reject(new Error("Cannot connect to upload server. Check if upload.php exists."));
    });

    xhr.open("POST", UPLOAD_URL);
    xhr.timeout = 90000;
    xhr.send(formData);
  });
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [coverFileName, setCoverFileName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");

  if (!isOpen) return null;

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverFile) return toast.error("Please select both files");

    setLoading(true);
    try {
      setProgress("Uploading cover image...");
      const coverUrl = await uploadToServer(coverFile, (p) => setProgress(`Cover ${p}`));

      setProgress("Uploading audio...");
      const audioUrl = await uploadToServer(audioFile, (p) => setProgress(`Audio ${p}`));

      setProgress("Saving song...");
      await addDoc(collection(db, "songs"), {
        title, artist: artistName, genre,
        audioUrl, coverUrl, streams: 0,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Song uploaded successfully!");
      onClose();
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const resetForm = () => {
    setTitle(""); setArtistName(""); setGenre("");
    setAudioFile(null); setCoverFile(null);
    setAudioFileName(""); setCoverFileName(""); setCoverPreview(null);
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src="/images/logo.png" alt="Ghetto Spirit Logo" className="modal-logo" />
            <h2>Upload New Song</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content">
          <form className="upload-form" onSubmit={handleSubmit}>
            {/* Form fields unchanged - same as before */}
            <div className="form-group">
              <label>Song Title <span className="required">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Artist Name <span className="required">*</span></label>
              <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Audio File <span className="required">*</span></label>
                <div className="file-input-wrapper">
                  <input type="file" accept="audio/mp3,audio/wav,audio/mpeg" onChange={handleAudioChange} required />
                  <div className="file-placeholder"><Upload size={20} /><span>{audioFileName || "Choose Audio"}</span></div>
                </div>
              </div>

              <div className="form-group">
                <label>Cover Photo <span className="required">*</span></label>
                <div className="file-input-wrapper">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} required />
                  <div className="file-placeholder"><ImageIcon size={20} /><span>{coverFileName || "Choose Cover"}</span></div>
                </div>
                {coverPreview && <div className="cover-preview"><img src={coverPreview} alt="preview" /></div>}
              </div>
            </div>

            <div className="form-group">
              <label>Genre <span className="required">*</span></label>
              <input type="text" list="genre-list" value={genre} onChange={(e) => setGenre(e.target.value)} required />
              <datalist id="genre-list">
                <option value="Hip Hop" /><option value="Afrobeat" /><option value="Trap" />
                <option value="R&B" /><option value="Reggae" /><option value="Afrobeats" />
                <option value="Amapiano" /><option value="Pop" /><option value="Dancehall" />
                <option value="Highlife" />
              </datalist>
            </div>

            {progress && <p style={{color:"#aaa", fontSize:"0.9rem"}}>{progress}</p>}

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="upload-submit-btn" disabled={loading}>
                {loading ? "Uploading..." : "Upload Song"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}