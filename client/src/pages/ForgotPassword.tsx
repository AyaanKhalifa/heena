import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GeometricLoop } from '../components/HennaMotifs';
import { FaKey, FaEnvelope } from 'react-icons/fa';

const pageVariants: any = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const inputStyle: React.CSSProperties = {
  padding: '16px 16px 16px 45px',
  border: '1px solid rgba(139, 69, 19, 0.2)',
  borderRadius: '12px',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.3s ease',
  outline: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  color: 'var(--color-henna-dark)'
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setIsSubmitting(true);
    
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      
      await sendPasswordResetEmail(auth, email, {
        url: 'http://localhost:5173/login', // Corrected port if needed
        handleCodeInApp: false
      });
      
      setStatus('Success! Check your email for a reset link.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setStatus('We could not find an account with that email.');
      } else {
        setStatus('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === fieldName ? 'var(--color-gold)' : 'rgba(139, 69, 19, 0.2)',
    boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(212, 175, 55, 0.15)' : '0 4px 6px rgba(0,0,0,0.02)',
    backgroundColor: focusedField === fieldName ? '#fff' : 'rgba(255, 255, 255, 0.8)'
  });

  const isError = status && !status.includes('Success');

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
      style={{ 
        padding: '80px 20px', 
        flexGrow: 1, 
        backgroundColor: '#faf9f6', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <GeometricLoop />
      
      {/* Abstract Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,69,19,0.05) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          maxWidth: '480px', 
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)',
          padding: '3rem', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(139, 69, 19, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '20px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              transform: 'rotate(-10deg)'
            }}
          >
            <FaKey size={30} color="var(--color-gold)" style={{ transform: 'rotate(10deg)' }} />
          </motion.div>
          <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0', color: 'var(--color-henna-dark)', fontFamily: 'var(--font-heading)' }}>Forgot Password?</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--color-henna-dark)', fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: focusedField === 'email' ? 'var(--color-gold)' : '#aaa', transition: 'color 0.3s ease' }}>
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="amira@example.com"
                required 
                style={getInputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')} 
              />
            </div>
          </div>
          
          <AnimatePresence>
            {status && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  backgroundColor: isError ? 'rgba(255, 0, 0, 0.05)' : 'rgba(0, 128, 0, 0.05)',
                  borderLeft: `4px solid ${isError ? '#ff4d4f' : '#52c41a'}`,
                  color: isError ? '#cf1322' : '#389e0d',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                {status}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '12px', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-henna-rich) 100%)',
              border: 'none',
              color: '#fff'
            }}
          >
            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px dashed rgba(212, 175, 55, 0.4)' }}>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>
            Not receiving the email or having trouble?
          </p>
          <motion.a 
            href="https://www.instagram.com/heena__byamira__16?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw%3D%3D#" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--color-henna-rich)', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: 'var(--color-cream)',
              color: 'var(--color-henna-dark)', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              borderRadius: '20px',
              border: '1px solid var(--color-henna-rich)',
              boxShadow: '0 4px 10px rgba(212, 175, 55, 0.2)',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
          >
            DM me directly on Instagram
          </motion.a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ 
              color: 'var(--color-henna-rich)', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'border-color 0.3s ease'
            }} onMouseOver={e => e.currentTarget.style.borderBottom = '2px solid var(--color-gold)'} onMouseOut={e => e.currentTarget.style.borderBottom = '2px solid transparent'}>
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
