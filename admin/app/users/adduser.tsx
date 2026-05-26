"use client";
import { X, User } from "lucide-react";
import { useState } from "react";
import "./adduser.css";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ User added successfully! (Demo)");
    onClose();

    // Reset form
    setProfilePreview(null);
    setProfileFileName("");
    setFullName("");
    setEmail("");
    setRole("");
    setStatus("active");
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
      <div className="add-user-modal">
        {/* Sticky Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src="/images/logo.png"
              alt="Ghetto Spirit Logo"
              className="modal-logo"
            />
            <h2>Add New User</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="modal-content">
          <form className="add-user-form" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfileChange}
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

            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role <span className="required">*</span></label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">Select Role</option>
                  <option value="Listener">Listener</option>
                  <option value="Artist">Artist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="add-submit-btn">
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}