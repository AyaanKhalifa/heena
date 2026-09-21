import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaPinterestP, FaTiktok, FaYoutube, FaBars, FaTimes, FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import FloatingHenna from './FloatingHenna';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && token) {
      fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter(n => !n.is_read).length);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user, token, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navBg = isScrolled || !isHomePage || menuOpen ? 'rgba(249, 246, 240, 0.98)' : 'transparent';
  const navShadow = isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
  const linkColor = isScrolled || !isHomePage || menuOpen ? 'var(--color-henna-dark)' : 'var(--color-cream)';
  const logoColor = isScrolled || !isHomePage || menuOpen ? 'var(--color-henna-rich)' : 'var(--color-gold)';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Dashboard' });
  }

  const socialIconStyle = (bg: string, active: boolean = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '45px', height: '45px', borderRadius: '50%',
    background: bg, color: 'white', fontSize: '1.5rem',
    transition: 'transform 0.3s',
    opacity: active ? 1 : 0.5,
    cursor: active ? 'pointer' : 'not-allowed'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      <FloatingHenna />

      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-gold), var(--color-henna-rich))',
          transformOrigin: '0%',
          zIndex: 200
        }}
      />

      {/* Navbar */}
      <nav className="navbar" style={{
        position: 'fixed', width: '100%', padding: '15px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: navBg, zIndex: 100,
        boxShadow: navShadow, transition: 'all 0.4s ease'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: logoColor, margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.4s ease', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>Heena by Amira</h2>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: linkColor, textDecoration: 'none', fontWeight: 'bold',
              transition: 'color 0.4s ease',
              borderBottom: location.pathname === link.to ? '2px solid var(--color-gold)' : '2px solid transparent',
              paddingBottom: '4px'
            }}>
              {link.label}
            </Link>
          ))}
          
          {/* Auth Section Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: `1px solid ${linkColor}40` }}>
            {user ? (
              <>
                <Link to="/notifications" style={{ color: linkColor, position: 'relative', fontSize: '1.2rem' }}>
                  <FaBell />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: linkColor, textDecoration: 'none', fontWeight: 'bold' }} title="My Profile">
                  <FaUser /> <span style={{ fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: linkColor, cursor: 'pointer', fontSize: '1.2rem' }} title="Logout">
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: linkColor, textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Hamburger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-only-flex">
          {user && (
            <Link to="/notifications" style={{ color: logoColor, position: 'relative', fontSize: '1.2rem', display: 'block' }} className="hamburger-btn">
              <FaBell />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'none', border: 'none',
              color: logoColor, fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.4s ease'
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="mobile-menu"
        initial={{ x: '100%' }}
        animate={{ x: menuOpen ? '0%' : '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        style={{
          position: 'fixed', top: 0, right: 0,
          width: '75%', maxWidth: '320px', height: '100vh',
          backgroundColor: 'var(--color-cream)',
          zIndex: 99, paddingTop: '100px', paddingLeft: '40px',
          display: 'flex', flexDirection: 'column', gap: '2rem',
          boxShadow: menuOpen ? '-5px 0 30px rgba(0,0,0,0.15)' : 'none',
          overflowY: 'auto'
        }}
      >
        {user && (
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-henna-dark)' }}>
             <FaUser /> <b>{user.name}</b>
          </div>
        )}

        {navLinks.map(link => (
          <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{
            color: 'var(--color-henna-dark)', textDecoration: 'none',
            fontWeight: 'bold', fontSize: '1.3rem',
            fontFamily: 'var(--font-heading)',
            borderBottom: location.pathname === link.to ? '2px solid var(--color-gold)' : 'none',
            paddingBottom: '4px', width: 'fit-content'
          }}>
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingBottom: '40px' }}>
          {user ? (
            <button onClick={handleLogout} className="btn-outline" style={{ width: '100%' }}>Logout</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/login" className="btn-outline" style={{ textAlign: 'center' }}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ textAlign: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Overlay backdrop */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 98
        }} />
      )}
      
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'var(--color-henna-dark)', color: 'var(--color-cream)', padding: '60px 40px 20px', marginTop: 'auto', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px', marginBottom: '20px' }}>
          
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontSize: '1.8rem', marginBottom: '1rem' }}>Amira Shaikh | Mehndi Artist</h3>
            <p style={{ color: '#ccc', lineHeight: '1.8' }}>Professional Mehndi artist based in Chikhli, Surkhai. Transforming moments into unforgettable memories with bespoke bridal, festival, and custom henna.</p>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/portfolio" style={{ color: '#ccc', textDecoration: 'none' }}>Our Portfolio</Link></li>
              <li><Link to="/services" style={{ color: '#ccc', textDecoration: 'none' }}>Bridal Packages</Link></li>
              <li><Link to="/about" style={{ color: '#ccc', textDecoration: 'none' }}>About the Artist</Link></li>
              <li><Link to="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Book an Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.2rem' }}>Follow Us</h4>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>Stay updated with our latest designs and bridal inspiration.</p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <a href="https://www.instagram.com/heena__byamira__16?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                style={socialIconStyle('linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', true)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <FaInstagram />
              </a>
              <a href="#" style={socialIconStyle('#FF0000')}><FaYoutube /></a>
              <a href="#" style={socialIconStyle('#1877F2')}><FaFacebookF /></a>
              <a href="#" style={socialIconStyle('#E60023')}><FaPinterestP /></a>
              <a href="#" style={socialIconStyle('#000000')}><FaTiktok /></a>
            </div>
          </div>
          
        </div>
        
        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Heena by Amira Shaikh. All rights reserved.</p>
          <p style={{ color: 'var(--color-gold)', marginTop: '5px' }}>Crafted with 100% Organic Heena</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
