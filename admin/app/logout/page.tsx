"use client";

import { useState, useEffect } from "react";
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

    // Simulate API call / auth cleanup
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      localStorage.clear();
      sessionStorage.clear();

      setLoggedOut(true);

      toast.success("You have been logged out successfully", {
        icon: "👋",
      });

      // Redirect to login after showing success
      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        {!loggedOut ? (
          <>
            <div className="logout-icon">
              <LogOut size={48} />
            </div>

            <h1>Logout</h1>
            <p className="logout-subtitle">
              Are you sure you want to log out from the Admin Portal?
            </p>

            <div className="logout-actions">
              <Link href="/profile" className="cancel-btn">
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
            <CheckCircle size={64} className="success-icon" />
            <h2>You’ve been logged out</h2>
            <p>Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}