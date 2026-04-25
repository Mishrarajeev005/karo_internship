import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const AdminForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = verify email, 2 = set new password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/admin/verify-email', { email });
      if (res.data.success) {
        setStep(2);
        setMessage('Email verified! Set your new password below.');
      } else {
        setError(res.data.message);
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
      const res = await api.post('/admin/reset-password', { email, newPassword });
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
            {step === 1 ? 'Forgot Password' : 'Set Password'}
          </h2>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            {step === 1 ? 'Verify your admin email' : 'Create a new password'}
          </p>
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

        {message && (
          <div style={{
            background: 'rgba(34,197,94,0.08)',
            color: '#16a34a',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(34,197,94,0.2)'
          }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karostartup.com"
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="nav-pill"
                style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}
              />
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
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link
            to="/admin"
            style={{ color: '#fb2c36', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
