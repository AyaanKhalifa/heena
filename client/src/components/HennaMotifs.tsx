import React from 'react';
import { motion } from 'framer-motion';

// Continuous drawing animation config
const drawContinuous: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      pathLength: { delay: i * 0.5, duration: 6, ease: "easeInOut", repeat: Infinity },
      opacity: { delay: i * 0.5, duration: 6, ease: "easeInOut", repeat: Infinity }
    }
  })
};

const spinContinuous: any = {
  hidden: { rotate: 0 },
  visible: {
    rotate: 360,
    transition: { duration: 20, ease: "linear", repeat: Infinity }
  }
};

const pulseContinuous: any = {
  hidden: { scale: 1, opacity: 0.5 },
  visible: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
  }
};

const svgStyle = { width: '100%', height: '100%', opacity: 0.15, position: 'absolute' as const, top: 0, left: 0, zIndex: 0, pointerEvents: 'none' as const };

export const MandalaLoop: React.FC = () => (
  <motion.div style={{ ...svgStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }} variants={pulseContinuous} initial="hidden" animate="visible">
    <motion.svg viewBox="0 0 200 200" style={{ width: '50vw', maxWidth: '500px' }} variants={spinContinuous} initial="hidden" animate="visible">
      {/* Intense Mandala Pattern */}
      <motion.circle cx="100" cy="100" r="10" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={drawContinuous} custom={0} />
      <motion.circle cx="100" cy="100" r="20" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="3 3" fill="none" variants={drawContinuous} custom={1} />
      <motion.circle cx="100" cy="100" r="80" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={drawContinuous} custom={2} />
      <motion.path d="M 100 20 C 130 50, 150 50, 180 100 C 150 150, 130 150, 100 180 C 70 150, 50 150, 20 100 C 50 50, 70 50, 100 20 Z" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={drawContinuous} custom={3} />
      <motion.path d="M 100 40 L 100 160 M 40 100 L 160 100 M 55 55 L 145 145 M 55 145 L 145 55" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="4 4" fill="none" variants={drawContinuous} custom={4} />
    </motion.svg>
  </motion.div>
);

export const PaisleyLoop: React.FC = () => (
  <div style={{ ...svgStyle, overflow: 'hidden' }}>
    <motion.svg viewBox="0 0 200 200" style={{ width: '60vw', maxWidth: '600px', position: 'absolute', right: '-10%', top: '10%' }}>
      {/* Intense Paisley Pattern */}
      <motion.path d="M 100 180 C 180 180, 180 80, 100 80 C 60 80, 60 40, 100 40 C 130 40, 140 60, 140 60 C 140 60, 160 40, 100 20 C 20 20, 20 180, 100 180 Z" stroke="var(--color-henna-rich)" strokeWidth="3" fill="none" variants={drawContinuous} custom={0} initial="hidden" animate="visible" />
      <motion.path d="M 100 160 C 160 160, 160 90, 100 90 C 70 90, 70 60, 100 60" stroke="var(--color-henna-rich)" strokeWidth="2" strokeDasharray="5 5" fill="none" variants={drawContinuous} custom={1} initial="hidden" animate="visible" />
      <motion.circle cx="100" cy="120" r="15" stroke="var(--color-henna-rich)" strokeWidth="2" fill="none" variants={drawContinuous} custom={2} initial="hidden" animate="visible" />
      <motion.circle cx="100" cy="120" r="5" stroke="var(--color-henna-rich)" fill="var(--color-henna-rich)" variants={drawContinuous} custom={3} initial="hidden" animate="visible" />
    </motion.svg>
  </div>
);

export const VineLoop: React.FC = () => (
  <div style={{ ...svgStyle, overflow: 'hidden' }}>
    <motion.svg viewBox="0 0 100 400" style={{ width: '30vw', maxWidth: '300px', position: 'absolute', left: '0%', top: '0%' }}>
      {/* Intense Vine Pattern */}
      <motion.path d="M 50 0 C 80 50, 20 100, 50 150 C 80 200, 20 250, 50 300 C 80 350, 20 400, 50 450" stroke="var(--color-henna-light)" strokeWidth="3" fill="none" variants={drawContinuous} custom={0} initial="hidden" animate="visible" />
      <motion.path d="M 50 50 C 70 40, 80 60, 50 70" stroke="var(--color-henna-light)" strokeWidth="2" fill="none" variants={drawContinuous} custom={1} initial="hidden" animate="visible" />
      <motion.path d="M 50 120 C 30 110, 20 130, 50 140" stroke="var(--color-henna-light)" strokeWidth="2" fill="none" variants={drawContinuous} custom={2} initial="hidden" animate="visible" />
      <motion.path d="M 50 200 C 70 190, 80 210, 50 220" stroke="var(--color-henna-light)" strokeWidth="2" fill="none" variants={drawContinuous} custom={3} initial="hidden" animate="visible" />
      <motion.path d="M 50 270 C 30 260, 20 280, 50 290" stroke="var(--color-henna-light)" strokeWidth="2" fill="none" variants={drawContinuous} custom={4} initial="hidden" animate="visible" />
    </motion.svg>
  </div>
);

export const GeometricLoop: React.FC = () => (
  <div style={{ ...svgStyle, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <motion.svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} variants={pulseContinuous} initial="hidden" animate="visible">
      {/* Intense Geometric / Moroccan Pattern */}
      <motion.rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={drawContinuous} custom={0} />
      <motion.rect x="50" y="50" width="100" height="100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={drawContinuous} custom={1} />
      <motion.circle cx="100" cy="100" r="70" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="4 4" fill="none" variants={drawContinuous} custom={2} />
      <motion.line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-gold)" strokeWidth="1" fill="none" variants={drawContinuous} custom={3} />
      <motion.line x1="0" y1="100" x2="200" y2="100" stroke="var(--color-gold)" strokeWidth="1" fill="none" variants={drawContinuous} custom={4} />
    </motion.svg>
  </div>
);
