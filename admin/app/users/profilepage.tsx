"use client";

import { useState, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  Camera, Save, User, Mail, Phone, MapPin,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield
} from "lucide-react";
import "./profile.css";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "Admin User",
    email: "admin@ghettospirit.com",
    phone: "+265 999 000 111",
    location: "Lilongwe, Malawi",
    role: "Super Admin",
    bio: "Managing the Ghetto Spirit platform — artists, music, and the culture.",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    await new Promise((r) => setTimeout(r, 1400));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const initials = form.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="profile-main">
        {/* Page Header */}
        <div className="profile-page-header">
          <div>
            <p className="profile-page-label">MY ACCOUNT</p>
            <h1 className="profile-page-title">Profile Settings</h1>
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

        {/* Save banner */}
        {saveStatus === "saved" && (
          <div className="save-banner">
            <CheckCircle size={16} />
            Profile updated successfully!
          </div>
        )}

        <div className="profile-grid">
          {/* ── Left: Avatar Card ── */}
          <div className="profile-card avatar-card">
            <div className="avatar-glow-wrap">
              <div className="avatar-ring">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-initials">{initials}</div>
                )}
              </div>
              <button className="avatar-change-btn" onClick={() => fileRef.current?.click()}>
                <Camera size={15} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>

            <h2 className="avatar-name">{form.fullName}</h2>
            <span className="avatar-role-badge">
              <Shield size={12} />
              {form.role}
            </span>
            <p className="avatar-email">{form.email}</p>

            <div className="avatar-stats">
              <div className="av-stat">
                <span>127</span>
                <label>Artists</label>
              </div>
              <div className="av-stat-divider" />
              <div className="av-stat">
                <span>3.4K</span>
                <label>Tracks</label>
              </div>
              <div className="av-stat-divider" />
              <div className="av-stat">
                <span>98%</span>
                <label>Uptime</label>
              </div>
            </div>
          </div>

          {/* ── Right: Form Cards ── */}
          <div className="profile-right">
            {/* Personal Info */}
            <div className="profile-card info-card">
              <div className="card-header">
                <User size={18} className="card-header-icon" />
                <h3>Personal Information</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={15} className="input-icon" />
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <Mail size={15} className="input-icon" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrap">
                    <Phone size={15} className="input-icon" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="+265 ..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <div className="input-wrap">
                    <MapPin size={15} className="input-icon" />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleFormChange}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Short bio…"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="profile-card password-card">
              <div className="card-header">
                <Lock size={18} className="card-header-icon" />
                <h3>Change Password</h3>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Current Password</label>
                  <div className="input-wrap">
                    <Lock size={15} className="input-icon" />
                    <input
                      name="current"
                      type={showCurrentPw ? "text" : "password"}
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    <button className="pw-toggle" onClick={() => setShowCurrentPw((v) => !v)}>
                      {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrap">
                    <Lock size={15} className="input-icon" />
                    <input
                      name="newPw"
                      type={showNewPw ? "text" : "password"}
                      value={passwords.newPw}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                    />
                    <button className="pw-toggle" onClick={() => setShowNewPw((v) => !v)}>
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrap">
                    <Lock size={15} className="input-icon" />
                    <input
                      name="confirm"
                      type={showConfirmPw ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                    <button className="pw-toggle" onClick={() => setShowConfirmPw((v) => !v)}>
                      {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {passwords.newPw && passwords.confirm && passwords.newPw !== passwords.confirm && (
                  <div className="pw-mismatch">
                    <AlertCircle size={14} /> Passwords do not match
                  </div>
                )}

                {/* Strength bar */}
                {passwords.newPw && (
                  <div className="pw-strength-wrap full-width">
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`pw-bar-seg ${passwords.newPw.length >= i * 3 ? "active" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="pw-strength-label">
                      {passwords.newPw.length < 4
                        ? "Weak"
                        : passwords.newPw.length < 8
                        ? "Fair"
                        : passwords.newPw.length < 12
                        ? "Strong"
                        : "Very strong"}
                    </span>
                  </div>
                )}
              </div>

              <button className="update-pw-btn">
                <Lock size={15} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}