import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const navStyles = {
  borderBottom: '1px solid var(--border-subtle)',
  padding: '1.5rem 0',
  marginBottom: '2rem'
};

const navContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyles = {
  fontSize: 'var(--text-xl)',
  fontWeight: '600',
  color: 'var(--accent-hover)',
  letterSpacing: '-0.02em'
};

const footerStyles = {
  borderTop: '1px solid var(--border-subtle)',
  padding: '2rem 0',
  marginTop: '4rem',
  color: 'var(--text-muted)',
  fontSize: 'var(--text-sm)'
};

const mainStyles = {
  minHeight: 'calc(100vh - 200px)'
};

const GlobalLayout = () => {
  return (
    <>
      <header style={navStyles}>
        <div className="container" style={navContainerStyles}>
          <Link to="/" style={logoStyles}>Knightly</Link>
          <nav>
            {/* Future Navigation Links */}
          </nav>
        </div>
      </header>
      
      <main className="container" style={mainStyles}>
        <Outlet />
      </main>

      <footer style={footerStyles}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Knightly. Intelligence platform.</p>
        </div>
      </footer>
    </>
  );
};

export default GlobalLayout;
