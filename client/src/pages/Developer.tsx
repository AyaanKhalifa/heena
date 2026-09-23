import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaInstagram, FaGlobe, FaArrowLeft, FaHome, FaRocket, FaLaptopCode, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Developer: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '30px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    zIndex: 100,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Premium, vibrant cool-to-warm gradient
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      
      {/* Navigation Controls */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', display: 'flex', gap: '15px', zIndex: 100 }}>
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)} 
          style={navButtonStyle}
        >
          <FaArrowLeft /> Back
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')} 
          style={navButtonStyle}
        >
          <FaHome /> Home
        </motion.button>
      </div>

      {/* Hero Section: Personal Identity (Name on Top) */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 20px' }}>
        <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, y: yBg }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(38, 208, 206, 0.4) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26, 41, 128, 0.6) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)' }} />
        </motion.div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              width: '120px', height: '120px', borderRadius: '30px', 
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <FaLaptopCode size={50} color="#fff" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', margin: '0 0 0.5rem', fontWeight: '900', textShadow: '0 10px 30px rgba(0,0,0,0.3)', letterSpacing: '-2px' }}
          >
            Ayaan Khalifa
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#FFD700', margin: '0 0 3rem', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            Lead Developer & UI/UX Designer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.6)' }}
          >
            <p style={{ margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Scroll to Explore</p>
            <FaChevronDown size={24} />
          </motion.div>
        </div>
      </section>

      {/* Business Pitch Section */}
      <section style={{ padding: '100px 20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            style={{ margin: '0 auto 2rem', display: 'inline-block', padding: '20px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '50%', color: '#FFD700' }}
          >
             <FaRocket size={40} />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 1.5rem 0', fontWeight: '900', lineHeight: '1.2' }}
          >
            Ready to Scale Your<br/>Business Online?
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '1.2rem', margin: '0 auto 3rem', fontWeight: '400', maxWidth: '700px', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}
          >
            Looking for a stunning, high-performance website to scale your brand? Let's turn your vision into an incredible digital reality. I build digital experiences that convert visitors into loyal customers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '4rem' }}
          >
            {['Custom High-End Design', 'Blazing Fast Performance', 'Mobile Responsive Architecture'].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '30px' }}>
                <FaCheckCircle color="#FFD700" size={20} /> {feature}
              </div>
            ))}
          </motion.div>
          
          <motion.a
            href="https://www.instagram.com/webcraft4u"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-block',
              padding: '20px 50px',
              backgroundColor: '#FFD700',
              color: '#000',
              fontWeight: '900',
              fontSize: '1.3rem',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            DM Me to Start Your Project
          </motion.a>
        </div>
      </section>

      {/* Links Section */}
      <section style={{ padding: '100px 20px 120px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.h4 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 'bold' }}
          >
            Connect With Me
          </motion.h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <FaGlobe />, label: 'View Portfolio', sub: 'ayaankhalifa.github.io', href: 'https://ayaankhalifa.github.io/Portfolio/', bg: 'rgba(255,255,255,0.1)', hover: 'rgba(255,255,255,0.2)' },
              { icon: <FaInstagram />, label: 'Agency Profile', sub: '@webcraft4u', href: 'https://www.instagram.com/webcraft4u', bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', hover: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
              { icon: <FaInstagram />, label: 'Personal Profile', sub: '@aynklf', href: 'https://www.instagram.com/aynklf/', bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', hover: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                whileHover={{ scale: 1.02, x: 10, boxShadow: '0 15px 30px rgba(0,0,0,0.2)', background: link.hover }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '20px', padding: '24px',
                  background: link.bg, borderRadius: '20px', color: '#fff', textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ fontSize: '2.5rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '15px' }}>{link.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '5px' }}>{link.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>{link.sub}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developer;
