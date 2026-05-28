"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Save, Globe, Shield, Settings2 } from "lucide-react";
import "./settings.css";

export default function Settings() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [settings, setSettings] = useState({
    platformName: "Ghetto Spirit",
    tagline: "Where Raw Talent Meets the Streets",
    email: "admin@ghettospirit.com",
    artistApproval: true,
    allowUserUploads: true,
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleToggle = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    await new Promise(r => setTimeout(r, 1200));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">CONFIGURATION</p>
            <h1 className="dash-title">
              Platform <span className="dash-title-gold">Settings</span>
            </h1>
            <p className="dash-subtitle">Manage your platform configuration</p>
          </div>

          <button
            className={`save-btn ${saveStatus === "saving" ? "saving" : ""} ${saveStatus === "saved" ? "saved" : ""}`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" && <span className="btn-spinner" />}
            {saveStatus === "saved"  && <Save size={15} />}
            {saveStatus === "idle"   && <Save size={15} />}
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Banner */}
        {saveStatus === "saved" && (
          <div className="save-banner">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Two-column grid */}
        <div className="settings-grid">

          {/* LEFT — Platform Info */}
          <div className="s-card">
            <div className="s-card-header">
              <Globe size={15} className="s-card-icon" />
              <h3>Platform Information</h3>
            </div>

            <div className="s-fields">
              <div className="s-field">
                <label>Platform Name</label>
                <div className="s-input-wrap">
                  <Settings2 size={13} className="s-input-icon" />
                  <input
                    type="text"
                    name="platformName"
                    value={settings.platformName}
                    onChange={handleChange}
                    placeholder="Platform name"
                  />
                </div>
              </div>

              <div className="s-field">
                <label>Tagline</label>
                <div className="s-input-wrap">
                  <Settings2 size={13} className="s-input-icon" />
                  <input
                    type="text"
                    name="tagline"
                    value={settings.tagline}
                    onChange={handleChange}
                    placeholder="Platform tagline"
                  />
                </div>
              </div>

              <div className="s-field">
                <label>Admin Email</label>
                <div className="s-input-wrap">
                  <Settings2 size={13} className="s-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Moderation */}
          <div className="s-card">
            <div className="s-card-header">
              <Shield size={15} className="s-card-icon" />
              <h3>Content & Moderation</h3>
            </div>

            <div className="s-toggles">

              <div className="s-toggle-row">
                <div className="s-toggle-info">
                  <p className="s-toggle-label">Artist Approval</p>
                  <p className="s-toggle-desc">Require approval before artists go live</p>
                </div>
                <button
                  className={`s-toggle ${settings.artistApproval ? "on" : ""}`}
                  onClick={() => handleToggle("artistApproval")}
                >
                  <span className="s-knob" />
                </button>
              </div>

              <div className="s-toggle-row">
                <div className="s-toggle-info">
                  <p className="s-toggle-label">User Uploads</p>
                  <p className="s-toggle-desc">Allow users to upload songs</p>
                </div>
                <button
                  className={`s-toggle ${settings.allowUserUploads ? "on" : ""}`}
                  onClick={() => handleToggle("allowUserUploads")}
                >
                  <span className="s-knob" />
                </button>
              </div>

              <div className="s-toggle-row">
                <div className="s-toggle-info">
                  <p className={`s-toggle-label ${settings.maintenanceMode ? "danger-text" : ""}`}>
                    Maintenance Mode
                  </p>
                  <p className="s-toggle-desc">Take platform offline for users</p>
                </div>
                <button
                  className={`s-toggle ${settings.maintenanceMode ? "on danger" : ""}`}
                  onClick={() => handleToggle("maintenanceMode")}
                >
                  <span className="s-knob" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}