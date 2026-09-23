import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Reviews from '../components/Reviews';
import MandalaAnimation from '../components/MandalaAnimation';

const pageVariants: any = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition: any = {
  type: 'tween' as const,
  ease: 'anticipate',
  duration: 0.5
};

// Floating SVG henna motifs instead of emoji
const FloatingMotif: React.FC<{ delay: number; top: string; left: string; size: number }> = ({ delay, top, left, size }) => (
  <motion.svg
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.35, 0.15], rotate: [0, 15, 0] }}
    transition={{ duration: 5 + delay, ease: "easeInOut", repeat: Infinity, delay }}
    viewBox="0 0 60 60"
    style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, top, left, pointerEvents: 'none' }}
  >
    <path d="M 30 5 C 35 15, 50 20, 55 30 C 50 40, 35 45, 30 55 C 25 45, 10 40, 5 30 C 10 20, 25 15, 30 5 Z" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" />
    <circle cx="30" cy="30" r="6" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
    <circle cx="30" cy="30" r="2" fill="var(--color-gold)" />
  </motion.svg>
);

// SVG mini henna icons for "Why Choose" cards
const HennaIcon: React.FC<{ type: string }> = ({ type }) => {
  const s = { width: '48px', height: '48px', marginBottom: '1rem' };
  const c = 'var(--color-henna-rich)';
  switch (type) {
    case 'leaf':
      return <svg viewBox="0 0 48 48" style={s}><path d="M 10 38 C 10 10, 38 5, 42 5 C 42 5, 38 38, 10 38 Z" stroke={c} strokeWidth="2" fill="none"/><path d="M 10 38 C 18 28, 28 20, 42 5" stroke={c} strokeWidth="1.5" fill="none"/><path d="M 16 32 C 20 28, 24 22, 30 14" stroke={c} strokeWidth="1" fill="none" strokeDasharray="3 3"/></svg>;
    case 'paisley':
      return <svg viewBox="0 0 48 48" style={s}><path d="M 24 42 C 40 42, 42 20, 24 20 C 14 20, 12 10, 24 8 C 32 8, 36 14, 36 14" stroke={c} strokeWidth="2" fill="none"/><circle cx="24" cy="30" r="4" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="24" cy="30" r="1.5" fill={c}/></svg>;
    case 'mandala':
      return <svg viewBox="0 0 48 48" style={s}><circle cx="24" cy="24" r="18" stroke={c} strokeWidth="2" fill="none"/><circle cx="24" cy="24" r="10" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="3" fill={c}/><path d="M 24 6 L 24 14 M 24 34 L 24 42 M 6 24 L 14 24 M 34 24 L 42 24" stroke={c} strokeWidth="1.5"/></svg>;
    case 'lotus':
      return <svg viewBox="0 0 48 48" style={s}><path d="M 24 38 C 24 28, 16 18, 8 12 C 12 24, 18 30, 24 38 Z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M 24 38 C 24 28, 32 18, 40 12 C 36 24, 30 30, 24 38 Z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M 24 38 C 24 24, 24 14, 24 6" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="24" cy="38" r="2" fill={c}/></svg>;
    case 'swirl':
      return <svg viewBox="0 0 48 48" style={s}><path d="M 24 8 C 38 8, 42 24, 30 30 C 22 34, 14 28, 18 20 C 20 16, 26 16, 26 20" stroke={c} strokeWidth="2" fill="none"/><circle cx="26" cy="20" r="2" fill={c}/></svg>;
    case 'hand':
      return <svg viewBox="0 0 48 48" style={s}><path d="M 18 42 L 18 18 C 18 14, 24 14, 24 18 L 24 12 C 24 8, 30 8, 30 12 L 30 18 L 30 14 C 30 10, 36 10, 36 14 L 36 28 C 36 36, 28 42, 18 42 Z" stroke={c} strokeWidth="2" fill="none"/><path d="M 24 22 L 24 30 M 30 22 L 30 28" stroke={c} strokeWidth="1" strokeDasharray="2 2"/></svg>;
    default:
      return null;
  }
};

const counterVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: 'spring' as const, stiffness: 50 }
  })
};

const Home: React.FC = () => {
  const [content, setContent] = useState({
    heroHeading: 'Heena by Amira',
    heroSubtext: 'Exquisite, personalized mehndi for your special moments. Based in Chikhli, Surkhai.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cDoc = await getDoc(doc(db, 'settings', 'website_content'));
        if (cDoc.exists()) {
          const data = cDoc.data();
          setContent(prev => ({
            ...prev,
            heroHeading: data.heroHeading || prev.heroHeading,
            heroSubtext: data.heroSubtext || prev.heroSubtext
          }));
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
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(62, 30, 28, 0.7), rgba(62, 30, 28, 0.7)), url(/assets/hero_mehndi_1789986932139.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'var(--color-cream)',
        textAlign: 'center',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating SVG Henna Motifs */}
        <FloatingMotif delay={0} top="10%" left="5%" size={60} />
        <FloatingMotif delay={1} top="25%" left="85%" size={80} />
        <FloatingMotif delay={2} top="50%" left="8%" size={50} />
        <FloatingMotif delay={0.5} top="65%" left="90%" size={70} />
        <FloatingMotif delay={1.5} top="80%" left="15%" size={55} />
        <FloatingMotif delay={3} top="40%" left="75%" size={45} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ color: 'var(--color-gold-light)', fontSize: '1.1rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1rem' }}
          >
            Professional Mehndi Artist
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ color: 'var(--color-gold)', fontSize: '5rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {content.heroHeading}
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ height: '2px', background: 'var(--color-gold)', margin: '0 auto 1.5rem' }}
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ fontSize: '1.4rem', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}
          >
            {content.heroSubtext}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
          >
            <Link to="/portfolio" className="btn-primary">View Portfolio</Link>
            <Link to="/contact" className="btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>DM for Booking</Link>
          </motion.div>

          {/* Scroll indicator - SVG chevron */}
          <motion.svg
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            viewBox="0 0 24 24"
            style={{ marginTop: '4rem', width: '32px', height: '32px', opacity: 0.6 }}
          >
            <path d="M6 9l6 6 6-6" stroke="var(--color-gold)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </motion.svg>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 20px', backgroundColor: 'var(--color-henna-dark)', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}
          >
            {[
              { number: '2+', label: 'Years Experience' },
              { number: '500+', label: 'Happy Clients' },
              { number: '100%', label: 'Organic Heena' },
              { number: '96', label: 'Instagram Posts' }
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={counterVariants} style={{ padding: '2rem' }}>
                <motion.h2
                  style={{ color: 'var(--color-gold)', fontSize: '3.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}
                >
                  {stat.number}
                </motion.h2>
                <p style={{ color: 'var(--color-cream)', fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ padding: '100px 20px', backgroundColor: '#fff' }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-henna-dark)' }}
          >
            Why Choose Amira?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '4rem', color: '#666', fontSize: '1.2rem' }}
          >
            Every detail matters when it comes to your special day.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
          >
            {[
              { iconType: 'leaf', title: 'Premium Quality', desc: 'Only 100% natural, organic henna paste. No chemicals, no PPD — just pure art that gives a rich, dark stain lasting 2-3 weeks.' },
              { iconType: 'paisley', title: 'Custom Designs', desc: 'Every design is uniquely crafted for you. From traditional rajasthani to modern minimal — your vision, my artistry.' },
              { iconType: 'mandala', title: 'Bridal Specialist', desc: '2 years specializing in intricate bridal mehndi. Full hands, feet, and personalized elements to tell your love story.' },
              { iconType: 'lotus', title: 'On-Location Service', desc: 'Based in Chikhli, Surkhai. Available for home visits, venue appointments, and destination events.' },
              { iconType: 'swirl', title: 'Always On Time', desc: 'Your schedule is my priority. Punctual arrivals, efficient application, and no rushed work — ever.' },
              { iconType: 'hand', title: 'DM for Booking', desc: 'Quick and easy booking through Instagram DM. Share your date, design ideas, and get a quote within hours.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={counterVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                style={{
                  padding: '2.5rem',
                  borderRadius: '16px',
                  backgroundColor: 'var(--color-cream)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
              >
                <HennaIcon type={item.iconType} />
                <h3 style={{ color: 'var(--color-henna-rich)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{item.title}</h3>
                <p style={{ color: '#555', lineHeight: '1.7' }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Henna Drawing Animation Section */}
      <MandalaAnimation />

      {/* Reviews Section */}
      <Reviews />

      {/* CTA Banner */}
      <section style={{
        padding: '100px 20px',
        backgroundImage: 'linear-gradient(rgba(62, 30, 28, 0.85), rgba(62, 30, 28, 0.85)), url(/assets/bridal_mehndi_1789986953993.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ color: 'var(--color-gold)', fontSize: '3rem', marginBottom: '1.5rem' }}
          >
            Ready to Get Beautiful Heena?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ color: 'var(--color-cream)', fontSize: '1.3rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}
          >
            Whether it's your wedding, a festival, or a special celebration — let's create something unforgettable together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a href="https://www.instagram.com/heena__byamira__16?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '1.2rem', padding: '16px 36px' }}>
              DM on Instagram
            </a>
            <Link to="/contact" className="btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontSize: '1.2rem', padding: '16px 36px' }}>
              Book via Form
            </Link>
          </motion.div>
        </div>
      </section>
      
    </motion.div>
  );
};

export default Home;
