"use client";

import Navbar from "@/components/Navbar";
import { PlayerProvider } from "./PlayerContext";
import { MusicHero } from "./MusicHero";
import { FeaturedVideos } from "./FeaturedVideos";
import MusicPlayerBar from "@/components/MusicPlayerBar";
import { ExpandedPlayer } from "./ExpandedPlayer";

export default function MusicVideosPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        button { outline: none; }
        input[type=range] { -webkit-appearance: none; height: 3px; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #D4AF37; cursor: pointer; }
        @keyframes scanLine { 0%{width:0;left:0} 100%{width:100%;left:0} }
      `}</style>

      <PlayerProvider>
        <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A0A" }}>
          <Navbar />
          <div style={{ height: 70, flexShrink: 0 }} />
          <MusicHero />
          <FeaturedVideos />

          {/* Sticky bottom bar */}
          <div style={{ position: "sticky", bottom: 0, zIndex: 50, boxShadow: "0 -4px 40px rgba(0,0,0,0.7)" }}>
            <MusicPlayerBar />
          </div>

          {/* Full-screen expanded player */}
          <ExpandedPlayer />
        </main>
      </PlayerProvider>
    </>
  );
}
