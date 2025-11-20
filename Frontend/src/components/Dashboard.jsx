// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Summarizer from "./Summarizer";
import Quiz from "./Quiz";
import Homework from "./Homework";
import { LogOut, FileText, BookOpen, HelpCircle, Home, Menu } from "lucide-react";

export default function Dashboard({ onSignOut }) {
  const [tab, setTab] = useState("summary");
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user info from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Close sidebar when viewport expands
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-shell">
      {/* Mobile header with hamburger */}
      <header className="mobile-header">
        <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu />
        </button>
        <div className="mobile-brand">
          <Home className="brand-icon" />
          <div className="mobile-brand-text">
            <div className="brand-title">EduQuick</div>
            <div className="brand-sub">Study Helper</div>
          </div>
        </div>
        <div style={{ width: 40 }} /> {/* spacer */}
      </header>

      {/* Sidebar / Drawer */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand">
            <Home className="brand-icon" />
            <div>
              <div className="brand-title">EduQuick</div>
              <div className="brand-sub">Study Helper</div>
            </div>
          </div>
          <button className="close-drawer" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${tab === "summary" ? "active" : ""}`}
            onClick={() => { setTab("summary"); setSidebarOpen(false); }}
          >
            <FileText className="nav-icon" /> Summarize
          </button>

          <button
            className={`nav-btn ${tab === "quiz" ? "active" : ""}`}
            onClick={() => { setTab("quiz"); setSidebarOpen(false); }}
          >
            <BookOpen className="nav-icon" /> Quiz
          </button>

          <button
            className={`nav-btn ${tab === "homework" ? "active" : ""}`}
            onClick={() => { setTab("homework"); setSidebarOpen(false); }}
          >
            <HelpCircle className="nav-icon" /> Homework
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.fullName || "Student"}</div>
            <div className="user-sub">{user?.subscription || "Free plan"}</div>
          </div>

          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              onSignOut && onSignOut();
            }}
            aria-label="Logout"
          >
            <LogOut className="nav-icon" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay when drawer open */}
      {sidebarOpen && <div className="drawer-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="main">
        <div className="container">
          {tab === "summary" && <Summarizer />}
          {tab === "quiz" && <Quiz />}
          {tab === "homework" && <Homework />}
        </div>
      </main>
    </div>
  );
}
