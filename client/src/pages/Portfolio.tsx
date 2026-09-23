import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaisleyLoop } from '../components/HennaMotifs';

interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const pageVariants: any = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 }
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
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 50 } }
};

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        const q = query(collection(db, 'portfolio'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedItems: PortfolioItem[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() } as PortfolioItem);
        });
        setItems(fetchedItems);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: 'var(--color-cream)', position: 'relative' }}
    >
      <PaisleyLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '3rem' }}
        >
          Portfolio
        </motion.h2>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading portfolio...</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2rem' }}
          >
            {items.map(item => (
              <motion.div key={item.id} variants={itemVariants} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: '#fff' }}>
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  src={item.image_url} 
                  alt={item.title} 
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--color-henna-rich)' }}>{item.title}</h3>
                  <p style={{ color: '#666' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Portfolio;
