import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function InternshipsPage() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/internships')
            .then(res => {
                setInternships(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching internships", err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="container" style={{ padding: '3rem 1rem', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Latest <span className="text-gradient">Internships</span></h1>
            <p style={{ color: '#555', marginBottom: '2rem', fontSize: '1rem' }}>Find your perfect startup internship opportunity</p>
            
            {loading ? <p style={{ color: '#999' }}>Loading exciting opportunities...</p> : (
                <div className="internship-grid">
                    {internships.length === 0 ? (
                        <p style={{ color: '#555' }}>No internships posted yet. Check back soon!</p>
                    ) : (
                        internships.map(internship => (
                            <div key={internship.id} className="internship-card">
                                <div>
                                    <h3>{internship.title}</h3>
                                    <p className="meta">{internship.companyName} • {internship.location}</p>
                                    <p className="description">{internship.description}</p>
                                    
                                    <div className="stipend-pill">
                                        💰 {internship.stipend}
                                    </div>
                                </div>
                                
                                <Link to={`/apply/${internship.id}`} className="btn-apply">
                                    Apply Now →
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}

export default InternshipsPage;
