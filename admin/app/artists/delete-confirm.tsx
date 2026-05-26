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
  type = "artist" 
}: DeleteConfirmModalProps) {
  
  if (!isOpen) return null;

  const itemName = type === "artist" ? "Artist" : "Song";

  return (
    <div className="modal-overlay">
      <div className="upload-modal" style={{ maxWidth: "440px" }}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Trash2 size={28} color="#ef4444" />
            <h2>Delete {itemName}</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: "2.2rem 2.4rem" }}>
          <p className="delete-warning-text">
            Are you sure you want to permanently delete <br />
            <strong>"{name}"</strong>?
          </p>
          
          <p style={{ color: "#888", fontSize: "0.95rem", marginTop: "8px", textAlign: "center" }}>
            This action cannot be undone.
          </p>

          <div className="modal-actions" style={{ marginTop: "2.4rem" }}>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              type="button" 
              className="upload-submit-btn delete-confirm-btn"
              onClick={onConfirm}
            >
              Yes, Delete {itemName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}