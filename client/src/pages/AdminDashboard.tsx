import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'portfolio' | 'services' | 'settings'>('bookings');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Settings state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [websiteContent, setWebsiteContent] = useState({
    heroHeading: 'Welcome to Heena by Amira',
    heroSubtext: 'Discover the art of traditional and modern henna.',
    aboutText: 'With years of experience, we provide the best henna services.'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Portfolio form state
  const [newImage, setNewImage] = useState({ image_url: '', title: '', description: '' });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [editPortfolioId, setEditPortfolioId] = useState<string | null>(null);

  // Services form state
  const [newService, setNewService] = useState({ title: '', description: '', price: '', features: '' });
  const [editServiceId, setEditServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const bQuery = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
        const bSnapshot = await getDocs(bQuery);
        const bData: any[] = [];
        bSnapshot.forEach(doc => bData.push({ id: doc.id, ...doc.data() }));
        setBookings(bData);
        
        const uQuery = query(collection(db, 'users'), orderBy('created_at', 'desc'));
        const uSnapshot = await getDocs(uQuery);
        const uData: any[] = [];
        uSnapshot.forEach(doc => {
          const data = doc.data();
          if (user.role === 'admin' && data.role === 'super_admin') return;
          uData.push({ id: doc.id, ...data });
        });
        setUsers(uData);

        const pQuery = query(collection(db, 'portfolio'), orderBy('created_at', 'desc'));
        const pSnapshot = await getDocs(pQuery);
        const pData: any[] = [];
        pSnapshot.forEach(doc => pData.push({ id: doc.id, ...doc.data() }));
        setPortfolio(pData);

        const srvQuery = query(collection(db, 'services'));
        const srvSnapshot = await getDocs(srvQuery);
        const srvData: any[] = [];
        srvSnapshot.forEach(doc => srvData.push({ id: doc.id, ...doc.data() }));
        setServices(srvData);

        const mDoc = await getDoc(doc(db, 'settings', 'maintenance_mode'));
        if (mDoc.exists()) setIsMaintenanceMode(mDoc.data().value === 'true');

        const cDoc = await getDoc(doc(db, 'settings', 'website_content'));
        if (cDoc.exists()) setWebsiteContent(cDoc.data() as any);

      } catch (err) {
        console.error(err);
        setError('Database error while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // --- BOOKING ACTIONS ---
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) { console.error(err); }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) { console.error(err); }
  };

  // --- USER ACTIONS ---
  const changeUserRole = async (userId: string, newRole: string) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) { console.error(err); alert('Failed to update role'); }
  };

  // --- PORTFOLIO ACTIONS ---
  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = newImage.image_url;
      
      if (portfolioFile) {
        const fileRef = ref(storage, `portfolio/${Date.now()}_${portfolioFile.name}`);
        await uploadBytes(fileRef, portfolioFile);
        finalImageUrl = await getDownloadURL(fileRef);
      }

      if (!finalImageUrl) {
        alert("Please provide an image URL or upload a file.");
        setUploading(false);
        return;
      }

      const itemData = { image_url: finalImageUrl, title: newImage.title, description: newImage.description };

      if (editPortfolioId) {
        await updateDoc(doc(db, 'portfolio', editPortfolioId), itemData);
        setPortfolio(portfolio.map(p => p.id === editPortfolioId ? { ...p, ...itemData } : p));
      } else {
        const newItemRef = doc(collection(db, 'portfolio'));
        const newItem = { ...itemData, created_at: new Date().toISOString() };
        await setDoc(newItemRef, newItem);
        setPortfolio([ { id: newItemRef.id, ...newItem }, ...portfolio ]);
      }
      
      cancelPortfolioEdit();
    } catch (err) { 
      console.error(err); 
      alert("Failed to save portfolio item.");
    } finally {
      setUploading(false);
    }
  };

  const startEditPortfolio = (item: any) => {
    setEditPortfolioId(item.id);
    setNewImage({ image_url: item.image_url, title: item.title, description: item.description });
    setPortfolioFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelPortfolioEdit = () => {
    setEditPortfolioId(null);
    setNewImage({ image_url: '', title: '', description: '' });
    setPortfolioFile(null);
  };

  const deletePortfolioItem = async (id: string) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      setPortfolio(portfolio.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  // --- SERVICES ACTIONS ---
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = newService.features.split(',').map(f => f.trim()).filter(f => f);
      const itemData = { 
        title: newService.title, 
        description: newService.description, 
        price: newService.price, 
        features: featuresArray
      };

      if (editServiceId) {
        await updateDoc(doc(db, 'services', editServiceId), itemData);
        setServices(services.map(s => s.id === editServiceId ? { ...s, ...itemData } : s));
      } else {
        const newSrvRef = doc(collection(db, 'services'));
        const newItem = { ...itemData, created_at: new Date().toISOString() };
        await setDoc(newSrvRef, newItem);
        setServices([...services, { id: newSrvRef.id, ...newItem }]);
      }
      
      cancelServiceEdit();
    } catch (err) { console.error(err); alert("Failed to save service."); }
  };

  const startEditService = (item: any) => {
    setEditServiceId(item.id);
    setNewService({ 
      title: item.title, 
      description: item.description, 
      price: item.price, 
      features: (item.features || []).join(', ') 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelServiceEdit = () => {
    setEditServiceId(null);
    setNewService({ title: '', description: '', price: '', features: '' });
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  // --- SETTINGS & CONTENT ACTIONS ---
  const toggleMaintenanceMode = async () => {
    try {
      const newVal = !isMaintenanceMode;
      await setDoc(doc(db, 'settings', 'maintenance_mode'), { value: newVal ? 'true' : 'false' });
      setIsMaintenanceMode(newVal);
    } catch (err) { console.error(err); }
  };

  const saveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'website_content'), websiteContent);
      alert('Content saved successfully!');
    } catch (err) { console.error(err); alert('Failed to save content'); }
  };

  if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;
  if (!user) return null;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-henna-dark)', margin: 0 }}>Admin Dashboard</h2>
          {user.role === 'super_admin' && (
            <span style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>Super Admin Mode</span>
          )}
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-henna-dark)', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
          <button style={tabStyle('services')} onClick={() => setActiveTab('services')}>Services</button>
          <button style={tabStyle('portfolio')} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
          <button style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>Content & Settings</button>
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
                  <th style={{ padding: '15px' }}>Request</th>
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
                      <td style={{ padding: '15px' }}>{booking.services || booking.service}</td>
                      <td style={{ padding: '15px', maxWidth: '200px', wordWrap: 'break-word', fontSize: '0.9rem', color: '#555' }}>
                        {booking.message || <span style={{ fontStyle: 'italic', color: '#999' }}>None</span>}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                          backgroundColor: booking.status === 'approved' ? '#d4edda' : booking.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                          color: booking.status === 'approved' ? '#155724' : booking.status === 'rejected' ? '#721c24' : '#856404'
                        }}>
                          {(booking.status || 'pending').toUpperCase()}
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
                  <th style={{ padding: '15px' }}>Role</th>
                  <th style={{ padding: '15px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '15px' }}>{u.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', backgroundColor: u.role === 'admin' || u.role === 'super_admin' ? '#cce5ff' : '#e2e3e5', color: u.role === 'admin' || u.role === 'super_admin' ? '#004085' : '#383d41', fontSize: '0.85rem' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {u.id !== user.id && (
                        <select 
                          value={u.role} 
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          style={{ padding: '5px', borderRadius: '4px' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          {user.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-henna-dark)', margin: 0 }}>{editServiceId ? 'Edit Service' : 'Add New Service'}</h3>
                {editServiceId && <button onClick={cancelServiceEdit} style={{ background: 'none', border: '1px solid #999', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel Edit</button>}
              </div>
              <form onSubmit={handleServiceSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" placeholder="Title (e.g. Bridal Heena)" required
                  value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})}
                  style={{ flex: '1 1 200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input 
                  type="text" placeholder="Price (e.g. Starts at $250)" required
                  value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}
                  style={{ flex: '1 1 200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input 
                  type="text" placeholder="Description" required
                  value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}
                  style={{ flex: '1 1 100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input 
                  type="text" placeholder="Features (comma separated)" required
                  value={newService.features} onChange={e => setNewService({...newService, features: e.target.value})}
                  style={{ flex: '1 1 100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', flex: '0 0 auto' }}>
                  {editServiceId ? 'Update Service' : 'Add Service'}
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {services.map(item => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderTop: '4px solid var(--color-gold)' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-henna-rich)' }}>{item.title}</h4>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '5px 0' }}>{item.price}</p>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: '10px 0' }}>{item.description}</p>
                  <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '0.9rem', marginBottom: '15px' }}>
                    {item.features?.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEditService(item)} style={{ flex: 1, padding: '8px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                    <button onClick={() => deleteService(item.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--color-henna-dark)', margin: 0 }}>{editPortfolioId ? 'Edit Portfolio Image' : 'Add New Portfolio Image'}</h3>
                {editPortfolioId && <button onClick={cancelPortfolioEdit} style={{ background: 'none', border: '1px solid #999', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel Edit</button>}
              </div>
              <form onSubmit={handlePortfolioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Upload Image (from Device)</label>
                    <input 
                      type="file" accept="image/*"
                      onChange={e => setPortfolioFile(e.target.files ? e.target.files[0] : null)}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: '0 0 auto', color: '#999', fontWeight: 'bold', paddingTop: '20px' }}>OR</div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Paste Image URL</label>
                    <input 
                      type="text" placeholder="https://..."
                      value={newImage.image_url} onChange={e => setNewImage({...newImage, image_url: e.target.value})}
                      style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                      disabled={!!portfolioFile}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                </div>
                
                <button type="submit" disabled={uploading} className="btn-primary" style={{ padding: '10px 20px', alignSelf: 'flex-start' }}>
                  {uploading ? 'Saving...' : editPortfolioId ? 'Update Image' : 'Add Image'}
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {portfolio.map(item => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-henna-rich)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 15px 0' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => startEditPortfolio(item)} style={{ flex: 1, padding: '5px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                      <button onClick={() => deletePortfolioItem(item.id)} style={{ flex: 1, padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS & CONTENT TAB */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Maintenance Mode */}
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--color-henna-dark)', marginBottom: '1rem' }}>Application Settings</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>Maintenance Mode</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>When enabled, all users will see a maintenance screen. Admin dashboard remains accessible.</p>
                </div>
                <button 
                  onClick={toggleMaintenanceMode}
                  style={{ padding: '10px 20px', backgroundColor: isMaintenanceMode ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {isMaintenanceMode ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>
            </div>

            {/* Website Content */}
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--color-henna-dark)', marginBottom: '1rem' }}>Website Content</h3>
              <form onSubmit={saveWebsiteContent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Heading</label>
                  <input type="text" value={websiteContent.heroHeading} onChange={e => setWebsiteContent({...websiteContent, heroHeading: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Subtext</label>
                  <input type="text" value={websiteContent.heroSubtext} onChange={e => setWebsiteContent({...websiteContent, heroSubtext: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>About Us Text</label>
                  <textarea value={websiteContent.aboutText} onChange={e => setWebsiteContent({...websiteContent, aboutText: e.target.value})} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>Save Content</button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
