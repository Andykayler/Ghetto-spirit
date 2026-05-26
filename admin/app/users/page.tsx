"use client";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { Search, UserCheck, Ban, Eye, Plus } from "lucide-react";
import "./users.css";
import AddUserModal from "./adduser";   // Make sure this path is correct

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const users = [
    { id: 1, name: "Thabo Nkosi", email: "thabo@gmail.com", role: "Listener", joined: "Jan 2025", status: "active", streams: "1,245" },
    { id: 2, name: "Zinhle Mthembu", email: "zinhle@icloud.com", role: "Artist", joined: "Dec 2024", status: "active", streams: "892" },
    { id: 3, name: "Kgosi Radebe", email: "kgosi@yahoo.com", role: "Listener", joined: "Mar 2025", status: "inactive", streams: "324" },
    { id: 4, name: "Nomsa Khumalo", email: "nomsa@gmail.com", role: "Artist", joined: "Feb 2025", status: "active", streams: "2,134" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Users Management</h1>
          <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td>{user.joined}</td>
                    <td>{user.streams}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn"><Eye size={18} /></button>
                        <button className="action-btn"><UserCheck size={18} /></button>
                        <button className="action-btn delete"><Ban size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}