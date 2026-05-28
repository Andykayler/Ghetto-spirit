"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  Music,
  UserPlus,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  User,
  Archive,
} from "lucide-react";
import "./style.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Updated Logout - Calls the dedicated /logout page
  const handleLogout = () => {
    closeSidebar();
    window.location.href = "/logout";   // Direct navigation to logout page
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="mobile-menu-button"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Image
            src="/images/logo.png"
            alt="Ghetto Spirit Logo"
            width={180}
            height={60}
            priority
            className="sidebar-logo-image"
          />

          <span className="portal-label">ADMIN PORTAL</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          {/* Artists */}
          <Link
            href="/artists"
            className={`sidebar-link ${isActive("/artists") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <UserPlus size={20} />
            <span>Artists</span>
          </Link>

          {/* Music */}
          <Link
            href="/music"
            className={`sidebar-link ${isActive("/music") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Music size={20} />
            <span>Music Library</span>
          </Link>

          {/* Users */}
          <Link
            href="/users"
            className={`sidebar-link ${isActive("/users") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Users size={20} />
            <span>Users</span>
          </Link>

          {/* Analytics */}
          <Link
            href="/analytics"
            className={`sidebar-link ${isActive("/analytics") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>

         {/* Archive */}
          <Link
            href="/archive"
            className={`sidebar-link ${isActive("/archive") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Archive size={20} />
            <span>Archive</span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">

          {/* Admin Info */}
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div className="admin-details">
              <p className="admin-name">Admin</p>
              <p className="admin-email">admin@ghettospirit.com</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}