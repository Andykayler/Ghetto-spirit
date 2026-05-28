"use client";
import { X, User } from "lucide-react";
import { useState } from "react";
import "./adduser.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generatePassword(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setProfilePreview(null);
    setProfileFileName("");
    setProfileUrl(null);
    setFullName("");
    setEmail("");
    setRole("");
    setStatus("active");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      toast.error("Image must be under 200KB");
      return;
    }

    setProfileFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProfilePreview(result);
      setProfileUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Generate a temporary password
      const tempPassword = generatePassword(6);

      // 2. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        tempPassword
      );

      // 3. Send password reset email so user sets their own password
      await sendPasswordResetEmail(auth, email);

      // 4. Save user to Firestore
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        name: fullName,
        email: email,
        role: role,
        status: status,
        streams: 0,
        profileImage: profileUrl || null,
        joined: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        createdAt: serverTimestamp(),
      });

      toast.success(`${fullName} added! Password reset email sent to ${email}`);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else {
        toast.error("Failed to add user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-user-modal">
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
                  <span>{profileFileName || "Choose Profile Image (max 200KB)"}</span>
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
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Listener">Listener</option>
                  <option value="Artist">Artist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => { resetForm(); onClose(); }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="upload-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}