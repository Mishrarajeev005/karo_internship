import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'company'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Clear old tokens to prevent interference
    localStorage.removeItem('token');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('role');
    try {
      if (role === 'admin') {
        const res = await api.post('/admin/login', { username, password });
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('role', 'admin');
          localStorage.setItem('adminName', res.data.admin.name);
          localStorage.setItem('adminUsername', res.data.admin.username);
          navigate('/admin/dashboard');
        } else {
          setError(res.data.message);
        }
      } else {
        // Company login (using username field as email for companies)
        const res = await api.post('/companies/login', { email: username, password });
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('adminLoggedIn', 'true'); // Keep this for backward compatibility
          localStorage.setItem('role', 'company');
          localStorage.setItem('companyId', res.data.company.id);
          localStorage.setItem('adminName', res.data.company.name);
          navigate('/admin/dashboard');
        } else {
          setError('Invalid company email or password');
        }
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9f9f9',
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="KaroStartup" style={{ height: '40px', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Portal Login</h2>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>Sign in as Admin or Partner</p>
        </div>

        {/* Role Selector */}
        <div style={{
          display: 'flex',
          background: '#f0f0f0',
          padding: '0.3rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          gap: '0.3rem'
        }}>
          <button
            onClick={() => setRole('admin')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s',
              background: role === 'admin' ? '#fff' : 'transparent',
              color: role === 'admin' ? '#fb2c36' : '#666',
              boxShadow: role === 'admin' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Super Admin
          </button>
          <button
            onClick={() => setRole('company')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s',
              background: role === 'company' ? '#fff' : 'transparent',
              color: role === 'company' ? '#fb2c36' : '#666',
              boxShadow: role === 'company' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Partner Company
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(251,44,54,0.08)',
            color: '#fb2c36',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(251,44,54,0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>
              {role === 'admin' ? 'Username' : 'Company Email'}
            </label>
            <input
              type={role === 'admin' ? 'text' : 'email'}
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder={role === 'admin' ? 'Enter admin username' : 'Enter company email'}
              className="nav-pill"
              style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter password"
              className="nav-pill"
              style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link
            to="/admin/forgot-password"
            style={{ color: '#fb2c36', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
