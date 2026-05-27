"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import "./style.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo">
          <Image
            src="/images/logo.png"
            alt="Ghetto Spirit Logo"
            width={280}
            height={120}
            priority
            className="logo-image"
          />
          <p className="admin-text">ADMIN PORTAL</p>
        </div>

        <div className="hero-text">
          <h1>WELCOME TO THE EMPIRE</h1>
          <p className="tagline">
            Powering the culture. Managing the movement.<br />
            Entertainment administration built for the next generation.
          </p>
        </div>

        <button
          className="enter-btn"
          onClick={() => router.push("/login")}
        >
          ENTER THE PORTAL
          <ArrowRight size={24} />
        </button>

        <p className="subtext">
          Afro Urban Culture • Talent • Music • Creative Power
        </p>
      </div>

      <div className="bottom-fade" />
    </div>
  );
}