import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const AdminForgotPassword = () => {
  const [role, setRole] = useState('admin'); // 'admin' or 'company'
  const [mode, setMode] = useState('password'); // 'password' or 'username' (admin only)
  const [step, setStep] = useState(1); // 1 = identify, 2 = reset
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleIdentify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'username') {
        const res = await api.post('/admin/forgot-username', { name: fullName });
        if (res.data.success) {
          setMessage(`Your username is: ${res.data.username}`);
        } else {
          setError(res.data.message);
        }
      } else if (role === 'admin') {
        const res = await api.post('/admin/verify-username', { username });
        if (res.data.success) {
          setStep(2);
          setMessage('Admin verified! Set your new password.');
        } else {
          setError(res.data.message);
        }
      } else {
        // Company
        const res = await api.post('/companies/verify-email', { email });
        if (res.data.success) {
          setStep(2);
          setMessage('Company email verified! Set your new password.');
        } else {
          setError(res.data.message);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/admin/reset-password' : '/companies/reset-password';
      const body = role === 'admin' ? { username, newPassword } : { email, newPassword };
      
      const res = await api.post(endpoint, body);
      if (res.data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {mode === 'username' ? 'Find Username' : (step === 1 ? 'Forgot Password' : 'Reset Password')}
          </h2>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            {mode === 'username' ? 'Enter your full name to recover username' : 
             (step === 1 ? `Recover your ${role === 'admin' ? 'Admin' : 'Partner'} account` : 'Create a new password')}
          </p>
        </div>

        {/* Role/Mode Switcher - Only in Step 1 */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
             <div style={{
              display: 'flex',
              background: '#f0f0f0',
              padding: '0.3rem',
              borderRadius: '0.75rem',
              gap: '0.3rem'
            }}>
              <button
                onClick={() => { setRole('admin'); setMode('password'); }}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.8rem', background: role === 'admin' ? '#fff' : 'transparent',
                  color: role === 'admin' ? '#fb2c36' : '#666'
                }}
              >Admin</button>
              <button
                onClick={() => { setRole('company'); setMode('password'); }}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.8rem', background: role === 'company' ? '#fff' : 'transparent',
                  color: role === 'company' ? '#fb2c36' : '#666'
                }}
              >Partner</button>
            </div>

            {role === 'admin' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" checked={mode === 'password'} onChange={() => setMode('password')} />
                  Forgot Password
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" checked={mode === 'username'} onChange={() => setMode('username')} />
                  Forgot Username
                </label>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(251,44,54,0.08)', color: '#fb2c36', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(251,44,54,0.2)' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(34,197,94,0.08)', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(34,197,94,0.2)' }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleIdentify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>
                {mode === 'username' ? 'Admin Full Name' : (role === 'admin' ? 'Admin Username' : 'Company Email')}
              </label>
              <input
                type={role === 'company' ? 'email' : 'text'}
                required
                value={mode === 'username' ? fullName : (role === 'admin' ? username : email)}
                onChange={(e) => mode === 'username' ? setFullName(e.target.value) : (role === 'admin' ? setUsername(e.target.value) : setEmail(e.target.value))}
                placeholder={mode === 'username' ? "Enter full name" : (role === 'admin' ? "Enter username" : "Enter company email")}
                className="nav-pill"
                style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
              {loading ? 'Processing...' : (mode === 'username' ? 'Recover Username' : 'Continue')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="nav-pill"
                  style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', paddingRight: '3rem' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                  {showPassword ? 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  }
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="nav-pill"
                style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/admin" style={{ color: '#fb2c36', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
