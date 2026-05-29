"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/trending";
import MusicPlayerBar from "@/components/MusicPlayerBar";
import { ContactFooter } from "@/components/ContactFooter";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A0A0A' }}>
      <Navbar />
      <HeroSection />
      <TrendingSection />
      <MusicPlayerBar />
      <ContactFooter />
    </main>
  );
}