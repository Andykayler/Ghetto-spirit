"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Home, Users, Music, UserPlus, BarChart3, 
  DollarSign, Settings, LogOut, User 
} from "lucide-react";
import "./style.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully! (Demo)");
      window.location.href = "/login";
    }
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
            <Home size={20} />
            Dashboard
          </Link>

          <Link 
            href="/artists" 
            className={`sidebar-link ${isActive('/artists') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <UserPlus size={20} />
            Artists
          </Link>

          <Link 
            href="/music" 
            className={`sidebar-link ${isActive('/music') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Music size={20} />
            Music Library
          </Link>

          <Link 
            href="/users" 
            className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Users size={20} />
            Users
          </Link>

          <Link 
            href="/analytics" 
            className={`sidebar-link ${isActive('/analytics') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <BarChart3 size={20} />
            Analytics
          </Link>

          <Link 
            href="/revenue" 
            className={`sidebar-link ${isActive('/revenue') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <DollarSign size={20} />
            Revenue
          </Link>

          {/* Profile Link Added */}
          <Link 
            href="/profile" 
            className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <User size={20} />
            Profile
          </Link>

          <Link 
            href="/settings" 
            className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Settings size={20} />
            Settings
          </Link>
        </div>

        {/* Footer with Logout */}
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              A
            </div>
            <div>
              <p className="admin-name">Admin</p>
              <p className="admin-email">admin@ghettospirit.com</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}