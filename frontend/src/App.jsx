import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import InternshipsPage from './components/InternshipsPage';
import ApplyPage from './components/ApplyPage';
import AdminLogin from './components/AdminLogin';
import AdminForgotPassword from './components/AdminForgotPassword';
import AdminDashboard from './components/AdminDashboard';
import SocialFeed from './components/SocialFeed';
import TrackApplication from './components/TrackApplication';
import logo from './assets/logo.png';

function StudentLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="KaroStartup Logo" style={{ height: '40px', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links-desktop">
            <Link to="/" className="nav-pill">
              Home
            </Link>
            <Link to="/internships" className="nav-pill">
              Browse Internships
            </Link>
            <Link to="/track" className="nav-pill nav-pill-primary">
              Track Status
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/internships" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
              Browse Internships
            </Link>
            <Link to="/track" className="mobile-menu-link" onClick={() => setMenuOpen(false)} style={{ color: '#fb2c36', fontWeight: '700' }}>
              Track Status
            </Link>
          </div>
        )}
      </nav>
      {children}
      <SocialFeed />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Pages */}
        <Route path="/" element={<StudentLayout><LandingPage /></StudentLayout>} />
        <Route path="/internships" element={<StudentLayout><InternshipsPage /></StudentLayout>} />
        <Route path="/apply/:id" element={<StudentLayout><ApplyPage /></StudentLayout>} />
        <Route path="/track" element={<StudentLayout><TrackApplication /></StudentLayout>} />

        {/* Admin Pages - completely separate */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
