import React from 'react';
import { motion } from 'framer-motion';

const cardStyles = {
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  transition: 'border-color 0.2s ease',
};

const iconWrapperStyles = {
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-tertiary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--accent-primary)',
  marginBottom: '0.5rem',
};

const titleStyles = {
  fontSize: 'var(--text-lg)',
  fontWeight: '500',
  color: 'var(--text-primary)',
};

const descStyles = {
  fontSize: 'var(--text-base)',
  color: 'var(--text-secondary)',
  lineHeight: '1.6',
};

export const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, borderColor: 'var(--border-strong)' }}
      style={cardStyles}
    >
      <div style={iconWrapperStyles}>
        {Icon && <Icon size={24} />}
      </div>
      <h3 style={titleStyles}>{title}</h3>
      <p style={descStyles}>{description}</p>
    </motion.div>
  );
};
