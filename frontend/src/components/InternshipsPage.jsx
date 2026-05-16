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

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
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
            
            <div className="search-container" style={{ marginBottom: '2.5rem' }}>
                <form 
                    onSubmit={handleSearch}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                        borderRadius: '9999px',
                        border: '1px solid #eee',
                        transition: 'all 0.3s ease',
                        background: '#fff',
                        overflow: 'hidden',
                        padding: '2px'
                    }}
                >
                    <input 
                        type="text" 
                        placeholder="Search role, company, or skills..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.8rem 1.5rem',
                            fontSize: '1rem',
                            border: 'none',
                            outline: 'none',
                            fontFamily: 'Inter, sans-serif',
                            background: 'transparent',
                            minWidth: '100px'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            background: 'var(--primary-color)',
                            color: '#fff',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            fontWeight: '700'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span className="search-btn-text" style={{ marginLeft: '0.6rem' }}>Search</span>
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
