"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Search, UserCheck, Ban, Eye, Plus } from "lucide-react";
import "./users.css";
import AddUserModal from "./adduser";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const users = [
    { id: 1, name: "Thabo Nkosi",    email: "thabo@gmail.com",   role: "Listener", joined: "Jan 2025", status: "active",   streams: "1,245" },
    { id: 2, name: "Zinhle Mthembu", email: "zinhle@icloud.com", role: "Artist",   joined: "Dec 2024", status: "active",   streams: "892"   },
    { id: 3, name: "Kgosi Radebe",   email: "kgosi@yahoo.com",   role: "Listener", joined: "Mar 2025", status: "inactive", streams: "324"   },
    { id: 4, name: "Nomsa Khumalo",  email: "nomsa@gmail.com",   role: "Artist",   joined: "Feb 2025", status: "active",   streams: "2,134" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Get initials for the avatar bubble */
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">

        {/* Header */}
        <div className="page-header">
          <h1>Users Management</h1>
          <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} />
            Add New User
          </button>
        </div>

        {/* Search */}
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

        {/* Table */}
        <div className="content-card table-card">
          <div className="table-wrapper">
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
                {filteredUsers.length === 0 ? (
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
                          <div className="user-avatar">{getInitials(user.name)}</div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "#aaa" }}>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ color: "#aaa" }}>{user.joined}</td>
                      <td>{user.streams}</td>
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
                          <button className="action-btn" title="Approve">
                            <UserCheck size={16} />
                          </button>
                          <button className="action-btn delete" title="Ban">
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
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}