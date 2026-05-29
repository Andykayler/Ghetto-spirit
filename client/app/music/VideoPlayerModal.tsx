"use client";

import { useState, useEffect, useRef } from "react";
import type { Video } from "./FeaturedSongs";
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

// ─── Shared button styles ─────────────────────────────────────────────────────
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

// ─── VideoPlayerModal ─────────────────────────────────────────────────────────
export function VideoPlayerModal({
  video,
  allVideos,
  onClose,
  onExpand,
  onSelectVideo,
}: {
  video: Video;
  allVideos: Video[];
  onClose: () => void;
  onExpand: () => void;
  onSelectVideo: (v: Video) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCT] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  // Comments panel
  const [panelTab, setPanelTab] = useState<"up-next" | "comments">("up-next");
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [stats, setStats] = useState<VideoStats>({ views: 0, likes: 0, commentCount: 0 });
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [voteState, setVoteState] = useState<Record<string, "like" | "dislike" | undefined>>({});

  // Auto-play + record view on open
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

  // Subscribe to stats
  useEffect(() => {
    const unsub = subscribeToVideoStats(video.id, setStats);
    return unsub;
  }, [video.id]);

  // Subscribe to comments
  useEffect(() => {
    const unsub = subscribeToVideoComments(video.id, setComments);
    return unsub;
  }, [video.id]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

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

  const handleLike = async () => {
    try {
      const next = await toggleVideoLikeInDb(video.id, liked);
      setLiked(next);
    } catch { /* silent */ }
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
    } finally {
      setPostingComment(false);
    }
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
      setReplyText("");
      setReplyingTo(null);
    } catch { /* silent */ }
    finally { setPostingReply(false); }
  };

  const handleVoteReply = async (
    commentId: string,
    replyId: string,
    vote: "like" | "dislike"
  ) => {
    const key = `${commentId}:${replyId}`;
    const prev = voteState[key];
    try {
      const next = await voteVideoReplyInDb(video.id, commentId, replyId, prev, vote);
      setVoteState((s) => ({ ...s, [key]: next }));
    } catch { /* silent */ }
  };

  const others = allVideos.filter((v) => v.id !== video.id).slice(0, 5);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9000 }} />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9001,
          width: "min(920px, 96vw)",
          maxHeight: "90vh",
          background: "#111",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#fff", letterSpacing: "0.06em" }}>
              {video.title}
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
              {video.artist}
              {video.genre && (
                <span style={{ marginLeft: 8, color: "#D4AF37", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {video.genre}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Like */}
            <button
              onClick={handleLike}
              style={{
                ...iconBtnStyle,
                color: liked ? "#D4AF37" : "rgba(255,255,255,0.6)",
                border: liked ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.1)",
              }}
              title="Like"
            >
              ♥ {stats.likes > 0 && <span style={{ marginLeft: 4, fontSize: 11 }}>{stats.likes}</span>}
            </button>
            <button onClick={onExpand} title="Expand player" style={iconBtnStyle}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
            <button onClick={onClose} style={iconBtnStyle} title="Close">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {/* Video */}
          <div style={{ flex: 1, background: "#000", position: "relative" }}>
            <video
              ref={videoRef}
              src={video.videoUrl}
              style={{ width: "100%", display: "block", maxHeight: "420px", objectFit: "contain" }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              onEnded={() => setPlaying(false)}
              onClick={togglePlay}
            />

            {/* Controls overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px 16px 12px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
              }}
            >
              {/* Progress */}
              <div
                onClick={handleSeek}
                style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, cursor: "pointer", marginBottom: 10 }}
              >
                <div style={{ height: "100%", width: `${progress}%`, background: "#D4AF37", borderRadius: 2, transition: "width 0.1s linear" }} />
              </div>

              {/* Buttons row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={togglePlay}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "#D4AF37", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  {playing ? (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  ) : (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => setMuted((m) => !m)} style={{ ...iconBtnStyle, padding: 4 }}>{muted ? "🔇" : "🔊"}</button>
                <input
                  type="range" min={0} max={100} value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                  style={{ width: 70, accentColor: "#D4AF37" }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 240, borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            {/* Sidebar tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              {(["up-next", "comments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPanelTab(tab)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    background: "none",
                    border: "none",
                    borderBottom: panelTab === tab ? "2px solid #D4AF37" : "2px solid transparent",
                    color: panelTab === tab ? "#D4AF37" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {tab === "comments" ? `Comments (${stats.commentCount})` : "Up Next"}
                </button>
              ))}
            </div>

            {/* Up Next */}
            {panelTab === "up-next" && (
              <div style={{ overflowY: "auto", flex: 1 }}>
                {others.length === 0 && (
                  <div style={{ padding: 16, color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>No other videos</div>
                )}
                {others.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => onSelectVideo(v)}
                    style={{ display: "flex", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
                  >
                    <img src={v.coverUrl} alt={v.title} style={{ width: 56, height: 36, objectFit: "cover", borderRadius: 3, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: "#fff", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {v.title}
                      </div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                        {v.artist}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comments */}
            {panelTab === "comments" && (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                {/* Comment input */}
                <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name (optional)"
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 8px", color: "#fff", fontSize: 11, marginBottom: 6, boxSizing: "border-box", outline: "none" }}
                  />
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 8px", color: "#fff", fontSize: 11, resize: "none", boxSizing: "border-box", outline: "none" }}
                  />
                  {commentError && <div style={{ color: "#ff6666", fontSize: 10, marginTop: 4 }}>{commentError}</div>}
                  <button
                    onClick={handlePostComment}
                    disabled={postingComment || !commentText.trim()}
                    style={{ marginTop: 6, width: "100%", padding: "6px 0", background: commentText.trim() ? "#D4AF37" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, color: commentText.trim() ? "#000" : "rgba(255,255,255,0.3)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", cursor: commentText.trim() ? "pointer" : "default", transition: "background 0.2s" }}
                  >
                    {postingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>

                {/* Comment list */}
                <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
                  {comments.length === 0 && (
                    <div style={{ padding: 16, color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center" }}>No comments yet. Be the first!</div>
                  )}
                  {comments.map((c) => (
                    <div key={c.id} style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: "#D4AF37" }}>{c.author}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{timeAgo(c.timestamp)}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 5 }}>{c.text}</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <button onClick={() => handleVoteComment(c.id, "like")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[c.id] === "like" ? "#D4AF37" : "rgba(255,255,255,0.35)", fontSize: 11, padding: 0 }}>
                          ▲ {c.likes}
                        </button>
                        <button onClick={() => handleVoteComment(c.id, "dislike")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[c.id] === "dislike" ? "#ff6666" : "rgba(255,255,255,0.35)", fontSize: 11, padding: 0 }}>
                          ▼ {c.dislikes}
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 10, padding: 0 }}
                        >
                          Reply
                        </button>
                        {c.replies.length > 0 && (
                          <button
                            onClick={() => setExpandedReplies((s) => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#D4AF37", fontSize: 10, padding: 0 }}
                          >
                            {expandedReplies.has(c.id) ? "Hide" : `${c.replies.length} repl${c.replies.length === 1 ? "y" : "ies"}`}
                          </button>
                        )}
                      </div>

                      {/* Reply input */}
                      {replyingTo === c.id && (
                        <div style={{ marginTop: 8, paddingLeft: 10, borderLeft: "2px solid rgba(212,175,55,0.3)" }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            rows={2}
                            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 6px", color: "#fff", fontSize: 10, resize: "none", boxSizing: "border-box", outline: "none" }}
                          />
                          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                            <button
                              onClick={() => handlePostReply(c.id)}
                              disabled={postingReply || !replyText.trim()}
                              style={{ flex: 1, padding: "4px 0", background: replyText.trim() ? "#D4AF37" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, color: replyText.trim() ? "#000" : "rgba(255,255,255,0.3)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, cursor: replyText.trim() ? "pointer" : "default" }}
                            >
                              {postingReply ? "..." : "Reply"}
                            </button>
                            <button onClick={() => { setReplyingTo(null); setReplyText(""); }} style={{ padding: "4px 8px", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {expandedReplies.has(c.id) && c.replies.map((r) => (
                        <div key={r.id} style={{ marginTop: 6, paddingLeft: 12, borderLeft: "2px solid rgba(212,175,55,0.2)" }}>
                          <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 10, color: "#D4AF37" }}>{r.author}</span>
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{timeAgo(r.timestamp)}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{r.text}</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => handleVoteReply(c.id, r.id, "like")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[`${c.id}:${r.id}`] === "like" ? "#D4AF37" : "rgba(255,255,255,0.3)", fontSize: 10, padding: 0 }}>
                              ▲ {r.likes}
                            </button>
                            <button onClick={() => handleVoteReply(c.id, r.id, "dislike")} style={{ background: "none", border: "none", cursor: "pointer", color: voteState[`${c.id}:${r.id}`] === "dislike" ? "#ff6666" : "rgba(255,255,255,0.3)", fontSize: 10, padding: 0 }}>
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
    </>
  );
}
