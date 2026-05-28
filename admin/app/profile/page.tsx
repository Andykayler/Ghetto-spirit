"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  Camera, Save, User, Mail, Phone, MapPin,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield
} from "lucide-react";
import "./profile.css";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPw, setUpdatingPw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });

  // Load real user data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        // Query by uid
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data();
          setForm({
            fullName: data.name || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            location: data.location || "",
            role: data.role || "",
            bio: data.bio || "",
          });
          if (data.profileImage) setAvatar(data.profileImage);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) { toast.error("Image must be under 200KB"); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSaveStatus("saving");
    try {
      const { collection, query, where, getDocs, updateDoc } = await import("firebase/firestore");
      const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
      const snap = await getDocs(q);

      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
          profileImage: avatar || null,
        });
      }

      setSaveStatus("saved");
      toast.success("Profile updated!");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      toast.error("Failed to save profile");
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.newPw || !passwords.confirm) {
      toast.error("Please fill in all password fields"); return;
    }
    if (passwords.newPw !== passwords.confirm) {
      toast.error("Passwords do not match"); return;
    }
    if (passwords.newPw.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) return;

    setUpdatingPw(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwords.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwords.newPw);
      toast.success("Password updated successfully!");
      setPasswords({ current: "", newPw: "", confirm: "" });
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setUpdatingPw(false);
    }
  };

  const initials = form.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  if (loading) {
    return (
      <div className="dash-shell">
        <Sidebar />
        <main className="dash-main profile-main">
          <div className="profile-loading">Loading profile…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main profile-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">ACCOUNT</p>
            <h1 className="dash-title">
              Profile <span className="dash-title-gold">Settings</span>
            </h1>
            <p className="dash-subtitle">Manage your admin account</p>
          </div>

          <button
            className={`save-btn ${saveStatus === "saving" ? "saving" : ""} ${saveStatus === "saved" ? "saved" : ""}`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" && <span className="btn-spinner" />}
            {saveStatus === "saved" && <CheckCircle size={16} />}
            {saveStatus === "idle" && <Save size={16} />}
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {saveStatus === "saved" && (
          <div className="save-banner">
            <CheckCircle size={16} /> Profile updated successfully!
          </div>
        )}

        <div className="profile-grid">
          {/* Avatar Card */}
          <div className="profile-card avatar-card">
            <div className="avatar-glow-wrap">
              <div className="avatar-ring">
                {avatar
                  ? <img src={avatar} alt="avatar" className="profile-avatar-img" />
                  : <div className="profile-avatar-initials">{initials}</div>
                }
              </div>
              <button className="avatar-change-btn" onClick={() => fileRef.current?.click()}>
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>

            <h2 className="avatar-name">{form.fullName || "—"}</h2>
            <span className="avatar-role-badge">
              <Shield size={11} /> {form.role || "User"}
            </span>
            <p className="avatar-email">{form.email}</p>
          </div>

          {/* Right: Form Cards */}
          <div className="profile-right">
            {/* Personal Info */}
            <div className="profile-card info-card">
              <div className="card-header">
                <User size={16} className="card-header-icon" />
                <h3>Personal Information</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={13} className="input-icon" />
                    <input name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="Your full name" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <Mail size={13} className="input-icon" />
                    <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrap">
                    <Phone size={13} className="input-icon" />
                    <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+265 ..." />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <div className="input-wrap">
                    <MapPin size={13} className="input-icon" />
                    <input name="location" value={form.location} onChange={handleFormChange} placeholder="City, Country" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleFormChange} rows={2} placeholder="Short bio…" />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="profile-card password-card">
              <div className="card-header">
                <Lock size={16} className="card-header-icon" />
                <h3>Change Password</h3>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Current Password</label>
                  <div className="input-wrap">
                    <Lock size={13} className="input-icon" />
                    <input
                      name="current"
                      type={showCurrentPw ? "text" : "password"}
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    <button className="pw-toggle" onClick={() => setShowCurrentPw(v => !v)}>
                      {showCurrentPw ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrap">
                    <Lock size={13} className="input-icon" />
                    <input
                      name="newPw"
                      type={showNewPw ? "text" : "password"}
                      value={passwords.newPw}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                    />
                    <button className="pw-toggle" onClick={() => setShowNewPw(v => !v)}>
                      {showNewPw ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrap">
                    <Lock size={13} className="input-icon" />
                    <input
                      name="confirm"
                      type={showConfirmPw ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                    <button className="pw-toggle" onClick={() => setShowConfirmPw(v => !v)}>
                      {showConfirmPw ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                {passwords.newPw && passwords.confirm && passwords.newPw !== passwords.confirm && (
                  <div className="pw-mismatch">
                    <AlertCircle size={13} /> Passwords do not match
                  </div>
                )}

                {passwords.newPw && (
                  <div className="pw-strength-wrap full-width">
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`pw-bar-seg ${passwords.newPw.length >= i * 3 ? "active" : ""}`} />
                      ))}
                    </div>
                    <span className="pw-strength-label">
                      {passwords.newPw.length < 4 ? "Weak" : passwords.newPw.length < 8 ? "Fair" : passwords.newPw.length < 12 ? "Strong" : "Very strong"}
                    </span>
                  </div>
                )}
              </div>

              <button className="update-pw-btn" onClick={handleUpdatePassword} disabled={updatingPw}>
                <Lock size={13} />
                {updatingPw ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}