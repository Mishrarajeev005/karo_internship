import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', companyName: '', location: '', stipend: '', description: ''
  });
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  useEffect(() => {
    // Check if admin is logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        const [appsRes, intsRes] = await Promise.all([
          api.get('/applications'),
          api.get('/internships')
        ]);
        setApplications(appsRes.data);
        setInternships(intsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const handlePostInternship = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/internships', formData);
      setInternships([...internships, res.data]);
      setFormData({ title: '', companyName: '', location: '', stipend: '', description: '' });
      setShowPostForm(false);
      alert('Internship posted successfully!');
    } catch (error) {
      alert('Failed to post internship');
    }
  };

  const handleDeleteInternship = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/internships/${id}`);
      setInternships(internships.filter(i => i.id !== id));
    } catch (error) {
      alert('Failed to delete internship');
    }
  };

  const tabStyle = (tab) => ({
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s',
    background: activeTab === tab ? 'linear-gradient(135deg, #fb2c36, #e51d27)' : '#f0f0f0',
    color: activeTab === tab ? '#fff' : '#555',
    boxShadow: activeTab === tab ? '0 4px 15px rgba(251,44,54,0.3)' : 'none'
  });

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    width: '100%'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Admin Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        background: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="KaroStartup" style={{ height: '32px' }} />
          <span style={{
            background: 'rgba(251,44,54,0.1)',
            color: '#fb2c36',
            padding: '0.2rem 0.6rem',
            borderRadius: '0.5rem',
            fontSize: '0.7rem',
            fontWeight: '700',
            letterSpacing: '0.05em'
          }}>
            ADMIN
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="admin-welcome-text" style={{ color: '#555', fontSize: '0.85rem' }}>Hi, <strong>{adminName}</strong></span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              border: '2px solid #fb2c36',
              background: 'transparent',
              color: '#fb2c36',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.85rem'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#fb2c36'; e.target.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#fb2c36'; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #eee'
          }}>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Applications</p>
            <h3 style={{ fontSize: '2rem', color: '#fb2c36', fontFamily: 'Outfit' }}>{applications.length}</h3>
          </div>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #eee'
          }}>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Active Internships</p>
            <h3 style={{ fontSize: '2rem', color: '#000', fontFamily: 'Outfit' }}>{internships.length}</h3>
          </div>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #eee'
          }}>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Unique Students</p>
            <h3 style={{ fontSize: '2rem', color: '#000', fontFamily: 'Outfit' }}>
              {[...new Set(applications.map(a => a.student?.id))].length}
            </h3>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button style={tabStyle('applications')} onClick={() => { setActiveTab('applications'); setShowPostForm(false); }}>
            📋 Student Applications
          </button>
          <button style={tabStyle('internships')} onClick={() => { setActiveTab('internships'); setShowPostForm(false); }}>
            💼 Manage Internships
          </button>
          <button
            onClick={() => { setShowPostForm(true); setActiveTab('post'); }}
            style={{
              ...tabStyle('post'),
              background: activeTab === 'post' ? 'linear-gradient(135deg, #fb2c36, #e51d27)' : '#fff',
              border: activeTab === 'post' ? 'none' : '2px solid #fb2c36',
              color: activeTab === 'post' ? '#fff' : '#fb2c36',
            }}
          >
            ➕ Post New Internship
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>Loading data...</div>
        ) : (
          <>
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div style={{
                background: '#fff',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #eee'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(251,44,54,0.05)', textAlign: 'left' }}>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Student Name</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Email</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Mobile</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Skills</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Internship</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Resume</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>LinkedIn</th>
                        <th style={{ padding: '1.25rem', fontWeight: '600', color: '#333', borderBottom: '1px solid #eee' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                            No applications received yet.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '1.25rem', fontWeight: '600' }}>{app.student?.name || 'Unknown'}</td>
                            <td style={{ padding: '1.25rem', color: '#555' }}>{app.student?.email || 'N/A'}</td>
                            <td style={{ padding: '1.25rem', color: '#555' }}>{app.student?.mobile || 'N/A'}</td>
                            <td style={{ padding: '1.25rem' }}>
                              <span style={{ background: '#f0f0f0', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                                {app.student?.skills || 'N/A'}
                              </span>
                            </td>
                             <td style={{ padding: '1.25rem', color: '#fb2c36', fontWeight: '500' }}>{app.internship?.title || 'Unknown'}</td>
                            <td style={{ padding: '1.25rem' }}>
                              {app.student?.resumeUrl ? (
                                <a href={app.student.resumeUrl} target="_blank" rel="noreferrer"
                                  style={{ color: '#fb2c36', fontWeight: '700', textDecoration: 'none', background: 'rgba(251,44,54,0.05)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
                                  📄 Resume
                                </a>
                              ) : (
                                <span style={{ color: '#ccc' }}>N/A</span>
                              )}
                            </td>
                            <td style={{ padding: '1.25rem' }}>
                              {app.student?.linkedinUrl ? (
                                <a href={app.student.linkedinUrl} target="_blank" rel="noreferrer"
                                  style={{ color: '#0077b5', fontWeight: '700', textDecoration: 'none', background: 'rgba(0,119,181,0.05)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
                                  🔗 LinkedIn
                                </a>
                              ) : (
                                <span style={{ color: '#ccc' }}>N/A</span>
                              )}
                            </td>
                            <td style={{ padding: '1.25rem' }}>
                              <span style={{
                                background: 'rgba(251,44,54,0.1)',
                                color: '#fb2c36',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '9999px',
                                fontWeight: '600',
                                fontSize: '0.8rem'
                              }}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Internships Tab */}
            {activeTab === 'internships' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {internships.map(int => (
                  <div key={int.id} style={{
                    background: '#fff',
                    padding: '1.5rem 2rem',
                    borderRadius: '1rem',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', fontFamily: 'Outfit' }}>{int.title}</h3>
                      <p style={{ color: '#fb2c36', fontWeight: '600' }}>{int.companyName} • {int.location}</p>
                      <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.3rem' }}>{int.stipend}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        background: 'rgba(251,44,54,0.1)',
                        color: '#fb2c36',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}>
                        ID: #{int.id}
                      </span>
                      <button
                        onClick={() => handleDeleteInternship(int.id, int.title)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #fb2c36',
                          background: 'transparent',
                          color: '#fb2c36',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#fb2c36'; e.target.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#fb2c36'; }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post Internship Form */}
            {activeTab === 'post' && showPostForm && (
              <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                border: '1px solid #eee',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                maxWidth: '650px'
              }}>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                  Post a New Internship
                </h3>
                <form onSubmit={handlePostInternship} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Job Title *</label>
                    <input type="text" required value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Frontend Developer Intern"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Company Name *</label>
                    <input type="text" required value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Your Startup Name"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Location *</label>
                      <input type="text" required value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Remote"
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Stipend *</label>
                      <input type="text" required value={formData.stipend}
                        onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                        placeholder="₹15,000/month"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Description *</label>
                    <textarea required rows="4" value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the role, responsibilities..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <button type="submit" style={{
                    padding: '0.9rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #fb2c36, #e51d27)',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(251,44,54,0.3)',
                  }}>
                    Post Internship
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
