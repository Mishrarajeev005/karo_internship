import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ApplyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        skills: '',
        linkedinUrl: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const inputStyle = {
        padding: '0.85rem 1rem',
        borderRadius: '0.75rem',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        transition: 'border 0.3s',
        fontFamily: 'Inter, sans-serif'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let resumeUrl = '';
            
            // Upload file if selected
            if (resumeFile) {
                const fileData = new FormData();
                fileData.append('file', resumeFile);
                const uploadRes = await api.post('/students/upload', fileData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                resumeUrl = uploadRes.data;
            }

            // Create student with resume URL
            const studentRes = await api.post('/students', { ...formData, resumeUrl });
            const studentId = studentRes.data.id;

            // Create application
            await api.post(`/applications?studentId=${studentId}&internshipId=${id}`);
            
            alert("Application submitted successfully!");
            navigate('/internships');
        } catch (error) {
            console.error("Error applying to internship", error);
            alert("Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ padding: '3rem 1rem', minHeight: '80vh' }}>
            <div style={{
                maxWidth: '550px',
                margin: '0 auto',
                background: '#fff',
                borderRadius: '1.5rem',
                padding: '2.5rem 2rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                border: '1px solid #eee'
            }}>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Submit <span className="text-gradient">Application</span></h1>
                <p style={{ color: '#555', marginBottom: '2rem', fontSize: '0.95rem' }}>Applying for Internship #{id}</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Full Name *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Email Address *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" style={inputStyle} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Mobile Number *</label>
                        <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="+91 9876543210" style={inputStyle} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>LinkedIn Profile URL *</label>
                        <input type="url" name="linkedinUrl" required value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Resume (PDF/Docs) - <span style={{color: '#fb2c36'}}>Optional</span></label>
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileChange} 
                            style={{
                                ...inputStyle,
                                padding: '0.6rem',
                                background: '#f8f9fa',
                                cursor: 'pointer'
                            }} 
                        />
                        <p style={{fontSize: '0.75rem', color: '#777', marginTop: '0.2rem'}}>Max size 5MB. Leave empty if you don't have a resume.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Skills (comma separated) *</label>
                        <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Design" style={inputStyle} />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default ApplyPage;
