import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function PostInternshipPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        stipend: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/internships', formData);
            alert("Internship posted successfully!");
            navigate('/internships');
        } catch (error) {
            console.error("Error posting internship", error);
            alert("Failed to post internship.");
        }
    };

    return (
        <main className="container" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Post an <span className="text-gradient">Internship</span></h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Hire top talent directly. Fill out the details below.</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Job Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Company Name</label>
                        <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="Your Startup Name" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Location</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Remote, Bangalore" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Stipend</label>
                        <input type="text" name="stipend" required value={formData.stipend} onChange={handleChange} placeholder="e.g. ₹15,000 / month" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Description</label>
                        <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and requirements..." style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', resize: 'vertical' }}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post Internship</button>
                </form>
            </div>
        </main>
    );
}

export default PostInternshipPage;
