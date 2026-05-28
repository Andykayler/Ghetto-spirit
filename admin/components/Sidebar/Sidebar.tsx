"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu, X, Home, Users, Music, UserPlus,
  BarChart3, Settings, LogOut, User, Archive,
} from "lucide-react";
import "./style.css";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data();
          setAdminName(data.name || "Admin");
          setAdminEmail(data.email || user.email || "");
          setAdminAvatar(data.profileImage || null);
        } else {
          // fallback to Firebase Auth fields
          setAdminName(user.displayName || "Admin");
          setAdminEmail(user.email || "");
        }
      } catch (err) {
        console.error("Failed to load sidebar user:", err);
        setAdminEmail(user.email || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    closeSidebar();
    window.location.href = "/logout";
  };

  // First letter of first name for avatar fallback
  const avatarLetter = adminName?.charAt(0).toUpperCase() || "A";

  return (
    <>
      {/* Mobile Menu Button */}
      <button onClick={toggleSidebar} className="mobile-menu-button" aria-label="Toggle Sidebar">
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
          <Link href="/dashboard" className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`} onClick={closeSidebar}>
            <Home size={20} /><span>Dashboard</span>
          </Link>
          <Link href="/artists" className={`sidebar-link ${isActive("/artists") ? "active" : ""}`} onClick={closeSidebar}>
            <UserPlus size={20} /><span>Artists</span>
          </Link>
          <Link href="/music" className={`sidebar-link ${isActive("/music") ? "active" : ""}`} onClick={closeSidebar}>
            <Music size={20} /><span>Music Library</span>
          </Link>
          <Link href="/users" className={`sidebar-link ${isActive("/users") ? "active" : ""}`} onClick={closeSidebar}>
            <Users size={20} /><span>Users</span>
          </Link>
          <Link href="/analytics" className={`sidebar-link ${isActive("/analytics") ? "active" : ""}`} onClick={closeSidebar}>
            <BarChart3 size={20} /><span>Analytics</span>
          </Link>
          <Link href="/archive" className={`sidebar-link ${isActive("/archive") ? "active" : ""}`} onClick={closeSidebar}>
            <Archive size={20} /><span>Archive</span>
          </Link>
          <Link href="/profile" className={`sidebar-link ${isActive("/profile") ? "active" : ""}`} onClick={closeSidebar}>
            <User size={20} /><span>Profile</span>
          </Link>
          <Link href="/settings" className={`sidebar-link ${isActive("/settings") ? "active" : ""}`} onClick={closeSidebar}>
            <Settings size={20} /><span>Settings</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {adminAvatar
                ? <img src={adminAvatar} alt="avatar" className="admin-avatar-img" />
                : avatarLetter
              }
            </div>
            <div className="admin-details">
              <p className="admin-name">{adminName}</p>
              <p className="admin-email">{adminEmail}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}