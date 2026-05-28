"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import "./logout.css";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      localStorage.clear();
      sessionStorage.clear();
      setLoggedOut(true);
      toast.success("You have been logged out successfully", { icon: "👋" });
      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch {
      toast.error("Something went wrong");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        {!loggedOut ? (
          <>
            <div className="logout-icon-wrap">
              <LogOut size={40} />
            </div>

            <h1>Logout</h1>
            <p className="logout-subtitle">
              Are you sure you want to log out from the Admin Portal?
            </p>

            <div className="logout-actions">
              <Link href="/dashboard" className="cancel-logout-btn">
                <ArrowLeft size={18} />
                Cancel
              </Link>

              <button
                className="confirm-logout-btn"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="spinner" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Yes, Logout
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="success-state">
            <CheckCircle size={72} className="success-icon" />
            <h2>You've been logged out</h2>
            <p>Redirecting to login page...</p>
            <div className="success-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}