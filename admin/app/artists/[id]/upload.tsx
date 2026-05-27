"use client";
import { X, Upload, Image as ImageIcon, Search, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import "./upload.css";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface Artist {
  id: string;
  name: string;
  songs: number;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When passed, the artist field is pre-filled and locked (used from artist profile page) */
  lockedArtist?: Artist;
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
    if (folder) formData.append("folder", folder);

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

    xhr.addEventListener("error", () => reject(new Error("Upload server error")));
    xhr.open("POST", UPLOAD_URL);
    xhr.timeout = 90000;
    xhr.send(formData);
  });
}

export default function UploadModal({
  isOpen,
  onClose,
  lockedArtist,
}: UploadModalProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [coverFileName, setCoverFileName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [artistSearch, setArtistSearch] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showArtistList, setShowArtistList] = useState(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");

  // Pre-fill if lockedArtist is passed
  useEffect(() => {
    if (lockedArtist) {
      setSelectedArtist(lockedArtist);
      setArtistSearch(lockedArtist.name);
    }
  }, [lockedArtist, isOpen]);

  // Only fetch artists list if not locked
  useEffect(() => {
    if (!isOpen || lockedArtist) return;

    const fetchArtists = async () => {
      try {
        const snapshot = await getDocs(collection(db, "artists"));
        const list: Artist[] = snapshot.docs.map((d) => ({
          id: d.id,
          name: (d.data() as any).name || "",
          songs: (d.data() as any).songs || 0,
        }));
        setArtists(list);
      } catch (err) {
        console.error(err);
        toast.error("Could not load artists");
      }
    };
    fetchArtists();
  }, [isOpen, lockedArtist]);

  const filteredArtists = artists
    .filter((a) =>
      a.name.toLowerCase().includes(artistSearch.toLowerCase())
    )
    .sort((a, b) => b.songs - a.songs);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.name);
    setShowArtistList(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverFile)
      return toast.error("Please select both files");
    if (!selectedArtist) return toast.error("Please select an artist");
    if (!title?.trim() || !genre?.trim())
      return toast.error("Title and Genre are required");

    setLoading(true);
    setProgress("");

    try {
      setProgress("Uploading cover...");
      const coverUrl = await uploadToServer(coverFile, "covers", (p) =>
        setProgress(`Cover: ${p}`)
      );

      setProgress("Uploading audio...");
      const audioUrl = await uploadToServer(audioFile, "songs", (p) =>
        setProgress(`Audio: ${p}`)
      );

      await addDoc(collection(db, "songs"), {
        title: title.trim(),
        artist: selectedArtist.name,
        artistId: selectedArtist.id,
        genre: genre.trim(),
        audioUrl,
        coverUrl,
        streams: 0,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "artists", selectedArtist.id), {
        songs: increment(1),
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
    setTitle("");
    setGenre("");
    // Don't reset artist search if locked
    if (!lockedArtist) {
      setArtistSearch("");
      setSelectedArtist(null);
    }
    setAudioFile(null);
    setCoverFile(null);
    setAudioFileName("");
    setCoverFileName("");
    setCoverPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src="/images/logo.png"
              alt="Ghetto Spirit Logo"
              className="modal-logo"
            />
            <h2>Upload New Song</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content">
          <form className="upload-form" onSubmit={handleSubmit}>
            {/* Song Title */}
            <div className="form-group">
              <label>
                Song Title <span className="required">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title"
                required
              />
            </div>

            {/* Artist — locked or searchable */}
            <div className="form-group">
              <label>
                Artist <span className="required">*</span>
              </label>

              {lockedArtist ? (
                /* Locked: just show a read-only pill */
                <div className="locked-artist-field">
                  <Lock size={16} />
                  <span>{lockedArtist.name}</span>
                </div>
              ) : (
                <div className="artist-search-wrapper">
                  <div className="search-input-container">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Type artist name..."
                      value={artistSearch}
                      onChange={(e) => {
                        setArtistSearch(e.target.value);
                        setShowArtistList(true);
                      }}
                      onFocus={() => setShowArtistList(true)}
                      required
                    />
                  </div>

                  {showArtistList && artistSearch && (
                    <div className="artist-dropdown">
                      {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                          <div
                            key={artist.id}
                            className="artist-option"
                            onClick={() => handleSelectArtist(artist)}
                          >
                            {artist.name}{" "}
                            <span className="artist-song-count">
                              ({artist.songs} songs)
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="artist-option no-result">
                          No artist found
                        </div>
                      )}
                    </div>
                  )}

                  {selectedArtist && (
                    <p className="selected-artist">✓ {selectedArtist.name}</p>
                  )}
                </div>
              )}
            </div>

            {/* Audio & Cover */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Audio File <span className="required">*</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setAudioFile(f);
                        setAudioFileName(f.name);
                      }
                    }}
                    required
                  />
                  <div className="file-placeholder">
                    <Upload size={20} />
                    <span>{audioFileName || "Choose Audio"}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Cover Photo <span className="required">*</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setCoverFile(f);
                        setCoverFileName(f.name);
                        const reader = new FileReader();
                        reader.onload = (ev) =>
                          setCoverPreview(ev.target?.result as string);
                        reader.readAsDataURL(f);
                      }
                    }}
                    required
                  />
                  <div className="file-placeholder">
                    <ImageIcon size={20} />
                    <span>{coverFileName || "Choose Cover"}</span>
                  </div>
                </div>
                {coverPreview && (
                  <div className="cover-preview">
                    <img src={coverPreview} alt="preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Genre */}
            <div className="form-group">
              <label>
                Genre <span className="required">*</span>
              </label>
              <input
                type="text"
                list="genre-list"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Hip Hop"
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
              </datalist>
            </div>

            {progress && <p className="progress-text">{progress}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="upload-submit-btn"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Song"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}