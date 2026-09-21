import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GeometricLoop } from '../components/HennaMotifs';

const pageVariants: any = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.05 }
};

const inputStyle: React.CSSProperties = {
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  outline: 'none'
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing...');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('Password reset link has been sent to your email (Check server console).');
      } else {
        setStatus(data.error || 'Failed to send reset link.');
      }
    } catch (err) {
      setStatus('Server error, please try again later');
    }
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === fieldName ? 'var(--color-gold)' : '#ddd',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(212, 175, 55, 0.15)' : 'none'
  });

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
      style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#fff', position: 'relative' }}
    >
      <GeometricLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: 'var(--color-cream)', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
        >
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Enter your email to receive a reset link.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                style={getInputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')} 
              />
            </div>
            
            {status && (
              <p style={{ color: status.includes('error') || status.includes('Failed') ? 'red' : 'green', fontSize: '0.95rem', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
                {status}
              </p>
            )}
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', fontSize: '1.1rem', marginTop: '0.5rem' }}
            >
              Send Reset Link
            </motion.button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            Remembered your password? <Link to="/login" style={{ color: 'var(--color-henna-rich)', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
