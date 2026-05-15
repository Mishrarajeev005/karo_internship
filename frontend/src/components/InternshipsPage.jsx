import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function InternshipsPage() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

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

    const handleSearch = (e) => {
        e.preventDefault();
        setActiveSearch(searchTerm);
    };

    const filteredInternships = internships.filter(internship => {
        const search = activeSearch.toLowerCase();
        const titleMatch = internship.title ? internship.title.toLowerCase().includes(search) : false;
        const companyMatch = internship.companyName ? internship.companyName.toLowerCase().includes(search) : false;
        const descMatch = internship.description ? internship.description.toLowerCase().includes(search) : false;
        return titleMatch || companyMatch || descMatch;
    });

    return (
        <main className="container" style={{ padding: '3rem 1rem', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Latest <span className="text-gradient">Internships</span></h1>
            <p style={{ color: '#555', marginBottom: '2rem', fontSize: '1rem' }}>Find your perfect startup internship opportunity</p>
            
            <div style={{ marginBottom: '2rem' }}>
                <form 
                    onSubmit={handleSearch}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        borderRadius: '9999px',
                        border: '2px solid #eee',
                        transition: 'border-color 0.3s ease',
                        background: '#fff',
                        overflow: 'hidden'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#eee'}
                >
                    <input 
                        type="text" 
                        placeholder="Search by role, company, or keywords..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '1rem 1.5rem',
                            fontSize: '1.05rem',
                            border: 'none',
                            outline: 'none',
                            fontFamily: 'Inter, sans-serif',
                            background: 'transparent'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            background: 'var(--primary-color)',
                            color: '#fff',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            marginRight: '0.4rem',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-color)'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span style={{ marginLeft: '0.5rem', fontWeight: '600', fontSize: '1rem' }}>Search</span>
                    </button>
                </form>
            </div>
            
            {loading ? <p style={{ color: '#999' }}>Loading exciting opportunities...</p> : (
                <div className="internship-grid">
                    {filteredInternships.length === 0 ? (
                        <p style={{ color: '#555' }}>No internships found matching your search. Try different keywords!</p>
                    ) : (
                        filteredInternships.map(internship => (
                            <div key={internship.id} className="internship-card">
                                {internship.company?.logoUrl && (
                                    <img 
                                        src={internship.company.logoUrl} 
                                        alt={internship.companyName} 
                                        className="company-logo-mini" 
                                    />
                                )}
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
