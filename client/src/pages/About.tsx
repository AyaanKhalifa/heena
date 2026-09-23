import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MandalaLoop } from '../components/HennaMotifs';
import { FaInstagram, FaMapMarkerAlt, FaPaintBrush } from 'react-icons/fa';

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

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + (i * 0.1), duration: 0.5 }
  })
};

const About: React.FC = () => {
  const [aboutText, setAboutText] = useState(`Loading our story...`);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cDoc = await getDoc(doc(db, 'settings', 'website_content'));
        if (cDoc.exists() && cDoc.data().aboutText) {
          setAboutText(cDoc.data().aboutText);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

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
          style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', color: 'var(--color-henna-dark)' }}
        >
          Amira Shaikh
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.2rem', color: 'var(--color-gold)', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPaintBrush /> Professional Mehndi Artist ✨
        </motion.p>

        {/* Instagram Stats Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            marginBottom: '3rem',
            flexWrap: 'wrap',
            padding: '2rem',
            backgroundColor: 'var(--color-cream)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            width: '100%',
            maxWidth: '600px'
          }}
        >
          {[
            { value: '97', label: 'posts' },
            { value: '153', label: 'followers' },
            { value: '47', label: 'following' }
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={statVariants} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-henna-rich)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </motion.div>
          ))}
          
          <motion.div 
            custom={3} variants={statVariants} 
            style={{ width: '100%', borderTop: '1px solid #e0d8c3', paddingTop: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}
          >
             <a 
                href="https://www.instagram.com/heena__byamira__16?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw%3D%3D#" 
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
             >
               <FaInstagram /> Follow @heena__byamira__16
             </a>
             <div style={{ fontSize: '1rem', color: '#555', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
               <FaMapMarkerAlt color="var(--color-gold)" /> 📍 Chikhli, surkhai
             </div>
             <div style={{ fontWeight: 'bold', color: 'var(--color-henna-dark)', marginTop: '5px' }}>
               ✨ Bridal | Festival | Custom
             </div>
             <div style={{ fontStyle: 'italic', color: '#777' }}>
               2 year work experience 🌞 | ✍🏻 DM for booking
             </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ maxWidth: '800px', textAlign: 'left', lineHeight: '1.8', fontSize: '1.1rem', color: '#444' }}
        >
          <div style={{ 
            padding: '2rem', 
            borderLeft: '4px solid var(--color-gold)', 
            backgroundColor: '#fafafa',
            borderRadius: '0 8px 8px 0',
            marginBottom: '3rem'
          }}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {aboutText}
            </p>
          </div>
          
          <h3 style={{ color: 'var(--color-henna-rich)', fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--color-gold)' }}>🌿</span> 100% Organic Heena
          </h3>
          <p>
            Your safety and the quality of the stain are my top priorities. That is why I exclusively use 100% natural, organic henna paste. Hand-mixed with essential oils, my henna is completely free of harmful chemicals (no PPD), ensuring a safe application and a stunning, dark maroon stain that lasts.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
