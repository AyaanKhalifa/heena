import React from 'react';
import { motion } from 'framer-motion';
import { MandalaLoop } from '../components/HennaMotifs';

const pageVariants: any = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.05 }
};

const pageTransition: any = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const About: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#fff', position: 'relative' }}
    >
      <MandalaLoop />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '3rem' }}
        >
          The Artist
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ maxWidth: '800px', textAlign: 'left', lineHeight: '1.8', fontSize: '1.1rem', color: '#444' }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            Hello! I'm <strong>Amira Shaikh</strong>, a professional Mehndi Artist based in <strong>Chikhli, Surkhai</strong>. With over 2 years of dedicated work experience in the beautiful art of Mehndi, I specialize in creating bespoke, intricate designs that celebrate life's most precious moments.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Whether you are looking for dense bridal patterns, festive designs, or custom body art, my passion lies in blending traditional Indian motifs with contemporary styles to craft a look that is uniquely yours. Every stroke is applied with precision, love, and a commitment to making your special day perfect.
          </p>
          <h3 style={{ color: 'var(--color-henna-rich)', fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem' }}>100% Organic Heena</h3>
          <p>
            Your safety and the quality of the stain are my top priorities. That is why I exclusively use 100% natural, organic henna paste. Hand-mixed with essential oils, my henna is completely free of harmful chemicals (no PPD), ensuring a safe application and a stunning, dark maroon stain that lasts.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
