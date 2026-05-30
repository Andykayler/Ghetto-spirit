"use client";

import { useState, useEffect, useRef } from "react";
import type { Video } from "./FeaturedVideos";
import {
  subscribeToVideoComments,
  subscribeToVideoStats,
  addVideoCommentToDb,
  voteVideoCommentInDb,
  addVideoReplyToDb,
  voteVideoReplyInDb,
  recordVideoView,
  toggleVideoLikeInDb,
  type VideoComment,
  type VideoStats,
} from "./videoService";

// ─── Shared styles ────────────────────────────────────────────────────────────
const iconBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "rgba(255,255,255,0.6)",
  cursor: "pointer",
  padding: 7,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s, color 0.2s",
};

const ctrlBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.55)",
  cursor: "pointer",
  padding: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  transition: "color 0.2s",
};

function fmt(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── VideoQueueRow ─────────────────────────────────────────────────────────────
function VideoQueueRow({ video, isCurrent, onClick }: { video: Video; isCurrent: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        cursor: "pointer",
        background: isCurrent ? "rgba(212,175,55,0.08)" : "transparent",
        borderLeft: isCurrent ? "2px solid #D4AF37" : "2px solid transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img src={video.coverUrl} alt={video.title} style={{ width: 68, height: 42, objectFit: "cover", borderRadius: 3, opacity: isCurrent ? 1 : 0.65 }} />
        {isCurrent && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 3, background: "#D4AF37", borderRadius: 1, animation: `barBounce${i} 0.8s ease infinite`, animationDelay: `${i * 0.15}s`, height: "60%" }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: isCurrent ? "#D4AF37" : "#fff", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {video.title}
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{video.artist}</div>
      </div>
      {video.genre && (
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: "0.12em", color: "#D4AF37", textTransform: "uppercase", flexShrink: 0 }}>
          {video.genre}
        </div>
      )}
    </div>
  );
}

// ─── ExpandedVideoPlayer ──────────────────────────────────────────────────────
export function ExpandedVideoPlayer({
  video,
  allVideos,
  onClose,
  onCollapse,
  onSelectVideo,
}: {
  video: Video;
  allVideos: Video[];
  onClose: () => void;
  onCollapse: () => void;
  onSelectVideo: (v: Video) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCT] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  // Right panel tabs: queue | artist | comments
  const [activeTab, setActiveTab] = useState<"queue" | "artist" | "comments">("queue");

  // Video stats + like
  const [stats, setStats] = useState<VideoStats>({ views: 0, likes: 0, commentCount: 0 });
  const [liked, setLiked] = useState(false);

  // Comments
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [voteState, setVoteState] = useState<Record<string, "like" | "dislike" | undefined>>({});

  // Auto-play + record view
  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCT(0);
    setDuration(0);
    const timer = setTimeout(() => {
      videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }, 100);
    recordVideoView(video.id).catch(() => {});
    return () => clearTimeout(timer);
  }, [video.id]);

  // Subscribe stats
  useEffect(() => {
    const unsub = subscribeToVideoStats(video.id, setStats);
    return unsub;
  }, [video.id]);

  // Subscribe comments
  useEffect(() => {
    const unsub = subscribeToVideoComments(video.id, setComments);
    return unsub;
  }, [video.id]);

  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume / 100; }, [volume]);
  useEffect(() => { if (videoRef.current) videoRef.current.muted = muted; }, [muted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const d = videoRef.current.duration || 0;
    const c = videoRef.current.currentTime;
    setCT(c); setDuration(d);
    setProgress(d ? (c / d) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const skipForward = () => { if (videoRef.current) videoRef.current.currentTime = Math.min(duration, currentTime + 10); };
  const skipBack = () => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10); };

  const handleLike = async () => {
    try { const next = await toggleVideoLikeInDb(video.id, liked); setLiked(next); } catch { /* silent */ }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    setCommentError("");
    try {
      await addVideoCommentToDb(video.id, authorName || "Anonymous", commentText);
      setCommentText("");
    } catch (e: any) {
      setCommentError(e.message ?? "Failed to post comment.");
    } finally { setPostingComment(false); }
  };

  const handleVoteComment = async (commentId: string, vote: "like" | "dislike") => {
    const prev = voteState[commentId];
    try {
      const next = await voteVideoCommentInDb(video.id, commentId, prev, vote);
      setVoteState((s) => ({ ...s, [commentId]: next }));
    } catch { /* silent */ }
  };

  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setPostingReply(true);
    try {
      await addVideoReplyToDb(video.id, commentId, authorName || "Anonymous", replyText);
      setReplyText(""); setReplyingTo(null);
    } catch { /* silent */ }
    finally { setPostingReply(false); }
  };

  const handleVoteReply = async (commentId: string, replyId: string, vote: "like" | "dislike") => {
    const key = `${commentId}:${replyId}`;
    const prev = voteState[key];
    try {
      const next = await voteVideoReplyInDb(video.id, commentId, replyId, prev, vote);
      setVoteState((s) => ({ ...s, [key]: next }));
    } catch { /* silent */ }
  };

  const artistVideos = allVideos.filter((v) => v.artist === video.artist);
  const upNext = allVideos.find((v) => v.id !== video.id);

  const TABS: { key: "queue" | "artist" | "comments"; label: string }[] = [
    { key: "queue", label: `All Videos (${allVideos.length})` },
    { key: "artist", label: `${video.artist} (${artistVideos.length})` },
    { key: "comments", label: `Comments (${stats.commentCount})` },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9100 }} />

      <div
        style={{ position: "fixed", inset: 0, zIndex: 9101, background: "#0D0D0D", display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onCollapse} style={iconBtnStyle} title="Collapse">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="10" y1="14" x2="3" y2="21" />
                <line x1="21" y1="3" x2="14" y2="10" />
              </svg>
            </button>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", letterSpacing: "0.06em" }}>{video.title}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {video.artist}
                {video.genre && (
                  <span style={{ marginLeft: 8, color: "#D4AF37", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{video.genre}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Stats display */}
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginRight: 8 }}>
              {stats.views.toLocaleString()} views
            </div>
            {/* Like button */}
            <button
              onClick={handleLike}
              style={{
                ...iconBtnStyle,
                color: liked ? "#D4AF37" : "rgba(255,255,255,0.6)",
                border: liked ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.1)",
                gap: 5,
              }}
            >
              ♥ {stats.likes > 0 && <span style={{ fontSize: 11 }}>{stats.likes}</span>}
            </button>
            <button onClick={onClose} style={iconBtnStyle} title="Close">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>

          {/* LEFT: Video + controls */}
          <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.07)", background: "#000" }}>
            <div style={{ flex: 1, position: "relative", minHeight: 0, cursor: "pointer" }} onClick={togglePlay}>
              <video
                ref={videoRef}
                src={video.videoUrl}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,175,55,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              )}
            </div>

            {/* Controls bar */}
            <div style={{ padding: "14px 24px 18px", background: "#0D0D0D", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              {/* Progress */}
              <div onClick={handleSeek} style={{ height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 3, cursor: "pointer", marginBottom: 12, position: "relative" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#D4AF37", borderRadius: 3, transition: "width 0.1s linear" }} />
                <div style={{ position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%, -50%)", width: 12, height: 12, borderRadius: "50%", background: "#D4AF37", border: "2px solid #0D0D0D", pointerEvents: "none" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={skipBack} style={ctrlBtnStyle} title="-10s">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    <text x="9" y="15" fontSize="6" fill="currentColor" fontFamily="sans-serif">10</text>
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #a88020)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {playing ? (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  ) : (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>

                <button onClick={skipForward} style={ctrlBtnStyle} title="+10s">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                    <text x="9" y="15" fontSize="6" fill="currentColor" fontFamily="sans-serif">10</text>
                  </svg>
                </button>

                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", marginLeft: 4 }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => setMuted((m) => !m)} style={{ ...ctrlBtnStyle, fontSize: 16 }}>
                  {muted ? "🔇" : volume > 50 ? "🔊" : "🔉"}
                </button>
                <input
                  type="range" min={0} max={100} value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                  style={{ width: 80, accentColor: "#D4AF37" }}
                />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", minWidth: 30 }}>
                  {muted ? 0 : volume}%
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
            {/* Tab header */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: "14px 4px",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.key ? "2px solid #D4AF37" : "2px solid transparent",
                    color: activeTab === tab.key ? "#D4AF37" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* ── Queue & Artist tabs ── */}
              {(activeTab === "queue" || activeTab === "artist") && (
                <>
                  {activeTab === "queue" && upNext && (
                    <div style={{ padding: "14px 20px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>
                        Up Next
                      </div>
                      <VideoQueueRow video={upNext} isCurrent={false} onClick={() => onSelectVideo(upNext)} />
                    </div>
                  )}
                  {(activeTab === "queue" ? allVideos : artistVideos).map((v) => (
                    <VideoQueueRow key={v.id} video={v} isCurrent={v.id === video.id} onClick={() => onSelectVideo(v)} />
                  ))}
                </>
              )}

              {/* ── Comments tab ── */}
              {activeTab === "comments" && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Comment input */}
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>
                      Leave a Comment
                    </div>
                    <input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name (optional)"
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "7px 10px", color: "#fff", fontSize: 12, marginBottom: 8, boxSizing: "border-box", outline: "none" }}
                    />
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "7px 10px", color: "#fff", fontSize: 12, resize: "none", boxSizing: "border-box", outline: "none" }}
                    />
                    {commentError && <div style={{ color: "#ff6666", fontSize: 11, marginTop: 4 }}>{commentError}</div>}
                    <button
                      onClick={handlePostComment}
                      disabled={postingComment || !commentText.trim()}
                      style={{ marginTop: 8, width: "100%", padding: "8px 0", background: commentText.trim() ? "#D4AF37" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 5, color: commentText.trim() ? "#000" : "rgba(255,255,255,0.25)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", cursor: commentText.trim() ? "pointer" : "default", transition: "background 0.2s, color 0.2s" }}
                    >
                      {postingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>

                  {/* Comment list */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {comments.length === 0 && (
                      <div style={{ padding: 24, color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center" }}>No comments yet. Be the first!</div>
                    )}
                    {comments.map((c) => (
                      <div key={c.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: "#D4AF37" }}>{c.author}</span>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{timeAgo(c.timestamp)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, marginBottom: 8 }}>{c.text}</div>
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <button onClick={() => handleVoteComment(c.id, "like")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[c.id] === "like" ? "#D4AF37" : "rgba(255,255,255,0.35)", fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            ▲ {c.likes}
                          </button>
                          <button onClick={() => handleVoteComment(c.id, "dislike")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[c.id] === "dislike" ? "#ff6666" : "rgba(255,255,255,0.35)", fontSize: 12, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            ▼ {c.dislikes}
                          </button>
                          <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 11, padding: 0 }}>
                            Reply
                          </button>
                          {c.replies.length > 0 && (
                            <button
                              onClick={() => setExpandedReplies((s) => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#D4AF37", fontSize: 11, padding: 0 }}
                            >
                              {expandedReplies.has(c.id) ? "Hide replies" : `${c.replies.length} repl${c.replies.length === 1 ? "y" : "ies"}`}
                            </button>
                          )}
                        </div>

                        {/* Reply input */}
                        {replyingTo === c.id && (
                          <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: "2px solid rgba(212,175,55,0.3)" }}>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              rows={2}
                              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "6px 8px", color: "#fff", fontSize: 12, resize: "none", boxSizing: "border-box", outline: "none" }}
                            />
                            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                              <button
                                onClick={() => handlePostReply(c.id)}
                                disabled={postingReply || !replyText.trim()}
                                style={{ flex: 1, padding: "5px 0", background: replyText.trim() ? "#D4AF37" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 4, color: replyText.trim() ? "#000" : "rgba(255,255,255,0.25)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, cursor: replyText.trim() ? "pointer" : "default" }}
                              >
                                {postingReply ? "..." : "Reply"}
                              </button>
                              <button onClick={() => { setReplyingTo(null); setReplyText(""); }} style={{ padding: "5px 12px", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {expandedReplies.has(c.id) && c.replies.map((r) => (
                          <div key={r.id} style={{ marginTop: 8, paddingLeft: 16, borderLeft: "2px solid rgba(212,175,55,0.18)" }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: "#D4AF37" }}>{r.author}</span>
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{timeAgo(r.timestamp)}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 5, lineHeight: 1.5 }}>{r.text}</div>
                            <div style={{ display: "flex", gap: 12 }}>
                              <button onClick={() => handleVoteReply(c.id, r.id, "like")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[`${c.id}:${r.id}`] === "like" ? "#D4AF37" : "rgba(255,255,255,0.3)", fontSize: 11, padding: 0 }}>
                                ▲ {r.likes}
                              </button>
                              <button onClick={() => handleVoteReply(c.id, r.id, "dislike")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[`${c.id}:${r.id}`] === "dislike" ? "#ff6666" : "rgba(255,255,255,0.3)", fontSize: 11, padding: 0 }}>
                                ▼ {r.dislikes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes barBounce0 { 0%,100%{height:40%} 50%{height:100%} }
        @keyframes barBounce1 { 0%,100%{height:80%} 50%{height:30%} }
        @keyframes barBounce2 { 0%,100%{height:55%} 50%{height:90%} }
      `}</style>
    </>
  );
}

// Re-export for convenience
export type { Video };
