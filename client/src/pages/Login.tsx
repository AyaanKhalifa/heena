import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { MandalaLoop } from '../components/HennaMotifs';
import { useAuth } from '../context/AuthContext';
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        login(data.user, data.token);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error, please try again later');
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
      <MandalaLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: 'var(--color-cream)', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
        >
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Sign in to manage your bookings.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Email or Phone Number</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                style={getInputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')} 
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot?</Link>
              </div>
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
            
            {error && <p style={{ color: 'red', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', fontSize: '1.1rem', marginTop: '0.5rem' }}
            >
              Sign In
            </motion.button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-henna-rich)', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
