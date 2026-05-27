"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  thumbnail?: string;
  duration?: string;
  genre?: string;
  category?: string;
};

export type CommentReply = {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
};

export type Comment = {
  id: string;
  trackId: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
  replies: CommentReply[];
};

type RepeatMode = "off" | "all" | "one";

type PlayerContextValue = {
  // State
  currentTrack: Track | null;
  playing: boolean;
  progress: number;        // 0–100
  volume: number;          // 0–100
  shuffle: boolean;
  repeat: RepeatMode;
  expanded: boolean;
  queue: Track[];
  queueIndex: number;

  // Engagement state
  streamCounts: Record<string, number>;
  likes: Record<string, boolean>;
  comments: Comment[];

  // Actions
  play: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seek: (pct: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (v: boolean) => void;
  toggleLike: (trackId: string) => void;
  addComment: (trackId: string, author: string, text: string) => void;
  voteComment: (commentId: string, vote: "like" | "dislike") => void;
  addReply: (commentId: string, author: string, text: string) => void;
  voteReply: (commentId: string, replyId: string, vote: "like" | "dislike") => void;

  // Helpers
  currentVideo: Track | null;
  artistTrackCount: (artist: string) => number;
  artistTracks: (artist: string) => Track[];
  currentSong: Track | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function parseDuration(d?: string): number {
  if (!d) return 0;
  const parts = d.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [expanded, setExpanded] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Engagement state
  const [streamCounts, setStreamCounts] = useState<Record<string, number>>({});
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Comment[]>([]);

  // ── Audio element setup ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume / 100;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => { handleEndedRef.current(); };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Volume sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // ── Track change ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;

    audio.src = currentTrack.audioUrl;
    audio.load();
    audio.play().catch(() => {});
    setPlaying(true);
    setProgress(0);

    setStreamCounts(prev => ({
      ...prev,
      [currentTrack.id]: (prev[currentTrack.id] || 0) + 1,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // ── Ref-based ended handler ────────────────────────────────────────────────
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const repeatRef = useRef(repeat);
  const shuffleRef = useRef(shuffle);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);

  const doNext = useCallback((fromEnded = false) => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const rep = repeatRef.current;
    const shuf = shuffleRef.current;

    if (fromEnded && rep === "one") {
      audioRef.current?.play();
      return;
    }
    if (shuf) {
      const nextIdx = Math.floor(Math.random() * q.length);
      setQueueIndex(nextIdx);
      setCurrentTrack({ ...q[nextIdx] });
      return;
    }
    if (idx < q.length - 1) {
      const nextIdx = idx + 1;
      setQueueIndex(nextIdx);
      setCurrentTrack({ ...q[nextIdx] });
    } else if (rep === "all") {
      setQueueIndex(0);
      setCurrentTrack({ ...q[0] });
    } else if (fromEnded) {
      setPlaying(false);
      setProgress(0);
    } else {
      const nextIdx = (idx + 1) % q.length;
      setQueueIndex(nextIdx);
      setCurrentTrack({ ...q[nextIdx] });
    }
  }, []);

  const handleEndedRef = useRef(() => doNext(true));
  useEffect(() => { handleEndedRef.current = () => doNext(true); }, [doNext]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const play = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (queue.length === 0) {
      setQueue([track]);
      setQueueIndex(0);
    } else {
      const existing = queue.findIndex(t => t.id === track.id);
      if (existing >= 0) {
        setQueueIndex(existing);
      } else {
        const newQ = [...queue, track];
        setQueue(newQ);
        setQueueIndex(newQ.length - 1);
      }
    }
    setCurrentTrack({ ...track });
    setExpanded(true);
  }, [queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  }, []);

  const next = useCallback(() => doNext(false), [doNext]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const prevIdx = (idx - 1 + q.length) % q.length;
    setQueueIndex(prevIdx);
    setCurrentTrack({ ...q[prevIdx] });
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);
  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const cycleRepeat = useCallback(() => {
    setRepeat(r => r === "off" ? "all" : r === "all" ? "one" : "off");
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikes(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  }, []);

  const addComment = useCallback((trackId: string, author: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random()}`,
      trackId,
      author: author.trim() || "Anonymous",
      text: text.trim(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      userVote: null,
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
  }, []);

  const voteComment = useCallback((commentId: string, vote: "like" | "dislike") => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const prevVote = c.userVote;
      let likes = c.likes;
      let dislikes = c.dislikes;
      // Undo previous vote
      if (prevVote === "like") likes--;
      if (prevVote === "dislike") dislikes--;
      // Apply new vote (toggle off if same)
      const newVote = prevVote === vote ? null : vote;
      if (newVote === "like") likes++;
      if (newVote === "dislike") dislikes++;
      return { ...c, likes, dislikes, userVote: newVote };
    }));
  }, []);

  const addReply = useCallback((commentId: string, author: string, text: string) => {
    if (!text.trim()) return;
    const reply: CommentReply = {
      id: `${Date.now()}-${Math.random()}`,
      author: author.trim() || "Anonymous",
      text: text.trim(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      userVote: null,
    };
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
    ));
  }, []);

  const voteReply = useCallback((commentId: string, replyId: string, vote: "like" | "dislike") => {
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const newReplies = c.replies.map(r => {
        if (r.id !== replyId) return r;
        const prevVote = r.userVote;
        let likes = r.likes;
        let dislikes = r.dislikes;
        if (prevVote === "like") likes--;
        if (prevVote === "dislike") dislikes--;
        const newVote = prevVote === vote ? null : vote;
        if (newVote === "like") likes++;
        if (newVote === "dislike") dislikes++;
        return { ...r, likes, dislikes, userVote: newVote };
      });
      return { ...c, replies: newReplies };
    }));
  }, []);

  // ── Artist helpers ────────────────────────────────────────────────────────
  const artistTrackCount = useCallback((artist: string) => {
    return queue.filter(t => t.artist === artist).length;
  }, [queue]);

  const artistTracks = useCallback((artist: string) => {
    return queue.filter(t => t.artist === artist);
  }, [queue]);

  const value: PlayerContextValue = {
    currentTrack,
    playing,
    progress,
    volume,
    shuffle,
    repeat,
    expanded,
    queue,
    queueIndex,
    streamCounts,
    likes,
    comments,
    play,
    togglePlay,
    seek,
    next,
    prev,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    setExpanded,
    toggleLike,
    addComment,
    voteComment,
    addReply,
    voteReply,
    currentVideo: currentTrack,
    currentSong: currentTrack,
    artistTrackCount,
    artistTracks,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}