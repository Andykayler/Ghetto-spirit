"use client";
import { X, Upload, Image as ImageIcon, Search, Lock, Video } from "lucide-react";
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
  lockedArtist?: Artist;
}

type UploadType = "song" | "video";

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
    xhr.timeout = 300000;
    xhr.send(formData);
  });
}

export default function UploadModal({
  isOpen,
  onClose,
  lockedArtist,
}: UploadModalProps) {
  const [uploadType, setUploadType] = useState<UploadType>("song");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [audioFileName, setAudioFileName] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [videoFileName, setVideoFileName] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [artistSearch, setArtistSearch] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showArtistList, setShowArtistList] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");

  useEffect(() => {
    if (lockedArtist) {
      setSelectedArtist(lockedArtist);
      setArtistSearch(lockedArtist.name);
    }
  }, [lockedArtist, isOpen]);

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
    .filter((a) => a.name.toLowerCase().includes(artistSearch.toLowerCase()))
    .sort((a, b) => b.songs - a.songs);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.name);
    setShowArtistList(false);
  };

  // Fully manual validation — no `required` on file inputs to avoid
  // the browser silently blocking submission when the other type is active
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title?.trim()) return toast.error("Title is required");
    if (!genre?.trim()) return toast.error("Genre is required");
    if (!selectedArtist) return toast.error("Please select an artist");
    if (!coverFile) return toast.error("Please select a cover photo");
    if (uploadType === "song" && !audioFile)
      return toast.error("Please select an audio file");
    if (uploadType === "video" && !videoFile)
      return toast.error("Please select a video file");

    setLoading(true);
    setProgress("");

    try {
      setProgress("Uploading cover...");
      const coverUrl = await uploadToServer(coverFile, "covers", (p) =>
        setProgress(`Cover: ${p}`)
      );

      if (uploadType === "song") {
        setProgress("Uploading audio...");
        const audioUrl = await uploadToServer(audioFile!, "songs", (p) =>
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
      } else {
        setProgress("Uploading video...");
        const videoUrl = await uploadToServer(videoFile!, "videos", (p) =>
          setProgress(`Video: ${p}`)
        );

        await addDoc(collection(db, "videos"), {
          title: title.trim(),
          artist: selectedArtist.name,
          artistId: selectedArtist.id,
          genre: genre.trim(),
          videoUrl,
          coverUrl,
          views: 0,
          createdAt: serverTimestamp(),
        });

        await updateDoc(doc(db, "artists", selectedArtist.id), {
          videos: increment(1),
        });

        toast.success("✅ Video uploaded successfully!");
      }

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
    setUploadType("song");
    if (!lockedArtist) {
      setArtistSearch("");
      setSelectedArtist(null);
    }
    setAudioFile(null);
    setVideoFile(null);
    setCoverFile(null);
    setAudioFileName("");
    setVideoFileName("");
    setCoverFileName("");
    setCoverPreview(null);
    setVideoPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src="/images/logo.png" alt="Logo" className="modal-logo" />
            <h2>Upload {uploadType === "song" ? "New Song" : "New Video"}</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        {/* Upload Type Toggle */}
        <div className="upload-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${uploadType === "song" ? "active" : ""}`}
            onClick={() => setUploadType("song")}
          >
            <Upload size={16} /> Song
          </button>
          <button
            type="button"
            className={`toggle-btn ${uploadType === "video" ? "active" : ""}`}
            onClick={() => setUploadType("video")}
          >
            <Video size={16} /> Video
          </button>
        </div>

        <div className="modal-content">
          <form className="upload-form" onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="form-group">
              <label>
                {uploadType === "song" ? "Song" : "Video"} Title{" "}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${uploadType} title`}
              />
            </div>

            {/* Artist */}
            <div className="form-group">
              <label>
                Artist <span className="required">*</span>
              </label>
              {lockedArtist ? (
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

            {/* File inputs */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  {uploadType === "song" ? "Audio File" : "Video File"}{" "}
                  <span className="required">*</span>
                </label>
                <div className="file-input-wrapper">
                  {uploadType === "song" ? (
                    <input
                      type="file"
                      accept="audio/mp3,audio/wav,audio/mpeg"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setAudioFile(f); setAudioFileName(f.name); }
                      }}
                    />
                  ) : (
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setVideoFile(f);
                          setVideoFileName(f.name);
                          setVideoPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                  )}
                  <div className="file-placeholder">
                    {uploadType === "song" ? (
                      <Upload size={20} />
                    ) : (
                      <Video size={20} />
                    )}
                    <span>
                      {uploadType === "song"
                        ? audioFileName || "Choose Audio"
                        : videoFileName || "Choose Video"}
                    </span>
                  </div>
                </div>

                {uploadType === "video" && videoPreview && (
                  <div className="cover-preview video-preview">
                    <video src={videoPreview} controls muted />
                  </div>
                )}
              </div>

              {/* Cover Photo */}
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
                {loading
                  ? "Uploading..."
                  : `Upload ${uploadType === "song" ? "Song" : "Video"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}