import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  FileText,
  Database,
  Upload,
  Sparkles,
  User,
  Search,
  Bell,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/workspace', icon: LayoutGrid, label: 'Workspace', end: true },
  { to: '/workspace/reviews', icon: FileText, label: 'Reviews' },
  { to: '/workspace/games', icon: Database, label: 'Games' },
  { to: '/workspace/import', icon: Upload, label: 'Import' },
  { to: '/workspace/coach', icon: Sparkles, label: 'AI Coach' },
  { to: '/workspace/profile', icon: User, label: 'Profile' },
];

const NavRail = () => (
  <nav className="ws-nav-rail" role="navigation" aria-label="Workspace navigation">
    {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `ws-nav-item${isActive ? ' ws-nav-item--active' : ''}`}
        title={label}
        aria-label={label}
      >
        <Icon size={20} />
        <span className="ws-nav-label">{label}</span>
      </NavLink>
    ))}
  </nav>
);

const TopBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="ws-topbar">
      <span className="ws-topbar-logo">Knightly</span>

      <div className="ws-search">
        <Search size={14} className="ws-search-icon" />
        <input
          type="search"
          placeholder="Search games, players..."
          className="ws-search-input"
          aria-label="Search games and players"
        />
      </div>

      <div className="ws-topbar-actions">
        <button className="ws-icon-btn" aria-label="Notifications"><Bell size={16} /></button>
        <button className="ws-icon-btn" aria-label="Toggle theme"><Moon size={16} /></button>
        <button className="ws-avatar" aria-label="Profile" onClick={handleLogout} title="Click to sign out">
          U
        </button>
      </div>
    </header>
  );
};

const RightPanel = ({ open }) => (
  <aside
    className={`ws-right-panel${open ? ' ws-right-panel--open' : ''}`}
    aria-label="Context panel"
    aria-expanded={open}
  >
    {open && (
      <div className="ws-right-panel-inner">
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>AI Insights coming soon.</p>
      </div>
    )}
    {!open && <ChevronRight size={14} className="ws-panel-chevron" />}
  </aside>
);

const StatusBar = () => (
  <footer className="ws-status-bar" role="contentinfo">
    <span>Knightly v1.0</span>
    <span className="ws-status-connected">
      <span className="ws-status-dot" />
      Connected
    </span>
  </footer>
);

const WorkspaceLayout = () => {
  const [rightOpen] = useState(false);

  return (
    <div className="ws-shell">
      <TopBar />
      <div className="ws-body">
        <NavRail />
        <main className="ws-main" id="main-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </main>
        <RightPanel open={rightOpen} />
      </div>
      <StatusBar />
    </div>
  );
};

export default WorkspaceLayout;
