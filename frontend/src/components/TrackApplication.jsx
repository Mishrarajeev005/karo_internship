import React, { useState } from 'react';
import api from '../api';
import logo from '../assets/logo.png';

const TrackApplication = () => {
    const [email, setEmail] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get(`/applications/student/${email}`);
            setApplications(res.data);
            setSearched(true);
        } catch (error) {
            alert("No applications found for this email.");
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'HIRED': return { background: '#dcfce7', color: '#16a34a' };
            case 'SHORTLISTED': return { background: '#dbeafe', color: '#2563eb' };
            case 'INTERVIEW': return { background: '#fef3c7', color: '#d97706' };
            case 'REJECTED': return { background: '#fee2e2', color: '#dc2626' };
            default: return { background: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <div style={{ minHeight: '80vh', padding: '4rem 2rem', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
                        Track Your <span style={{ color: '#fb2c36' }}>Application</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Enter the email address you used during application to check your current status.
                    </p>
                </div>

                {/* Search Box */}
                <div style={{ 
                    background: '#fff', 
                    padding: '2rem', 
                    borderRadius: '1.5rem', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    marginBottom: '3rem'
                }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                flex: 1, 
                                padding: '1rem 1.5rem', 
                                borderRadius: '0.75rem', 
                                border: '2px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#fb2c36'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                padding: '1rem 2rem', 
                                borderRadius: '0.75rem', 
                                background: '#fb2c36', 
                                color: '#fff', 
                                border: 'none', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {loading ? 'Checking...' : 'Track Status'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Application History</h2>
                        {applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '1rem' }}>
                                <p style={{ color: '#64748b' }}>No applications found for this email address.</p>
                            </div>
                        ) : (
                            applications.map(app => (
                                <div key={app.id} className="track-card">
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{app.internship?.title}</h3>
                                        <p style={{ margin: '0.3rem 0 0', color: '#fb2c36', fontWeight: '600' }}>
                                            {app.internship?.company?.name || app.internship?.companyName}
                                        </p>
                                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                                            Applied on: {new Date(app.id * 1000).toLocaleDateString()} {/* Placeholder for date */}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            padding: '0.5rem 1rem', 
                                            borderRadius: '0.5rem', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            ...getStatusStyle(app.status)
                                        }}>
                                            {app.status}
                                        </span>
                                        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                                            ID: #{app.id}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackApplication;
