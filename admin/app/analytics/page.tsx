"use client";

import Sidebar from "../../components/NavBar/Sidebar";
import "./analytics.css";

export default function AnalyticsPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Analytics Dashboard</h1>
        </div>

        <div className="content-card">
          <h2>Platform Performance</h2>
          <p>Coming soon with charts (Streams, Revenue, User Growth, etc.)</p>
          {/* You can add Recharts or Chart.js later */}
        </div>
      </div>
    </div>
  );
}