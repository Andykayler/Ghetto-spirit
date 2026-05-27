
"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import {
  Users, Music, Play, Download,
  TrendingUp, Clock, ChevronRight, BarChart2
} from "lucide-react";
import "./style.css";

interface Song {
  id: string;
  title: string;
  artist: string;
  streams: number;
  downloads?: number;
  createdAt?: any;
}

export default function Dashboard() {
  const [totalArtists,   setTotalArtists]   = useState(0);
  const [totalSongs,     setTotalSongs]     = useState(0);
  const [totalStreams,   setTotalStreams]    = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [mostStreamed,   setMostStreamed]   = useState<Song[]>([]);
  const [recentUploads,  setRecentUploads]  = useState<Song[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [greeting,       setGreeting]       = useState("Good Day");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12)      setGreeting("Good Morning");
    else if (h < 18) setGreeting("Good Afternoon");
    else             setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const artistsCount = await getCountFromServer(collection(db, "artists"));
        setTotalArtists(artistsCount.data().count);

        const songsSnapshot = await getDocs(collection(db, "songs"));
        let songsCount = 0, streamsSum = 0, downloadsSum = 0;
        songsSnapshot.forEach((doc) => {
          const d = doc.data();
          songsCount++;
          streamsSum   += d.streams   || 0;
          downloadsSum += d.downloads || 0;
        });
        setTotalSongs(songsCount);
        setTotalStreams(streamsSum);
        setTotalDownloads(downloadsSum);

        const mostStreamedSnap = await getDocs(
          query(collection(db, "songs"), orderBy("streams", "desc"), limit(5))
        );
        setMostStreamed(mostStreamedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Song[]);

        const recentSnap = await getDocs(
          query(collection(db, "songs"), orderBy("createdAt", "desc"), limit(5))
        );
        setRecentUploads(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Song[]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return n.toLocaleString();
  };

  const timeAgo = (ts: any) => {
    if (!ts) return "Unknown";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60)    return "Just now";
    if (s < 3600)  return Math.floor(s / 60)   + "m ago";
    if (s < 86400) return Math.floor(s / 3600)  + "h ago";
    return Math.floor(s / 86400) + "d ago";
  };

  const statCards = [
    { label: "Total Artists",   value: totalArtists,   fmt: (v: number) => v.toLocaleString(), icon: <Users    size={20} />, accent: "#d4a017" },
    { label: "Total Songs",     value: totalSongs,     fmt: (v: number) => v.toLocaleString(), icon: <Music    size={20} />, accent: "#d4a017" },
    { label: "Total Streams",   value: totalStreams,   fmt,                                    icon: <Play     size={20} />, accent: "#d4a017" },
    { label: "Total Downloads", value: totalDownloads, fmt,                                    icon: <Download size={20} />, accent: "#d4a017" },
  ];

  return (
    <div className="dash-shell">
      <Sidebar />

      <main className="dash-main">

        {/* ── Header ── */}
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">OVERVIEW</p>
            <h1 className="dash-title">
              {greeting}, <span className="dash-title-gold">Admin</span>
            </h1>
            <p className="dash-subtitle">Welcome back to your empire.</p>
          </div>
          <div className="dash-header-badge">
            <BarChart2 size={16} />
            <span>Live Data</span>
            <span className="live-dot" />
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stat-grid">
          {statCards.map((card, i) => (
            <div className="stat-card" key={card.label} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="stat-card-top">
                <div className="stat-icon">{card.icon}</div>
                <span className="stat-label">{card.label}</span>
              </div>
              <div className="stat-value">
                {loading ? (
                  <span className="stat-skeleton" />
                ) : (
                  card.fmt(card.value)
                )}
              </div>
              <div className="stat-card-bar">
                <div className="stat-card-bar-fill" style={{ width: loading ? "0%" : "100%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Two Column Grid ── */}
        <div className="overview-grid">

          {/* Most Streamed */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-header-left">
                <TrendingUp size={16} className="card-header-icon" />
                <h2>Most Streamed</h2>
              </div>
              <Link href="/music" className="view-all-btn">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="song-list">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="song-skeleton" />)
              ) : mostStreamed.length > 0 ? (
                mostStreamed.map((song, idx) => (
                  <div key={song.id} className="song-row">
                    <div className="song-rank-wrap">
                      <span className="song-rank">{idx + 1}</span>
                    </div>
                    <div className="song-info">
                      <p className="song-title">{song.title}</p>
                      <p className="song-meta">{song.artist}</p>
                    </div>
                    <div className="song-streams-wrap">
                      <span className="song-streams">{fmt(song.streams)}</span>
                      <span className="song-streams-label">streams</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Music size={28} />
                  <p>No songs yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="content-card">
            <div className="card-header">
              <div className="card-header-left">
                <Clock size={16} className="card-header-icon" />
                <h2>Recent Uploads</h2>
              </div>
              <Link href="/music" className="view-all-btn">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="song-list">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="song-skeleton" />)
              ) : recentUploads.length > 0 ? (
                recentUploads.map((song) => (
                  <div key={song.id} className="song-row">
                    <div className="song-cover-placeholder">
                      <Music size={14} />
                    </div>
                    <div className="song-info">
                      <p className="song-title">{song.title}</p>
                      <p className="song-meta">{song.artist}</p>
                    </div>
                    <div className="song-right-col">
                      <span className="upload-time">{timeAgo(song.createdAt)}</span>
                      <span className="badge-new">New</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Music size={28} />
                  <p>No recent uploads</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
