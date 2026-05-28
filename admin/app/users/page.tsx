"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Search, UserCheck, Ban, Eye, Plus } from "lucide-react";
import "./users.css";
import AddUserModal from "./adduser";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
  streams: string | number;
  profileImage?: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as User[];
        setUsers(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to load users");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "users", user.id), { status: newStatus });
      toast.success(`${user.name} marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Users Management</h1>
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} />
            Add New User
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="content-card table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Streams</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="user-avatar-img"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="user-avatar">{getInitials(user.name)}</div>
                        )}
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#aaa" }}>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ color: "#aaa" }}>{user.joined || "—"}</td>
                    <td>{user.streams || "0"}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="View">
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn"
                          title={user.status === "active" ? "Deactivate" : "Activate"}
                          onClick={() => handleToggleStatus(user)}
                        >
                          <UserCheck size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Ban"
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, "users", user.id), {
                                status: "banned",
                              });
                              toast.success(`${user.name} has been banned`);
                            } catch {
                              toast.error("Failed to ban user");
                            }
                          }}
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}