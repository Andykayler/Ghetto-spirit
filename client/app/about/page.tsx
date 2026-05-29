"use client";

import Navbar from "@/components/Navbar";
import { AboutHero } from "./AboutHero";
import { MissionVision } from "./MissionVision";
import { AboutCTA } from "./AboutCTA";
import { ContactFooter } from "../../components/ContactFooter";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,600&family=Barlow:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <main
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <Navbar />

        {/* Push content below fixed navbar */}
        <div style={{ height: 70, flexShrink: 0 }} />

        <AboutHero />
        <MissionVision />

        <AboutCTA />
        <ContactFooter />
      </main>
    </>
  );
}