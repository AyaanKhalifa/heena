import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VineLoop } from '../components/HennaMotifs';
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

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.error || 'Signup failed');
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
      <VineLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'var(--color-cream)', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
        >
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Join to book and manage your appointments.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                style={getInputStyle('name')} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                  style={getInputStyle('email')} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                  style={getInputStyle('phone')} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
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
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: 'var(--color-henna-dark)', fontSize: '0.95rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
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
            
            {error && <p style={{ color: 'red', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', fontSize: '1.1rem', marginTop: '0.5rem' }}
            >
              Sign Up
            </motion.button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-henna-rich)', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;
