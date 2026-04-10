import { useState, useEffect } from "react";
import "./App.css";

const NAV_ITEMS = [
  { icon: "▣", label: "Overview" },
  { icon: "◈", label: "Analytics" },
  { icon: "◫", label: "Projects" },
  { icon: "◉", label: "Team" },
  { icon: "◎", label: "Settings" },
];

const CARDS = [
  {
    title: "Design System",
    accent: "#6366f1",
    tag: "UI/UX",
    body: "A unified component library for all product teams — covering tokens, patterns, and accessibility guidelines.",
    progress: 78,
  },
  {
    title: "API Platform",
    accent: "#0ea5e9",
    tag: "Backend",
    body: "Scalable REST and GraphQL endpoints with rate limiting, versioning, and real-time webhooks.",
    progress: 55,
  },
  {
    title: "Growth Dashboard",
    accent: "#10b981",
    tag: "Analytics",
    body: "Acquisition, activation, and retention funnels with daily automated reports and anomaly detection.",
    progress: 91,
  },
  {
    title: "Mobile App",
    accent: "#f59e0b",
    tag: "Mobile",
    body: "Cross-platform React Native app with offline-first architecture and push notification support.",
    progress: 42,
  },
  {
    title: "Data Pipeline",
    accent: "#ec4899",
    tag: "Infra",
    body: "Real-time ingestion and transformation layer built on Kafka with a 99.9% uptime SLA.",
    progress: 67,
  },
  {
    title: "Auth Service",
    accent: "#8b5cf6",
    tag: "Security",
    body: "OAuth 2.0, SSO, and MFA infrastructure supporting 50+ enterprise identity providers globally.",
    progress: 83,
  },
];

const STATS = [
  { label: "Revenue", value: "$48,295", delta: "+12.4%", up: true },
  { label: "Active Users", value: "3,841", delta: "+8.1%", up: true },
  { label: "Conversion", value: "5.7%", delta: "+0.9%", up: true },
];

function StatCard({ label, value, delta, up }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className={`stat-delta ${up ? "up" : "down"}`}>{delta}</span>
    </div>
  );
}

function ProjectCard({ title, accent, tag, body, progress }) {
  return (
    <div className="project-card">
      <div className="card-header" style={{ background: accent }}>
        <span className="card-title">{title}</span>
        <span className="card-tag">{tag}</span>
      </div>
      <div className="card-body">
        <p className="card-text">{body}</p>
        <div className="progress-row">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
          <span className="progress-label">{progress}%</span>
        </div>
      </div>
      <div className="card-footer">
        <button className="card-btn" style={{ "--btn-color": accent }}>
          View project
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("dashboard-theme") === "dark";
    } catch {
      return false;
    }
  });

  const [activeNav, setActiveNav] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("dashboard-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          dash<span className="logo-accent">.</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === i ? "active" : ""}`}
              onClick={() => setActiveNav(i)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <span className="user-name">Jane Doe</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">Overview</h1>
            <span className="page-subtitle">
              {NAV_ITEMS[activeNav].label}
            </span>
          </div>
          <div className="topbar-right">
            <button
              className="theme-toggle"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-icon">{dark ? "☀" : "🌙"}</span>
              <span className="toggle-text">
                {dark ? "Light mode" : "Dark mode"}
              </span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="content">
          <section className="stats-section">
            <h2 className="section-heading">This Month</h2>
            <div className="stats-grid">
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </section>

          <section className="projects-section">
            <h2 className="section-heading">Projects</h2>
            <div className="card-grid">
              {CARDS.map((c) => (
                <ProjectCard key={c.title} {...c} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}