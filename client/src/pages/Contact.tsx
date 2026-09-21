import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { GeometricLoop, VineLoop } from '../components/HennaMotifs';
import { useAuth } from '../context/AuthContext';

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

const Contact: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    date: '',
    services: 'Bridal Mehndi',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending inquiry...');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, user_id: user ? user.id : null }),
      });

      if (response.ok) {
        setSuccessAnim(true);
        setStatus('');
        setFormData({ name: user?.name || '', email: user?.email || '', phone: '', date: '', services: 'Bridal Mehndi', message: '' });
      } else {
        setStatus('Failed to send inquiry. Please try again or call us.');
      }
    } catch (error) {
      setStatus('Network error. Please try again.');
    }
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === fieldName ? 'var(--color-gold)' : '#ddd',
    boxShadow: focusedField === fieldName ? '0 0 0 3px rgba(212, 175, 55, 0.15)' : 'none'
  });

  if (successAnim) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}
      >
        <VineLoop />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ textAlign: 'center', zIndex: 1, backgroundColor: 'var(--color-cream)', padding: '4rem 3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>Request Sent!</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-henna-dark)' }}>Our team will contact you soon!</p>
          <button onClick={() => setSuccessAnim(false)} className="btn-primary" style={{ marginTop: '2rem' }}>Book Another</button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#fff', position: 'relative' }}
    >
      <GeometricLoop />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '3rem' }}
        >
          Book Your Session
        </motion.h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ backgroundColor: 'var(--color-cream)', padding: '3rem', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}
          >
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--color-henna-dark)' }}>Get in Touch</h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '2rem' }}>
              <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginTop: '3px' }}><FaMapMarkerAlt /></div>
              <div>
                <h4 style={{ margin: '0 0 5px', color: 'var(--color-henna-dark)' }}>Location</h4>
                <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>Chikhli, Surkhai<br/>Available for travel worldwide</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '2rem' }}>
              <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginTop: '3px' }}><FaPhoneAlt /></div>
              <div>
                <h4 style={{ margin: '0 0 5px', color: 'var(--color-henna-dark)' }}>Phone / WhatsApp</h4>
                <p style={{ margin: 0, color: '#666' }}>+91 123 456 7890</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginTop: '3px' }}><FaCalendarAlt /></div>
              <div>
                <h4 style={{ margin: '0 0 5px', color: 'var(--color-henna-dark)' }}>Availability</h4>
                <p style={{ margin: 0, color: '#666' }}>Booking 6-12 months in advance for Bridal Mehndi</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Full Name *</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required 
                  style={getInputStyle('name')}
                  onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Email Address (Optional)</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    style={getInputStyle('email')}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Phone Number *</label>
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                    style={getInputStyle('phone')}
                    onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} 
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Event Date *</label>
                  <input 
                    type="date" name="date" value={formData.date} onChange={handleChange} required 
                    style={getInputStyle('date')}
                    onFocus={() => setFocusedField('date')} onBlur={() => setFocusedField('')} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Service Type *</label>
                  <select 
                    name="services" value={formData.services} onChange={handleChange} required
                    style={getInputStyle('services')}
                    onFocus={() => setFocusedField('services')} onBlur={() => setFocusedField('')}
                  >
                    <option value="Bridal Mehndi">Bridal Mehndi</option>
                    <option value="Festival Mehndi">Festival Mehndi</option>
                    <option value="Party Mehndi">Party Mehndi</option>
                    <option value="Custom Heena Design">Custom Heena Design</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-henna-dark)' }}>Additional Details</label>
                <textarea 
                  name="message" value={formData.message} onChange={handleChange} rows={4} 
                  style={{ ...getInputStyle('message'), resize: 'vertical' }}
                  onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField('')} 
                />
              </div>
              
              {status && <p style={{ color: status.includes('Failed') || status.includes('error') ? 'red' : 'green', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>{status}</p>}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '15px', borderRadius: '8px', fontSize: '1.1rem' }}
              >
                Submit Request
              </motion.button>
            </form>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
