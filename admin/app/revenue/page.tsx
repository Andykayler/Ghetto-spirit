
"use client";

import Sidebar from "../../components/NavBar/Sidebar";
import { DollarSign } from "lucide-react";
import "./revenue.css";

export default function RevenuePage() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="page-header">
          <h1>Revenue & Payouts</h1>
        </div>

        <div className="stats-grid revenue-stats">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">$124.8K</p>
            <p className="stat-change positive">↑ 18.2% this month</p>
          </div>
          <div className="stat-card">
            <h3>Pending Payouts</h3>
            <p className="stat-number">$28.4K</p>
          </div>
          <div className="stat-card">
            <h3>Artists Paid</h3>
            <p className="stat-number">47</p>
          </div>
        </div>

        <div className="content-card">
          <h2>Recent Transactions</h2>
          <p>Transaction table will go here...</p>
        </div>
      </div>
    </div>
  );
}