import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GlobalLayout = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--accent-hover)', letterSpacing: '-0.02em' }}>
            Knightly
          </Link>
          <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {token ? (
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: 'var(--text-sm)' }}>
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: 'var(--text-sm)' }}>
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: 'var(--text-sm)' }}>
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem 0', marginTop: '4rem', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Knightly. Intelligence platform.</p>
        </div>
      </footer>
    </>
  );
};

export default GlobalLayout;
