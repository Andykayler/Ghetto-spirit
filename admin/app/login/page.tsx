"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import "./style.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect to dashboard (no real auth)
    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Logo */}
        <div className="login-logo">
          <Image 
            src="/images/logo.png" 
            alt="Ghetto Spirit Logo" 
            width={180} 
            height={80}
            priority
          />
          <p>ADMIN PORTAL</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>WELCOME BACK</h2>
          <p>Sign in to manage your empire</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <div className="flex justify-between items-center mb-2">
              <label>PASSWORD</label>
              <Link href="#" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="login-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            SIGN IN
          </button>
        </form>

        {/* Create Account */}
        <p className="signup-link">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}