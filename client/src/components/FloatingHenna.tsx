import React from 'react';
import { motion } from 'framer-motion';

const FloatingMotif: React.FC<{ delay: number; top: string; left: string; size: number }> = ({ delay, top, left, size }) => (
  <motion.svg
    animate={{ y: [0, -20, 0], opacity: [0.05, 0.15, 0.05], rotate: [0, 15, 0] }}
    transition={{ duration: 7 + delay, ease: "easeInOut", repeat: Infinity, delay }}
    viewBox="0 0 60 60"
    style={{ position: 'fixed', width: `${size}px`, height: `${size}px`, top, left, pointerEvents: 'none', zIndex: 50 }}
  >
    <path d="M 30 5 C 35 15, 50 20, 55 30 C 50 40, 35 45, 30 55 C 25 45, 10 40, 5 30 C 10 20, 25 15, 30 5 Z" stroke="var(--color-henna-light)" strokeWidth="1.5" fill="none" />
    <circle cx="30" cy="30" r="6" stroke="var(--color-henna-light)" strokeWidth="1" fill="none" />
    <circle cx="30" cy="30" r="2" fill="var(--color-henna-light)" />
  </motion.svg>
);

const FloatingHenna: React.FC = () => {
  return (
    <>
      <FloatingMotif delay={0} top="15%" left="5%" size={80} />
      <FloatingMotif delay={2} top="75%" left="10%" size={60} />
      <FloatingMotif delay={1} top="45%" left="85%" size={90} />
      <FloatingMotif delay={3} top="85%" left="80%" size={70} />
      <FloatingMotif delay={1.5} top="25%" left="90%" size={50} />
    </>
  );
};

export default FloatingHenna;
