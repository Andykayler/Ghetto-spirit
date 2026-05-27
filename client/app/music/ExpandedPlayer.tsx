"use client";

import { useState, useRef, useEffect } from "react";
import { usePlayer, parseDuration, formatTime } from "./PlayerContext";
import type { Track, Comment, CommentReply } from "./PlayerContext";

// ─── ExpandedPlayer ───────────────────────────────────────────────────────────
export function ExpandedPlayer() {
  const {
    currentTrack,
    playing,
    progress,
    volume,
    shuffle,
    repeat,
    expanded,
    togglePlay,
    seek,
    next,
    prev,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    setExpanded,
    play,
    artistTrackCount,
    artistTracks,
    queueIndex,
    queue,
    streamCounts,
    likes,
    toggleLike,
    comments,
    addComment,
    voteComment,
    addReply,
    voteReply,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<"queue" | "artist" | "comments">("queue");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 60 }, (_, i) => 10 + Math.sin(i * 0.5) * 22 + Math.random() * 18)
  );
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (waveRef.current) clearInterval(waveRef.current);
    if (!playing) return;
    waveRef.current = setInterval(() => {
      setWaveHeights(Array.from({ length: 60 }, () => 6 + Math.random() * 44));
    }, 90);
    return () => { if (waveRef.current) clearInterval(waveRef.current); };
  }, [playing]);

  if (!expanded || !currentTrack) return null;

  const totalSec = parseDuration(currentTrack.duration);
  const currentSec = Math.floor((progress / 100) * totalSec);
  const artistCount = artistTrackCount(currentTrack.artist);
  const artistSongs = artistTracks(currentTrack.artist);
  const upNext = queue[(queueIndex + 1) % queue.length];
  const coverSrc = currentTrack.coverUrl || currentTrack.thumbnail;
  const streams = streamCounts[currentTrack.id] || 0;
  const isLiked = likes[currentTrack.id] || false;
  const trackComments = comments.filter(c => c.trackId === currentTrack.id);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment(currentTrack.id, commentAuthor, commentText);
    setCommentText("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setExpanded(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(6px)",
          animation: "fadeIn 0.25s ease",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        height: "82vh",
        background: "#0E0E0E",
        borderTop: "1px solid rgba(212,175,55,0.3)",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div
            style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", cursor: "pointer" }}
            onClick={() => setExpanded(false)}
            title="Close player"
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 380px", overflow: "hidden" }}>

          {/* ── Left: Art + info + controls ── */}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Art */}
            <div style={{ position: "relative", width: "100%", maxWidth: 300, aspectRatio: "1", margin: "0 auto" }}>
              <img
                src={coverSrc}
                alt={currentTrack.title}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  border: "2px solid rgba(212,175,55,0.4)",
                  display: "block",
                  boxShadow: playing ? "0 0 40px rgba(212,175,55,0.25)" : "none",
                  transform: playing ? "scale(1.02)" : "scale(1)",
                  transition: "transform 0.5s ease, box-shadow 0.5s ease",
                }}
              />
              {playing && (
                <div style={{
                  position: "absolute", inset: -6,
                  border: "1px solid rgba(212,175,55,0.3)",
                  animation: "pulseRing 2s ease infinite",
                  pointerEvents: "none",
                }} />
              )}
            </div>

            {/* Song info + like */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 24, color: "#FFFFFF", letterSpacing: "0.05em", lineHeight: 1.1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {currentTrack.title}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 14,
                    color: "rgba(255,255,255,0.55)", marginTop: 4,
                  }}>
                    {currentTrack.artist}
                    {artistCount > 0 && (
                      <span style={{ color: "rgba(212,175,55,0.7)", marginLeft: 8, fontSize: 12 }}>
                        • {artistCount} track{artistCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Like button */}
                <button
                  onClick={() => toggleLike(currentTrack.id)}
                  title={isLiked ? "Unlike" : "Like"}
                  style={{
                    background: isLiked ? "rgba(212,175,55,0.15)" : "none",
                    border: isLiked ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: isLiked ? "#D4AF37" : "rgba(255,255,255,0.4)",
                    fontSize: 20,
                    padding: "4px 8px",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    transform: isLiked ? "scale(1.15)" : "scale(1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={e => { if (!isLiked) (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37"; }}
                  onMouseLeave={e => { if (!isLiked) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
                >
                  {isLiked ? "♥" : "♡"}
                </button>
              </div>

              {(currentTrack.genre || currentTrack.category) && (
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#D4AF37", border: "1px solid rgba(212,175,55,0.35)",
                  padding: "3px 8px", display: "inline-block", marginTop: 6,
                }}>
                  {currentTrack.genre || currentTrack.category}
                </span>
              )}

              {/* Stats row — plays + comments only, no minutes */}
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <StatBadge value={streams} label="Plays" />
                <StatBadge value={isLiked ? "♥" : "♡"} label="Liked" gold={isLiked} />
                <StatBadge value={trackComments.length} label="Comments" />
              </div>
            </div>

            {/* Waveform */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek(((e.clientX - rect.left) / rect.width) * 100);
              }}
              style={{ display: "flex", alignItems: "center", gap: 2, height: 52, cursor: "pointer" }}
            >
              {waveHeights.map((h, i) => {
                const barPct = (i / waveHeights.length) * 100;
                const isPast = barPct <= progress;
                return (
                  <div key={i} style={{
                    flex: 1, height: `${h}px`, maxHeight: 48, minHeight: 3,
                    background: isPast ? "#D4AF37" : "rgba(212,175,55,0.18)",
                    borderRadius: 2,
                    transition: playing ? "height 0.08s ease" : "none",
                  }} />
                );
              })}
            </div>

            {/* Seek bar + time — shows elapsed / total duration */}
            <div>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - rect.left) / rect.width) * 100);
                }}
                style={{
                  height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2,
                  cursor: "pointer", position: "relative", marginBottom: 8,
                }}
              >
                <div style={{
                  position: "absolute", left: 0, top: 0, height: "100%",
                  width: `${progress}%`, background: "#D4AF37", borderRadius: 2,
                  transition: playing ? "width 0.1s linear" : "none",
                }} />
                <div style={{
                  position: "absolute", top: "50%", left: `${progress}%`,
                  transform: "translate(-50%, -50%)",
                  width: 12, height: 12, borderRadius: "50%", background: "#D4AF37",
                  border: "2px solid #0E0E0E",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                  {formatTime(currentSec)}
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                  {currentTrack.duration || "--:--"}
                </span>
              </div>
            </div>

            {/* Transport controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
              <ControlBtn active={shuffle} onClick={toggleShuffle} title="Shuffle">
                <ShuffleIcon />
              </ControlBtn>
              <ControlBtn onClick={prev} title="Previous">
                <PrevIcon />
              </ControlBtn>
              <button
                onClick={togglePlay}
                title={playing ? "Pause" : "Play"}
                style={{
                  width: 58, height: 58, borderRadius: "50%",
                  background: "#D4AF37", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, transform 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#F0CB50";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#D4AF37";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                {playing
                  ? <div style={{ display: "flex", gap: 4 }}>
                      <div style={{ width: 4, height: 18, background: "#0A0A0A" }} />
                      <div style={{ width: 4, height: 18, background: "#0A0A0A" }} />
                    </div>
                  : <div style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: "18px solid #0A0A0A", marginLeft: 4 }} />
                }
              </button>
              <ControlBtn onClick={next} title="Next">
                <NextIcon />
              </ControlBtn>
              <ControlBtn active={repeat !== "off"} onClick={cycleRepeat} title={`Repeat: ${repeat}`}>
                {repeat === "one" ? <RepeatOneIcon /> : <RepeatIcon />}
              </ControlBtn>
            </div>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <VolumeIcon muted={volume === 0} />
              <input
                type="range" min={0} max={100} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#D4AF37", height: 3, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", minWidth: 28 }}>
                {volume}%
              </span>
            </div>

            {/* Platform links */}
            <div style={{ display: "flex", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <PlatformBtn label="Spotify" color="#1DB954" icon={<SpotifyIcon />} />
              <PlatformBtn label="Apple Music" color="#FC3C44" icon={<AppleIcon />} />
              <PlatformBtn label="YouTube" color="#FF0000" icon={<YoutubeIcon />} />
            </div>
          </div>

          {/* ── Center: Tabs + content ── */}
          <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              {(["queue", "artist", "comments"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "16px 0",
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                    fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                    background: "none", border: "none", cursor: "pointer",
                    color: activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.35)",
                    borderBottom: activeTab === tab ? "2px solid #D4AF37" : "2px solid transparent",
                    transition: "color 0.2s",
                  }}
                >
                  {tab === "queue"
                    ? `Queue (${queue.length})`
                    : tab === "artist"
                    ? `Artist (${artistCount})`
                    : `Comments (${trackComments.length})`}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: activeTab === "comments" ? 0 : "8px 0" }}>
              {activeTab === "queue" && (
                <QueueTab queue={queue} currentIndex={queueIndex} onPlay={play} />
              )}
              {activeTab === "artist" && (
                <ArtistTab
                  artist={currentTrack.artist}
                  tracks={artistSongs}
                  currentId={currentTrack.id}
                  onPlay={play}
                />
              )}
              {activeTab === "comments" && (
                <CommentsTab
                  comments={trackComments}
                  author={commentAuthor}
                  text={commentText}
                  onAuthorChange={setCommentAuthor}
                  onTextChange={setCommentText}
                  onSubmit={handleSubmitComment}
                  onVote={voteComment}
                  onReply={addReply}
                  onVoteReply={voteReply}
                />
              )}
            </div>
          </div>

          {/* ── Right: Up Next ── */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
              fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", flexShrink: 0,
            }}>
              Up Next
            </div>

            {upNext && upNext.id !== currentTrack.id && (
              <div
                onClick={() => play(upNext)}
                style={{ padding: "16px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "rgba(212,175,55,0.06)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={upNext.coverUrl || upNext.thumbnail}
                    alt={upNext.title}
                    style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(212,175,55,0.2)" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "#FFFFFF", letterSpacing: "0.05em", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {upNext.title}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>
                      {upNext.artist}
                    </div>
                    {(upNext.genre || upNext.category) && (
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#D4AF37", marginTop: 4, textTransform: "uppercase" }}>
                        {upNext.genre || upNext.category}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                    {upNext.duration}
                  </div>
                </div>
              </div>
            )}

            <div style={{
              padding: "12px 20px 8px",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
              fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}>
              More from {currentTrack.artist}
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {artistSongs
                .filter((t) => t.id !== currentTrack.id)
                .map((t) => (
                  <MiniTrackRow key={t.id} track={t} onPlay={() => play(t)} />
                ))}
              {artistSongs.filter((t) => t.id !== currentTrack.id).length === 0 && (
                <div style={{ padding: "12px 20px", fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
                  No other tracks from this artist.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes pulseRing { 0%,100% { opacity: 0.4; transform: scale(1) } 50% { opacity: 0.1; transform: scale(1.04) } }
      `}</style>
    </>
  );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────
function StatBadge({ value, label, gold = false }: { value: string | number; label: string; gold?: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)",
      borderRadius: 6, padding: "6px 14px", minWidth: 64,
    }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: gold ? "#D4AF37" : "#D4AF37", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 2 }}>
        {label}
      </span>
    </div>
  );
}

// ─── CommentsTab ──────────────────────────────────────────────────────────────
function CommentsTab({
  comments,
  author,
  text,
  onAuthorChange,
  onTextChange,
  onSubmit,
  onVote,
  onReply,
  onVoteReply,
}: {
  comments: Comment[];
  author: string;
  text: string;
  onAuthorChange: (v: string) => void;
  onTextChange: (v: string) => void;
  onSubmit: () => void;
  onVote: (commentId: string, vote: "like" | "dislike") => void;
  onReply: (commentId: string, author: string, text: string) => void;
  onVoteReply: (commentId: string, replyId: string, vote: "like" | "dislike") => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Comment input */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <input
          value={author}
          onChange={e => onAuthorChange(e.target.value)}
          placeholder="Your name (optional)"
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={text}
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
            placeholder="Add a comment…"
            rows={2}
            style={{ ...inputStyle, flex: 1, resize: "none" } as React.CSSProperties}
          />
          <button
            onClick={onSubmit}
            disabled={!text.trim()}
            style={postBtnStyle(!!text.trim())}
          >
            Post
          </button>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
          Press Enter to post
        </div>
      </div>

      {/* Comments list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {comments.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
              No comments yet. Be the first!
            </div>
          </div>
        ) : (
          comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              onVote={onVote}
              onReply={onReply}
              onVoteReply={onVoteReply}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── CommentItem ──────────────────────────────────────────────────────────────
function CommentItem({
  comment,
  onVote,
  onReply,
  onVoteReply,
}: {
  comment: Comment;
  onVote: (id: string, vote: "like" | "dislike") => void;
  onReply: (commentId: string, author: string, text: string) => void;
  onVoteReply: (commentId: string, replyId: string, vote: "like" | "dislike") => void;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyText, setReplyText] = useState("");

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyAuthor, replyText);
    setReplyText("");
    setShowReplyBox(false);
    setShowReplies(true);
  };

  const avatarColor = `hsl(${(comment.author.charCodeAt(0) * 7) % 360}, 50%, 35%)`;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ padding: "14px 20px 10px" }}>
        {/* Author row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: "#fff",
            flexShrink: 0,
          }}>
            {comment.author[0]?.toUpperCase() || "?"}
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", color: "#D4AF37" }}>
            {comment.author}
          </span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
            {new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Text */}
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.75)", margin: "0 0 10px 36px", lineHeight: 1.5,
        }}>
          {comment.text}
        </p>

        {/* Action row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 36 }}>
          {/* Like */}
          <VoteBtn
            icon="👍"
            count={comment.likes}
            active={comment.userVote === "like"}
            activeColor="#4ade80"
            onClick={() => onVote(comment.id, "like")}
          />
          {/* Dislike */}
          <VoteBtn
            icon="👎"
            count={comment.dislikes}
            active={comment.userVote === "dislike"}
            activeColor="#f87171"
            onClick={() => onVote(comment.id, "dislike")}
          />
          {/* Reply toggle */}
          <button
            onClick={() => setShowReplyBox(r => !r)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
              fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              color: showReplyBox ? "#D4AF37" : "rgba(255,255,255,0.35)",
              padding: "3px 6px",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => { if (!showReplyBox) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
            onMouseLeave={e => { if (!showReplyBox) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
          >
            ↩ Reply
          </button>
          {/* Show replies toggle */}
          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(r => !r)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(212,175,55,0.6)",
                padding: "3px 6px",
                transition: "color 0.2s",
              }}
            >
              {showReplies ? "▲ Hide" : `▼ ${comment.replies.length} repl${comment.replies.length === 1 ? "y" : "ies"}`}
            </button>
          )}
        </div>

        {/* Reply input */}
        {showReplyBox && (
          <div style={{ marginTop: 10, paddingLeft: 36, display: "flex", flexDirection: "column", gap: 6 }}>
            <input
              value={replyAuthor}
              onChange={e => setReplyAuthor(e.target.value)}
              placeholder="Your name (optional)"
              style={{ ...inputStyle, fontSize: 12 } as React.CSSProperties}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(); } }}
                placeholder="Write a reply…"
                rows={2}
                style={{ ...inputStyle, flex: 1, resize: "none", fontSize: 12 } as React.CSSProperties}
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                style={postBtnStyle(!!replyText.trim())}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {showReplies && comment.replies.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {comment.replies.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onVote={(vote) => onVoteReply(comment.id, reply.id, vote)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ReplyItem ────────────────────────────────────────────────────────────────
function ReplyItem({
  reply,
  onVote,
}: {
  reply: CommentReply;
  onVote: (vote: "like" | "dislike") => void;
}) {
  const avatarColor = `hsl(${(reply.author.charCodeAt(0) * 11) % 360}, 45%, 30%)`;
  return (
    <div style={{ padding: "10px 20px 10px 52px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%", background: avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, color: "#fff", flexShrink: 0,
        }}>
          {reply.author[0]?.toUpperCase() || "?"}
        </div>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "rgba(212,175,55,0.8)" }}>
          {reply.author}
        </span>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}>
          {new Date(reply.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <p style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 12,
        color: "rgba(255,255,255,0.6)", margin: "0 0 8px 29px", lineHeight: 1.5,
      }}>
        {reply.text}
      </p>
      <div style={{ display: "flex", gap: 6, paddingLeft: 29 }}>
        <VoteBtn icon="👍" count={reply.likes} active={reply.userVote === "like"} activeColor="#4ade80" onClick={() => onVote("like")} />
        <VoteBtn icon="👎" count={reply.dislikes} active={reply.userVote === "dislike"} activeColor="#f87171" onClick={() => onVote("dislike")} />
      </div>
    </div>
  );
}

// ─── VoteBtn ──────────────────────────────────────────────────────────────────
function VoteBtn({
  icon, count, active, activeColor, onClick,
}: {
  icon: string;
  count: number;
  active: boolean;
  activeColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: active ? `${activeColor}18` : "rgba(255,255,255,0.04)",
        border: active ? `1px solid ${activeColor}55` : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4, cursor: "pointer", padding: "3px 8px",
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
        fontSize: 12, color: active ? activeColor : "rgba(255,255,255,0.35)",
        transition: "all 0.18s",
        transform: active ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 4,
  padding: "8px 12px",
  color: "#fff",
  fontFamily: "'Barlow', sans-serif",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const postBtnStyle = (enabled: boolean): React.CSSProperties => ({
  background: enabled ? "#D4AF37" : "rgba(212,175,55,0.2)",
  border: "none",
  borderRadius: 4,
  color: enabled ? "#0A0A0A" : "rgba(255,255,255,0.3)",
  cursor: enabled ? "pointer" : "default",
  padding: "0 16px",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  transition: "background 0.2s",
  alignSelf: "stretch",
  flexShrink: 0,
});

// ─── QueueTab ─────────────────────────────────────────────────────────────────
function QueueTab({ queue, currentIndex, onPlay }: { queue: Track[]; currentIndex: number; onPlay: (t: Track) => void }) {
  return (
    <>
      {queue.map((t, i) => {
        const isCurrent = i === currentIndex;
        return (
          <div
            key={`${t.id}-${i}`}
            onClick={() => onPlay(t)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 20px", cursor: "pointer",
              background: isCurrent ? "rgba(212,175,55,0.08)" : "transparent",
              borderLeft: isCurrent ? "2px solid #D4AF37" : "2px solid transparent",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <div style={{ width: 20, textAlign: "center", flexShrink: 0 }}>
              {isCurrent
                ? <PlayingBars />
                : <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{i + 1}</span>
              }
            </div>
            <img src={t.coverUrl || t.thumbnail} alt={t.title}
              style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0, opacity: isCurrent ? 1 : 0.65 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 14,
                color: isCurrent ? "#D4AF37" : "#FFFFFF",
                letterSpacing: "0.05em", lineHeight: 1.2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {t.title}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                {t.artist}
              </div>
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
              {t.duration}
            </span>
          </div>
        );
      })}
    </>
  );
}

// ─── ArtistTab ────────────────────────────────────────────────────────────────
function ArtistTab({ artist, tracks, currentId, onPlay }: { artist: string; tracks: Track[]; currentId: string; onPlay: (t: Track) => void }) {
  return (
    <div>
      <div style={{ padding: "16px 20px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#FFFFFF", letterSpacing: "0.07em" }}>{artist}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
          {tracks.length} track{tracks.length !== 1 ? "s" : ""} in queue
        </div>
      </div>
      {tracks.map((t) => {
        const isCurrent = t.id === currentId;
        return (
          <div
            key={t.id}
            onClick={() => onPlay(t)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 20px", cursor: "pointer",
              background: isCurrent ? "rgba(212,175,55,0.08)" : "transparent",
              borderLeft: isCurrent ? "2px solid #D4AF37" : "2px solid transparent",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            {isCurrent
              ? <PlayingBars />
              : <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", width: 20, textAlign: "center", flexShrink: 0 }}>▶</span>
            }
            <img src={t.coverUrl || t.thumbnail} alt={t.title}
              style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0, opacity: isCurrent ? 1 : 0.65 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: isCurrent ? "#D4AF37" : "#FFFFFF", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.title}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                {t.genre || t.category}
              </div>
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{t.duration}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MiniTrackRow ─────────────────────────────────────────────────────────────
function MiniTrackRow({ track, onPlay }: { track: Track; onPlay: () => void }) {
  return (
    <div
      onClick={onPlay}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px", cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"}
      onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
    >
      <img src={track.coverUrl || track.thumbnail} alt={track.title}
        style={{ width: 34, height: 34, objectFit: "cover", flexShrink: 0, opacity: 0.6 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: "#FFFFFF", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{track.duration}</div>
      </div>
    </div>
  );
}

// ─── PlayingBars ──────────────────────────────────────────────────────────────
function PlayingBars() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16, width: 20 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          flex: 1, background: "#D4AF37", borderRadius: 1,
          animation: `barBounce${i} 0.8s ease infinite`,
          animationDelay: `${i * 0.15}s`,
          height: "60%",
        }} />
      ))}
      <style>{`
        @keyframes barBounce0 { 0%,100%{height:40%} 50%{height:100%} }
        @keyframes barBounce1 { 0%,100%{height:80%} 50%{height:30%} }
        @keyframes barBounce2 { 0%,100%{height:55%} 50%{height:90%} }
      `}</style>
    </div>
  );
}

// ─── Control button ───────────────────────────────────────────────────────────
function ControlBtn({ children, onClick, active = false, title }: { children: React.ReactNode; onClick: () => void; active?: boolean; title?: string }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: "none", border: "none", cursor: "pointer",
      color: active ? "#D4AF37" : "rgba(255,255,255,0.55)",
      padding: 8, display: "flex", alignItems: "center", justifyContent: "center",
      transition: "color 0.2s, transform 0.15s", borderRadius: "50%",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = active ? "#D4AF37" : "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

// ─── Platform button ──────────────────────────────────────────────────────────
function PlatformBtn({ label, color, icon }: { label: string; color: string; icon: React.ReactNode }) {
  return (
    <button title={label} style={{
      display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "6px 12px",
      cursor: "pointer", transition: "border-color 0.2s, background 0.2s", color: "rgba(255,255,255,0.55)",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; }}
    >
      {icon}
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
    </button>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IC = (d: string, s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
);

function PrevIcon() { return IC("M6 6h2v12H6zm3.5 6 8.5 6V6z"); }
function NextIcon() { return IC("M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"); }
function ShuffleIcon() { return IC("M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"); }
function RepeatIcon() { return IC("M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"); }
function RepeatOneIcon() { return IC("M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z"); }
function VolumeIcon({ muted }: { muted: boolean }) {
  return muted
    ? IC("M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4 9.91 6.09 12 8.18V4z", 22)
    : IC("M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z", 22);
}
function SpotifyIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 0 1-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 0 1 .207.857zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 0 1-.973-.52.781.781 0 0 1 .52-.974c3.632-1.102 8.147-.568 11.233 1.329a.78.78 0 0 1 .257 1.074zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 1 1-.543-1.792c3.532-1.072 9.404-.865 13.115 1.338a.937.937 0 0 1-.955 1.611z" /></svg>;
}
function AppleIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>;
}
function YoutubeIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" /></svg>;
}