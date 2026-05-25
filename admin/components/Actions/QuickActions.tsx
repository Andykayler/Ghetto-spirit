"use client";

import "./style.css";

export default function QuickActions() {
  return (
    <div className="content-card">
      <h2>Quick Actions</h2>
      <div className="quick-actions">
        <button>Add New Artist</button>
        <button>Upload New Track</button>
        <button>Manage Users</button>
      </div>
    </div>
  );
}