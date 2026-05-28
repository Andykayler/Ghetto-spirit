"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  audioUrl?: string;
  coverUrl?: string;
  streams?: number;
  createdAt?: any;
  duration?: string;
}

interface MusicPlayerBarProps {
  song: Song;
  onClose: () => void;
}

const waveformHeights = [
  4,8,12,18,24,16,28,20,14,30,22,18,26,12,20,28,16,24,10,22,30,18,14,26,20,
  16,28,12,24,18,30,22,14,20,26,16,10,28,18,24,12,20,30,22,16,14,26,18,28,20,
  8,12,20,16,24,10,22,14,28,18,12,26,20,16,30,14,22,18,10,24,
];

export default function MusicPlayerBar({ song, onClose }: MusicPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  // Track whether a play() call is in-flight so we never
  // pause() while it's still pending (which causes the AbortError)
  const playingRef = useRef(false);
  const pendingPlayRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load + autoplay when song changes — NO pause() in cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;

    // Reset state for new song
    setProgress(0);
    setCurrentTime("0:00");
    setDuration("0:00");
    setIsPlaying(false);
    playingRef.current = false;

    audio.src = song.audioUrl;
    audio.load();

    // Small delay so the browser finishes load() before play()
    const timeout = setTimeout(() => {
      pendingPlayRef.current = true;
      audio.play()
        .then(() => {
          pendingPlayRef.current = false;
          playingRef.current = true;
          setIsPlaying(true);
        })
        .catch((err) => {
          pendingPlayRef.current = false;
          // Only log if it's not a deliberate abort
          if (err.name !== "AbortError") {
            console.error("Playback failed:", err);
          }
        });
    }, 50);

    // Cleanup: just cancel the timeout — never call pause() here
    return () => {
      clearTimeout(timeout);
    };
  }, [song.id, song.audioUrl]);

  // Sync progress bar with real audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
      }
    };

    const onLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    const onEnded = () => {
      setIsPlaying(false);
      playingRef.current = false;
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Waveform animation tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => setTick((t) => t + 1), 120);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Don't toggle if a play() is still pending
    if (pendingPlayRef.current) return;

    if (isPlaying) {
      audio.pause();
      playingRef.current = false;
      setIsPlaying(false);
    } else {
      pendingPlayRef.current = true;
      audio.play()
        .then(() => {
          pendingPlayRef.current = false;
          playingRef.current = true;
          setIsPlaying(true);
        })
        .catch((err) => {
          pendingPlayRef.current = false;
          if (err.name !== "AbortError") {
            console.error("Playback failed:", err);
          }
        });
    }
  };

  // Handle close — safely stop audio
  const handleClose = () => {
    const audio = audioRef.current;
    if (audio && !pendingPlayRef.current) {
      audio.pause();
      audio.src = "";
    }
    onClose();
  };

  // Seek by clicking progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * audio.duration;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isMobile ? "68px" : "78px",
          background: "linear-gradient(90deg, #6a0000 0%, #8b0000 30%, #720000 70%, #4a0000 100%)",
          borderTop: "1px solid rgba(212, 160, 23, 0.3)",
          boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          padding: isMobile ? "0 12px" : "0 24px",
          gap: isMobile ? "12px" : "20px",
          color: "white",
        }}
      >
        {/* Left: Song Info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "10px" : "14px",
          minWidth: isMobile ? "140px" : "260px",
          flexShrink: 0,
        }}>
          <div style={{
            width: isMobile ? "42px" : "52px",
            height: isMobile ? "42px" : "52px",
            borderRadius: "6px",
            background: song.coverUrl ? "none" : "linear-gradient(135deg, #d4a017, #8b0000)",
            border: "1px solid rgba(212, 160, 23, 0.4)",
            flexShrink: 0,
            overflow: "hidden",
          }}>
            {song.coverUrl && (
              <img
                src={song.coverUrl}
                alt={song.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>

          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? "1rem" : "1.1rem",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {song.title}
            </div>
            <div style={{
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              color: "#ddd",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {song.artist}
            </div>
          </div>
        </div>

        {/* Center: Waveform + Controls */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "10px" : "16px",
        }}>
          <button
            onClick={togglePlay}
            style={{
              width: isMobile ? "42px" : "48px",
              height: isMobile ? "42px" : "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f5c842, #d4a017)",
              border: "none",
              color: "#000",
              fontSize: isMobile ? "1.2rem" : "1.4rem",
              cursor: pendingPlayRef.current ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: pendingPlayRef.current ? 0.7 : 1,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Waveform - desktop only */}
          <div style={{
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            gap: "3px",
            height: "48px",
            flex: 1,
          }}>
            {waveformHeights.map((h, i) => {
              const isActive = (i / waveformHeights.length) * 100 < progress;
              const animH = isPlaying
                ? h * (0.7 + 0.3 * Math.sin((tick + i) * 0.5))
                : h;
              return (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: `${animH}px`,
                    background: isActive
                      ? "linear-gradient(to top, #d4a017, #f5d24a)"
                      : "rgba(255,255,255,0.25)",
                    borderRadius: "2px",
                    transition: isPlaying ? "height 0.1s ease" : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Clickable progress bar */}
          <div
            onClick={handleSeek}
            style={{
              flex: isMobile ? 1 : "none",
              width: isMobile ? "auto" : "140px",
              height: "4px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "2px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "#d4a017",
              transition: "width 0.2s linear",
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* Right: Time + Close */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
          {!isMobile && (
            <span style={{ fontSize: "0.85rem", color: "#ddd", whiteSpace: "nowrap" }}>
              {currentTime} / {duration}
            </span>
          )}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            <X size={isMobile ? 18 : 20} />
          </button>
        </div>
      </div>
    </>
  );
}