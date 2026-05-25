"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";   // ← Added this
import { Menu, X } from "lucide-react";
import "./style.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();   // Gets current URL

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Helper function to check active link
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="mobile-menu-button"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Image
            src="/images/logo.png"
            alt="Ghetto Spirit Logo"
            width={180}
            height={60}
            priority
            className="sidebar-logo-image"
          />
          <span>ADMIN PORTAL</span>
        </div>

        <div className="sidebar-nav">
          <Link 
            href="/dashboard" 
            className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Dashboard
          </Link>
          
          <Link 
            href="/artists" 
            className={`sidebar-link ${isActive('/artists') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Artists
          </Link>

          <Link 
            href="/music" 
            className={`sidebar-link ${isActive('/music') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Music Library
          </Link>

          <Link 
            href="/users" 
            className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Users
          </Link>

          <Link 
            href="/analytics" 
            className={`sidebar-link ${isActive('/analytics') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Analytics
          </Link>

          <Link 
            href="/revenue" 
            className={`sidebar-link ${isActive('/revenue') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Revenue
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A017] rounded-full flex items-center justify-center text-black font-bold text-xl">
              A
            </div>
            <div>
              <p className="text-white text-sm">Admin</p>
              <p className="text-gray-500 text-xs">admin@ghettospirit.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}