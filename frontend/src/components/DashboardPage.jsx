import React, { useEffect, useState } from 'react';
import api from '../api';

function DashboardPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                setApplications(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching applications", err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="container" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Applications <span className="text-gradient">Dashboard</span></h1>
            
            {loading ? <p>Loading applications...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {applications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No applications received yet.</p>
                    ) : (
                        applications.map(app => (
                            <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Inter' }}>Role: <span style={{color: 'var(--primary-color)'}}>{app.internship.title}</span></h3>
                                    <p style={{ fontWeight: '600', fontSize: '1.2rem' }}>Applicant: {app.student.name}</p>
                                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Email: {app.student.email}</p>
                                    <p style={{ color: 'var(--text-muted)' }}>Mobile: {app.student.mobile || 'Not provided'}</p>
                                    <p style={{ color: 'var(--text-muted)' }}>Skills: <strong>{app.student.skills}</strong></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block', 
                                        padding: '0.4rem 1rem', 
                                        backgroundColor: 'rgba(251,44,54,0.1)', 
                                        color: 'var(--primary-color)', 
                                        borderRadius: '2rem', 
                                        fontWeight: '600',
                                        marginBottom: '1rem' 
                                    }}>
                                        {app.status}
                                    </span>
                                    <br />
                                    {app.student.resumeUrl ? (
                                        <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                                            View Resume
                                        </a>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No Resume</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}

export default DashboardPage;
