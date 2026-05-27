"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import "./style.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.2 - 0.04,
      alpha: Math.random() * 0.4 + 0.08,
      life: Math.random(),
    });

    resize();
    for (let i = 0; i < 60; i++) particles.push(mk());
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life += 0.003;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email    = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/user-not-found":    return "No account found with this email.";
      case "auth/wrong-password":    return "Incorrect password.";
      case "auth/invalid-email":     return "Invalid email address.";
      case "auth/too-many-requests": return "Too many attempts. Try again later.";
      default:                       return "Failed to sign in. Please try again.";
    }
  };

  return (
    <div className="login-root">
      <canvas ref={canvasRef} className="login-canvas" />

      {/* Ambient glows */}
      <div className="lg-glow lg-glow--tl" />
      <div className="lg-glow lg-glow--br" />

      {/* Corner marks */}
      <div className="lg-corner lg-corner--tl" />
      <div className="lg-corner lg-corner--tr" />
      <div className="lg-corner lg-corner--bl" />
      <div className="lg-corner lg-corner--br" />

      <div className={`login-card ${mounted ? "card-in" : ""}`}>

        {/* Top gold rule */}
        <div className="card-top-rule" />

        {/* Logo */}
        <div className="login-logo">
          <Image
            src="/images/logo.png"
            alt="Ghetto Spirit"
            width={160}
            height={68}
            priority
          />
          <div className="logo-label-row">
            <div className="logo-label-line" />
            <span>Admin Portal</span>
            <div className="logo-label-line" />
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your empire</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4l6 5 6-5M2 4h12v8H2V4z" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner" />
                Signing in…
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="card-divider">
          <div className="card-divider-line" />
          <div className="card-divider-diamond" />
          <div className="card-divider-line" />
        </div>

        {/* Sign up */}
        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="signup-link">Create Account</Link>
        </p>

      </div>
    </div>
  );
}