import React from 'react';
import { motion } from 'framer-motion';
import { VineLoop } from '../components/HennaMotifs';

const pageVariants: any = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

const pageTransition: any = {
  type: 'tween' as const,
  ease: 'anticipate',
  duration: 0.5
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const cardVariants: any = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 50 } }
};

const Services: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: 'var(--color-cream)', position: 'relative' }}
    >
      <VineLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}
        >
          Our Packages
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}
        >
          Tailored henna experiences for every occasion.
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}
        >
          
          <motion.div variants={cardVariants} whileHover={{ y: -10 }} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-gold)' }}>
            <h3 style={{ color: 'var(--color-henna-dark)', fontSize: '1.8rem', marginBottom: '1rem' }}>Bridal Heena</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', minHeight: '80px' }}>Intricate and dense designs covering hands, arms, and feet. Includes personalized elements like portraits or skylines.</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-henna-rich)', marginBottom: '1.5rem' }}>Starts at $250</p>
            <ul style={{ listStylePosition: 'inside', color: '#555', marginBottom: '2rem', lineHeight: '2' }}>
              <li>Full hands (front and back)</li>
              <li>Half legs</li>
              <li>Organic Paste Included</li>
            </ul>
            <a href="/contact" className="btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Book Bridal</a>
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover={{ y: -10 }} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-henna-rich)' }}>
            <h3 style={{ color: 'var(--color-henna-dark)', fontSize: '1.8rem', marginBottom: '1rem' }}>Party Heena</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', minHeight: '80px' }}>Elegant designs perfect for Sangeet guests, bridesmaids, or festival attendees.</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-henna-rich)', marginBottom: '1.5rem' }}>$100 / Hour</p>
            <ul style={{ listStylePosition: 'inside', color: '#555', marginBottom: '2rem', lineHeight: '2' }}>
              <li>Minimum 2 hours</li>
              <li>10-15 simple designs per hour</li>
              <li>Organic Paste Included</li>
            </ul>
            <a href="/contact" className="btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Book Party</a>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
