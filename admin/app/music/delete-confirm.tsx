"use client";
import { Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  songTitle?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, songTitle }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="upload-modal" style={{ maxWidth: "420px" }}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Trash2 size={28} color="#ef4444" />
            <h2>Delete Song</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: "2rem 2.4rem" }}>
          <p style={{ color: "#ddd", fontSize: "1.05rem", lineHeight: "1.6" }}>
            Are you sure you want to delete <strong>"{songTitle}"</strong>?<br />
            This action cannot be undone.
          </p>

          <div className="modal-actions" style={{ marginTop: "2rem" }}>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="upload-submit-btn" 
              style={{ background: "#ef4444", color: "white" }}
              onClick={onConfirm}
            >
              Yes, Delete Song
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}