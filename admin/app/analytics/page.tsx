"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getSongStreamStats, getArtistStreamStats } from "./streamstats";
import "./analytics.css";

interface GenreStat {
  genre: string;
  count: number;
  streams: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const [totalArtists, setTotalArtists] = useState(0);
  const [verifiedArtists, setVerifiedArtists] = useState(0);
  const [avgStreamsPerSong, setAvgStreamsPerSong] = useState(0);
  const [songsThisMonth, setSongsThisMonth] = useState(0);
  const [genreStats, setGenreStats] = useState<GenreStat[]>([]);
  const [topPerformingArtists, setTopPerformingArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // ── Artists: only need count + verified count from artists collection ──
        const artistsSnap = await getDocs(collection(db, "artists"));
        let verifiedCount = 0;
        artistsSnap.forEach((doc) => {
          if (doc.data().status === "verified") verifiedCount++;
        });
        setTotalArtists(artistsSnap.size);
        setVerifiedArtists(verifiedCount);

        // ── Songs metadata ──
        const songsSnap = await getDocs(collection(db, "songs"));

        // ── Real stream counts for all songs from `tracks` ──
        const songIds = songsSnap.docs.map((d) => d.id);
        const statsMap = songIds.length > 0
          ? await getSongStreamStats(songIds)
          : new Map();

        let totalStreams = 0;
        let thisMonthCount = 0;
        const genreMap = new Map<string, { count: number; streams: number }>();
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        songsSnap.forEach((doc) => {
          const data = doc.data();
          const streams = statsMap.get(doc.id)?.streams ?? 0;
          totalStreams += streams;

          // Genre accumulation with real stream counts
          const genre = data.genre || "Unknown";
          if (!genreMap.has(genre)) genreMap.set(genre, { count: 0, streams: 0 });
          const g = genreMap.get(genre)!;
          g.count++;
          g.streams += streams;

          // Upload date (lives on songs, fine to read here)
          if (data.createdAt) {
            const songDate = data.createdAt.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt);
            if (songDate >= firstDayThisMonth) thisMonthCount++;
          }
        });

        setAvgStreamsPerSong(
          songsSnap.size > 0 ? Math.floor(totalStreams / songsSnap.size) : 0
        );
        setSongsThisMonth(thisMonthCount);

        // ── Genre stats ──
        const totalSongs = songsSnap.size;
        const genresArray: GenreStat[] = Array.from(genreMap.entries())
          .map(([genre, stats]) => ({
            genre,
            count: stats.count,
            streams: stats.streams,
            percentage:
              totalSongs > 0 ? Math.round((stats.count / totalSongs) * 100) : 0,
          }))
          .sort((a, b) => b.streams - a.streams)
          .slice(0, 8);
        setGenreStats(genresArray);

        // ── Top performing artists via service function ──
        const topArtists = await getArtistStreamStats(6);
        setTopPerformingArtists(topArtists);

      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">

        {/* Header */}
        <div className="page-header">
          <h1>Deep Analytics</h1>
          <p className="page-subtitle">Platform insights & performance trends</p>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Verified Artists</h3>
            <p className="stat-number">{loading ? "—" : verifiedArtists}</p>
            <p className="stat-sub">of {totalArtists} total artists</p>
          </div>
          <div className="stat-card">
            <h3>Avg Streams / Song</h3>
            <p className="stat-number">
              {loading ? "—" : formatNumber(avgStreamsPerSong)}
            </p>
            <p className="stat-sub">across all songs</p>
          </div>
          <div className="stat-card">
            <h3>Songs This Month</h3>
            <p className="stat-number">{loading ? "—" : songsThisMonth}</p>
            <p className="stat-sub">new uploads</p>
          </div>
        </div>

        {/* Genre + Top Artists — side by side grid */}
        <div className="analytics-grid">

          {/* Genre Distribution */}
          <div className="content-card">
            <div className="card-header">
              <h2>Genre Distribution</h2>
            </div>
            <div className="genre-grid">
              {loading ? (
                <p className="empty-text">Loading genres...</p>
              ) : genreStats.length > 0 ? (
                genreStats.map((g, i) => (
                  <div key={i} className="genre-bar">
                    <div className="genre-info">
                      <span className="genre-name">{g.genre}</span>
                      <span className="genre-perc">{g.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${g.percentage}%` }}
                      />
                    </div>
                    <p className="genre-streams">
                      {formatNumber(g.streams)} streams
                    </p>
                  </div>
                ))
              ) : (
                <p className="empty-text">No genre data available yet.</p>
              )}
            </div>
          </div>

          {/* Top Performing Artists */}
          <div className="content-card">
            <div className="card-header">
              <h2>Top Artists</h2>
            </div>
            <div className="list-container">
              {loading ? (
                <p className="empty-text">Loading...</p>
              ) : topPerformingArtists.length > 0 ? (
                topPerformingArtists.map((artist, i) => (
                  <div key={i} className="list-item">
                    <span className="rank">{i + 1}</span>
                    <div className="item-info">
                      <p className="item-title">{artist.name}</p>
                      <p className="item-subtitle">{artist.songs} songs</p>
                    </div>
                    <p className="streams">{formatNumber(artist.streams)}</p>
                  </div>
                ))
              ) : (
                <p className="empty-text">No artist data yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}