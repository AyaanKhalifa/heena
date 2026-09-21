import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'portfolio'>('bookings');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Portfolio form state
  const [newImage, setNewImage] = useState({ image_url: '', title: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch Bookings
        const resBookings = await fetch('http://localhost:5000/api/bookings', { headers });
        if (resBookings.ok) setBookings(await resBookings.json());
        
        // Fetch Users
        const resUsers = await fetch('http://localhost:5000/api/users', { headers });
        if (resUsers.ok) setUsers(await resUsers.json());

        // Fetch Portfolio
        const resPortfolio = await fetch('http://localhost:5000/api/portfolio');
        if (resPortfolio.ok) setPortfolio(await resPortfolio.json());

      } catch (err) {
        setError('Server error while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, navigate]);

  // --- BOOKING ACTIONS ---
  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) { console.error(err); }
  };

  const deleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setBookings(bookings.filter(b => b.id !== id));
    } catch (err) { console.error(err); }
  };

  // --- PORTFOLIO ACTIONS ---
  const addPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newImage)
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio([{ id: data.id, ...newImage, created_at: new Date().toISOString() }, ...portfolio]);
        setNewImage({ image_url: '', title: '', description: '' });
      }
    } catch (err) { console.error(err); }
  };

  const deletePortfolioItem = async (id: number) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPortfolio(portfolio.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;

  const tabStyle = (tabName: string) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tabName ? 'var(--color-henna-dark)' : '#e0e0e0',
    color: activeTab === tabName ? '#fff' : '#333',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginRight: '5px'
  });

  return (
    <div style={{ padding: '100px 20px', flexGrow: 1, backgroundColor: '#f5f5f5' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-henna-dark)' }}>Admin Dashboard</h2>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-henna-dark)', marginBottom: '20px' }}>
          <button style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
          <button style={tabStyle('portfolio')} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
        </div>
        
        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '0 12px 12px 12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-henna-dark)', color: '#fff' }}>
                  <th style={{ padding: '15px' }}>Date</th>
                  <th style={{ padding: '15px' }}>Name</th>
                  <th style={{ padding: '15px' }}>Contact</th>
                  <th style={{ padding: '15px' }}>Service</th>
                  <th style={{ padding: '15px' }}>Special Request</th>
                  <th style={{ padding: '15px' }}>Status</th>
                  <th style={{ padding: '15px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>No bookings found.</td></tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{booking.date}</td>
                      <td style={{ padding: '15px' }}>{booking.name}</td>
                      <td style={{ padding: '15px' }}>
                        {booking.email && <div>{booking.email}</div>}
                        <div>{booking.phone}</div>
                      </td>
                      <td style={{ padding: '15px' }}>{booking.service}</td>
                      <td style={{ padding: '15px', maxWidth: '200px', wordWrap: 'break-word', fontSize: '0.9rem', color: '#555' }}>
                        {booking.message || <span style={{ fontStyle: 'italic', color: '#999' }}>None</span>}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                          backgroundColor: booking.status === 'approved' ? '#d4edda' : booking.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                          color: booking.status === 'approved' ? '#155724' : booking.status === 'rejected' ? '#721c24' : '#856404'
                        }}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {booking.status !== 'approved' && <button onClick={() => updateStatus(booking.id, 'approved')} style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>}
                          {booking.status !== 'rejected' && <button onClick={() => updateStatus(booking.id, 'rejected')} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>}
                          <button onClick={() => deleteBooking(booking.id)} style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '0 12px 12px 12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-henna-dark)', color: '#fff' }}>
                  <th style={{ padding: '15px' }}>Name</th>
                  <th style={{ padding: '15px' }}>Email</th>
                  <th style={{ padding: '15px' }}>Phone</th>
                  <th style={{ padding: '15px' }}>Role</th>
                  <th style={{ padding: '15px' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '15px' }}>{u.email}</td>
                    <td style={{ padding: '15px' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', backgroundColor: u.role === 'admin' ? '#cce5ff' : '#e2e3e5', color: u.role === 'admin' ? '#004085' : '#383d41', fontSize: '0.85rem' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--color-henna-dark)', marginBottom: '1rem' }}>Add New Portfolio Image</h3>
              <form onSubmit={addPortfolioItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" placeholder="Image URL (e.g. /assets/my-image.jpg or https://...)" required
                  value={newImage.image_url} onChange={e => setNewImage({...newImage, image_url: e.target.value})}
                  style={{ flex: '1 1 200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input 
                  type="text" placeholder="Title" required
                  value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})}
                  style={{ flex: '1 1 200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input 
                  type="text" placeholder="Description" required
                  value={newImage.description} onChange={e => setNewImage({...newImage, description: e.target.value})}
                  style={{ flex: '2 1 300px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', flex: '0 0 auto' }}>Add Image</button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {portfolio.map(item => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-henna-rich)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 15px 0' }}>{item.description}</p>
                    <button onClick={() => deletePortfolioItem(item.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
