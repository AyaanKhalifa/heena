import React from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush } from 'react-icons/fa';

// Floating SVG henna motif for background
const FloatingMotif: React.FC<{ delay: number; top: string; left: string; size: number }> = ({ delay, top, left, size }) => (
  <motion.svg
    animate={{ y: [0, -15, 0], opacity: [0.1, 0.2, 0.1], rotate: [0, 15, 0] }}
    transition={{ duration: 6 + delay, ease: "easeInOut", repeat: Infinity, delay }}
    viewBox="0 0 60 60"
    style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, top, left, pointerEvents: 'none' }}
  >
    <path d="M 30 5 C 35 15, 50 20, 55 30 C 50 40, 35 45, 30 55 C 25 45, 10 40, 5 30 C 10 20, 25 15, 30 5 Z" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" />
    <circle cx="30" cy="30" r="6" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
    <circle cx="30" cy="30" r="2" fill="var(--color-gold)" />
  </motion.svg>
);

const Maintenance: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-henna-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
      color: 'var(--color-cream)'
    }}>
      
      {/* Background Decor */}
      <FloatingMotif delay={0} top="15%" left="10%" size={80} />
      <FloatingMotif delay={2} top="70%" left="80%" size={120} />
      <FloatingMotif delay={1} top="20%" left="85%" size={60} />
      <FloatingMotif delay={3} top="80%" left="15%" size={70} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: 'rgba(62, 30, 28, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-gold)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 1
        }}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '2px solid var(--color-gold)'
          }}
        >
          <FaPaintBrush size={32} color="var(--color-gold)" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ 
            fontSize: '3rem', 
            margin: '0 0 1rem 0', 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-gold)'
          }}
        >
          Preparing Something Beautiful
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-cream)', 
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}
        >
          Our website is currently undergoing a little touch-up. Just like intricate henna takes time to perfect, we are working hard behind the scenes to bring you an enhanced experience.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            borderTop: '1px solid rgba(212, 175, 55, 0.3)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.9rem',
            color: 'var(--color-gold)'
          }}
        >
          We'll be back online shortly
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
