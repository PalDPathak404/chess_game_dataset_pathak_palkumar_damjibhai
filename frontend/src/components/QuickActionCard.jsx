import React, { memo } from 'react';
import { motion } from 'framer-motion';

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
};

export const QuickActionCard = memo(({ icon: Icon, title, description, onClick, index = 0 }) => (
  <motion.button
    custom={index}
    variants={cardVariant}
    initial="hidden"
    animate="visible"
    whileHover={{ scale: 1.015, borderColor: 'var(--border-strong)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="qa-card"
    aria-label={title}
  >
    <div className="qa-card-icon">
      {Icon && <Icon size={20} />}
    </div>
    <div className="qa-card-content">
      <span className="qa-card-title">{title}</span>
      <span className="qa-card-desc">{description}</span>
    </div>
  </motion.button>
));
