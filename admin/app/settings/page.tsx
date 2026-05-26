"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Save } from "lucide-react";
import "./settings.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "Ghetto Spirit",
    tagline: "Where Raw Talent Meets the Streets",
    email: "admin@ghettospirit.com",
    artistApproval: true,
    allowUserUploads: true,
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-container">
          {/* Platform Information */}
          <div className="settings-card">
            <h2>Platform Information</h2>
            
            <div className="form-group">
              <label>Platform Name</label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Content & Moderation */}
          <div className="settings-card">
            <h2>Content & Moderation</h2>
            
            <div className="toggle-group">
              <label>
                <input
                  type="checkbox"
                  name="artistApproval"
                  checked={settings.artistApproval}
                  onChange={handleChange}
                />
                Require approval for new artists
              </label>
            </div>

            <div className="toggle-group">
              <label>
                <input
                  type="checkbox"
                  name="allowUserUploads"
                  checked={settings.allowUserUploads}
                  onChange={handleChange}
                />
                Allow users to upload songs
              </label>
            </div>

            <div className="toggle-group">
              <label>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
                Enable Maintenance Mode
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button className="save-btn" onClick={handleSave}>
              <Save size={20} />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}