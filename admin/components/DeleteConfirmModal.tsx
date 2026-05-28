"use client";
import { Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name?: string;
  type?: "song" | "artist";
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  name,
  type = "song",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const itemLabel = type === "artist" ? "Artist" : "Song";

  return (
    <div className="modal-overlay">
      <div className="upload-modal" style={{ maxWidth: "440px" }}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Trash2 size={28} color="#ef4444" />
            <h2>Delete {itemLabel}</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: "2.2rem 2.4rem" }}>
          <p style={{ color: "#ddd", fontSize: "1.05rem", lineHeight: "1.6", textAlign: "center" }}>
            Are you sure you want to permanently delete <br />
            <strong>"{name}"</strong>?
          </p>
          <p style={{ color: "#888", fontSize: "0.95rem", marginTop: "8px", textAlign: "center" }}>
            This action cannot be undone.
          </p>

          <div className="modal-actions" style={{ marginTop: "2.4rem" }}>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="upload-submit-btn"
              style={{ background: "#ef4444", color: "white" }}
              onClick={onConfirm}
            >
              Yes, Delete {itemLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}