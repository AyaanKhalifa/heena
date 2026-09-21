import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, token, navigate]);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#f5f5f5' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-henna-dark)' }}>Notifications</h2>
        
        {notifications.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#666' }}>
            You have no notifications yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notif) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  backgroundColor: '#fff', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  borderLeft: notif.is_read ? '4px solid transparent' : '4px solid var(--color-gold)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: 0, color: notif.is_read ? '#666' : 'var(--color-henna-dark)', fontWeight: notif.is_read ? 'normal' : 'bold' }}>
                    {notif.message}
                  </p>
                  <small style={{ color: '#999' }}>{new Date(notif.created_at).toLocaleString()}</small>
                </div>
                {!notif.is_read && (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    style={{ background: 'none', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Mark as Read
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
