import React from 'react';

const heroStyles = {
  padding: '4rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: '600px'
};

const titleStyles = {
  fontSize: 'var(--text-4xl)',
  fontWeight: '500',
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)'
};

const subtitleStyles = {
  fontSize: 'var(--text-lg)',
  color: 'var(--text-secondary)'
};

export const Home = () => {
  return (
    <div style={heroStyles}>
      <h1 style={titleStyles}>Analyze with intelligence.</h1>
      <p style={subtitleStyles}>
        Knightly is an AI-powered humanized chess review and coaching platform. 
        Frontend foundation established.
      </p>
    </div>
  );
};

export const NotFound = () => {
  return (
    <div style={heroStyles}>
      <h1 style={titleStyles}>404</h1>
      <p style={subtitleStyles}>
        The page you are looking for does not exist.
      </p>
    </div>
  );
};
