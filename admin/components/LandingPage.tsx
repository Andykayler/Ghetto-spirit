"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css";

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const particles: {
      x: number; y: number; r: number;
      vx: number; vy: number;
      alpha: number; life: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const mk = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.05,
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random(),
    });

    resize();
    for (let i = 0; i < 80; i++) particles.push(mk());
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.003;
        const a = p.alpha * Math.sin(p.life * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,160,23,${Math.max(0, a)})`;
        ctx.fill();
        if (p.y < -5 || a <= 0) particles[i] = mk();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const stats = [
    { num: "127+", label: "Artists" },
    { num: "3.4K", label: "Tracks"  },
    { num: "98%",  label: "Uptime"  },
  ];

  const pills = ["Afro Urban", "Talent", "Music", "Creative Power"];

  return (
    <div className="landing-root">
      <canvas ref={canvasRef} className="landing-canvas" />
      <div className="landing-glow" />
      <div className="landing-glow2" />

      {/* Corner marks */}
      <div className="corner tl" />
      <div className="corner tr" />
      <div className="corner bl" />
      <div className="corner br" />
      <div className="side-text">EST. MMXXIV &nbsp;•&nbsp; ADMIN PORTAL</div>

      <div className="landing-layout">
        <div className="landing-content">

          {/* ── Logo ── */}
          <div className="landing-logo">
            <div className="logo-glow-ring">
              <Image
                src="/images/logo.png"
                alt="Ghetto Spirit"
                width={220}
                height={100}
                priority
                className="logo-img"
              />
            </div>
            <div className="logo-label-row">
              <div className="logo-label-line" />
              <span>Management System</span>
              <div className="logo-label-line" />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="divider-row">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          {/* ── Heading ── */}
          <div className="landing-heading">
            <h1>Welcome to<br /><span className="gold-word">the Empire</span></h1>
          </div>

          {/* ── Tagline ── */}
          <p className="tagline">
            Powering the culture.{" "}
            <strong>Managing the movement.</strong><br />
            Entertainment administration built for the next generation.
          </p>

          {/* ── CTA ── */}
          <button className="enter-btn" onClick={() => router.push("/login")}>
            <span>Enter the Portal</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12M10 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* ── Pills ── */}
          <div className="pills-row">
            {pills.map((p, i) => (
              <span key={p} className="pill-group">
                {i > 0 && <span className="pill-dot" />}
                <span className="pill">{p}</span>
              </span>
            ))}
          </div>

          {/* ── Stats ── */}
          <div className="stats-bar">
            {stats.map((s, i) => (
              <span key={s.label} className="stat-group">
                {i > 0 && <div className="stat-divider" />}
                <div className="stat">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}