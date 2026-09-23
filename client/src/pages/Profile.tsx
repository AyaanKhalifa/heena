import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GeometricLoop } from '../components/HennaMotifs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase';

const pageVariants: any = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition: any = { type: 'tween', ease: 'anticipate', duration: 0.5 };

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Password update state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      return setPasswordError('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return setPasswordError('Password must be at least 6 characters');
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email) {
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        
        setPasswordSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ padding: '120px 20px 60px', flexGrow: 1, backgroundColor: 'var(--color-cream)', position: 'relative', display: 'flex', justifyContent: 'center' }}
    >
      <GeometricLoop />
      
      <div style={{ maxWidth: '800px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '4px solid var(--color-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-henna-dark)' }}>My Profile</h2>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>Welcome back, <strong style={{ color: 'var(--color-henna-rich)' }}>{user.name}</strong>!</p>
              <p style={{ color: '#666', fontSize: '1rem' }}>{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="btn-secondary"
            >
              Log Out
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-henna-dark)' }}>My Bookings</h3>
          
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-cream)', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>You don't have any bookings yet.</p>
              <button onClick={() => navigate('/contact')} className="btn-primary">Book an Appointment</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-henna-rich)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{booking.service_type || booking.service}</h4>
                    <p style={{ color: '#666', margin: 0 }}>Date: {new Date(booking.event_date || booking.date).toLocaleDateString()}</p>
                    <p style={{ color: '#999', fontSize: '0.85rem', margin: '5px 0 0' }}>Requested: {new Date(booking.created_at || booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    backgroundColor: booking.status === 'approved' ? '#e6f4ea' : booking.status === 'rejected' ? '#fce8e6' : '#fef7e0',
                    color: booking.status === 'approved' ? '#137333' : booking.status === 'rejected' ? '#c5221f' : '#b08d00'
                  }}>
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '3rem 0 2rem' }} />

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-henna-dark)' }}>Update Password</h3>
          <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '400px' }}>
            {passwordError && <div style={{ color: '#c5221f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fce8e6', borderRadius: '4px' }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ color: '#137333', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e6f4ea', borderRadius: '4px' }}>{passwordSuccess}</div>}
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-henna-dark)', fontWeight: 'bold' }}>Current Password</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-henna-dark)', fontWeight: 'bold' }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-henna-dark)', fontWeight: 'bold' }}>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Update Password</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
