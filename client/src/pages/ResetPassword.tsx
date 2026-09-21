import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GeometricLoop } from '../components/HennaMotifs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing...');

    if (password !== confirmPassword) {
      return setStatus('Passwords do not match');
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('Password has been successfully reset. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus(data.error || 'Failed to reset password.');
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
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Set New Password</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Enter your new password below.</p>
          
          {!token ? (
            <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>Invalid or missing token.</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                    style={{ ...getInputStyle('password'), paddingRight: '45px' }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', padding: 0 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required 
                    style={{ ...getInputStyle('confirmPassword'), paddingRight: '45px' }}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', padding: 0 }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              {status && (
                <p style={{ color: status.includes('error') || status.includes('Failed') || status.includes('not match') ? 'red' : 'green', fontSize: '0.95rem', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
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
                Reset Password
              </motion.button>
            </form>
          )}
          
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            Remembered your password? <Link to="/login" style={{ color: 'var(--color-henna-rich)', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
