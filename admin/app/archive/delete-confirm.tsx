"use client";
import { Archive, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  songTitle?: string;
  artistName?: string;
  type?: "song" | "artist";
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  songTitle,
  artistName,
  type = "song",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const label = type === "artist" ? artistName : songTitle;

  return (
    <div className="modal-overlay">
      <div className="upload-modal" style={{ maxWidth: "420px" }}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Archive size={28} color="#d4a017" />
            <h2>Move to Archive</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: "2rem 2.4rem" }}>
          <p style={{ color: "#ddd", fontSize: "1.05rem", lineHeight: "1.6" }}>
            Are you sure you want to archive{" "}
            <strong>"{label}"</strong>?<br />
            It will be moved to the Archive and can be restored later.
          </p>

          <div className="modal-actions" style={{ marginTop: "2rem" }}>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="upload-submit-btn"
              style={{ background: "#d4a017", color: "#0a0a0a" }}
              onClick={onConfirm}
            >
              Yes, Archive It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
