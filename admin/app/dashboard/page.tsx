"use client";

import Sidebar from "../../components/NavBar/Sidebar";
import RecentActivity from "../../components/Actions/RecentActivity";
import QuickActions from "../../components/Actions/QuickActions";
import Link from "next/link";
import "./style.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        {/* Welcome Section with Quick Link */}
        <div className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>Good Evening, Admin</h1>
              <p>Welcome back to your empire. Everything is running smoothly.</p>
            </div>
            <Link href="/artists">
              <button className="manage-artists-btn">
                Manage Artists
              </button>
            </Link>
          </div>
        </div>

        {/* Main Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">24,892</p>
            <p className="stat-change positive">↑ 12.4% this month</p>
          </div>

          <div className="stat-card">
            <h3>Total Artists</h3>
            <p className="stat-number">184</p>
            <p className="stat-change positive">↑ 8 this week</p>
          </div>

          <div className="stat-card">
            <h3>Total Songs</h3>
            <p className="stat-number">3,284</p>
            <p className="stat-change positive">↑ 142 this month</p>
          </div>

          <div className="stat-card">
            <h3>Total Downloads</h3>
            <p className="stat-number">892.4K</p>
            <p className="stat-change positive">↑ 18.7% this month</p>
          </div>

          <div className="stat-card">
            <h3>Total Streams</h3>
            <p className="stat-number">1.4M</p>
            <p className="stat-change positive">↑ 23% this month</p>
          </div>

          <div className="stat-card">
            <h3>Monthly Revenue</h3>
            <p className="stat-number">$48.2K</p>
            <p className="stat-change positive">↑ 15.3% this month</p>
          </div>
        </div>

        {/* Most Streamed Songs & Recent Uploads */}
        <div className="overview-grid">
          {/* Most Streamed Songs */}
          <div className="content-card">
            <div className="card-header">
              <h2>Most Streamed Songs</h2>
              <Link href="/music" className="view-all-link">View All →</Link>
            </div>
            <div className="song-list">
              <div className="song-item">
                <span className="song-rank">1</span>
                <div className="song-info">
                  <p className="song-title">Night in the Ghetto</p>
                  <p className="song-artist">Lil Zulu • 2.3M streams</p>
                </div>
              </div>
              <div className="song-item">
                <span className="song-rank">2</span>
                <div className="song-info">
                  <p className="song-title">Street Prayer</p>
                  <p className="song-artist">Mama Africa • 1.9M streams</p>
                </div>
              </div>
              <div className="song-item">
                <span className="song-rank">3</span>
                <div className="song-info">
                  <p className="song-title">Hustle Season</p>
                  <p className="song-artist">Trap King • 1.6M streams</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Uploads</h2>
              <Link href="/music" className="view-all-link">View All →</Link>
            </div>
            <div className="song-list">
              <div className="song-item">
                <div className="song-info">
                  <p className="song-title">New Flame</p>
                  <p className="song-artist">FireBoy • 2 hours ago</p>
                </div>
                <span className="upload-status new">New</span>
              </div>
              <div className="song-item">
                <div className="song-info">
                  <p className="song-title">Ghetto Love</p>
                  <p className="song-artist">Queen V • Yesterday</p>
                </div>
              </div>
              <div className="song-item">
                <div className="song-info">
                  <p className="song-title">Road to Success</p>
                  <p className="song-artist">Young Lion • 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}