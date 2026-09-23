import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaCommentDots } from 'react-icons/fa';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '917623084408'; // from the user request
  const message = 'Hello Amira! I would like to book a henna appointment.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              width: '320px',
              backgroundColor: '#1E1E1E',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              fontFamily: 'sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ backgroundColor: '#00a884', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaCommentDots size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Heena by Amira</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ padding: '20px', backgroundColor: '#111' }}>
              <div style={{ 
                backgroundColor: '#262626', 
                padding: '16px', 
                borderRadius: '8px 8px 8px 0', 
                color: 'white',
                marginBottom: '10px'
              }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Hi! 👋 How can we help you with your mehndi booking today?
                </p>
              </div>
            </div>

            {/* Footer / CTA */}
            <div style={{ padding: '16px', backgroundColor: '#111' }}>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <FaWhatsapp size={20} /> Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <FaTimes size={28} /> : <FaWhatsapp size={32} />}
      </button>
    </div>
  );
};

export default WhatsAppWidget;
