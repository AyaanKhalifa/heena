import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Developer from './pages/Developer';
import Maintenance from './pages/Maintenance';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: any;
    import('firebase/firestore').then(({ doc, onSnapshot }) => {
      import('./firebase').then(({ db }) => {
        unsubscribe = onSnapshot(doc(db, 'settings', 'maintenance_mode'), (settingDoc) => {
          if (settingDoc.exists()) {
            setIsMaintenanceMode(settingDoc.data().value === 'true');
          } else {
            setIsMaintenanceMode(false);
          }
          setLoading(false);
        }, (err) => {
          console.error(err);
          setLoading(false);
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const { user } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}></div>;
  }


  const isAuthorizedAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

  return (
    <>
      {isMaintenanceMode && isAuthorizedAdmin && (
        <div style={{ backgroundColor: '#dc3545', color: '#fff', textAlign: 'center', padding: '10px', fontWeight: 'bold', zIndex: 9999, position: 'relative', width: '100%', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          ⚠️ MAINTENANCE MODE IS ACTIVE — Regular users currently see the maintenance screen.
        </div>
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/developer" element={<Developer />} />
          <Route path="/" element={<Layout />}>
            {/* Auth routes are always accessible */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* If maintenance is ON and the user is NOT an admin, show Maintenance page for everything else */}
            {isMaintenanceMode && !isAuthorizedAdmin ? (
              <>
                <Route index element={<Maintenance />} />
                <Route path="*" element={<Maintenance />} />
              </>
            ) : (
              <>
                <Route index element={<Home />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="services" element={<Services />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
      <Analytics />
    </AuthProvider>
  );
};

export default App;
