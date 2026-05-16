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
  const [selectedInternship, setSelectedInternship] = useState(null); // For View Details modal
  const [filterInternshipId, setFilterInternshipId] = useState(null); // For filtering applicants by internship
  const [filterCompanyName, setFilterCompanyName] = useState('All'); // For filtering by company
  const [filterStatus, setFilterStatus] = useState('All'); // For filtering by status
  const [applicationSearch, setApplicationSearch] = useState(''); // NEW: Search bar state
  const [updatingStatusId, setUpdatingStatusId] = useState(null); // NEW: Track which app is updating
  const [formData, setFormData] = useState({
    title: '', companyName: '', location: '', stipend: '', description: ''
  });
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const role = localStorage.getItem('role') || 'admin';
  const companyId = localStorage.getItem('companyId');
  const [companies, setCompanies] = useState([]); // For Super Admin to manage partners
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    name: '', email: '', password: '', description: '', logoUrl: ''
  });
  const [selectedCompany, setSelectedCompany] = useState(null); // For editing
  const [showEditCompanyForm, setShowEditCompanyForm] = useState(false);

  useEffect(() => {
    // Check if logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        if (role === 'admin') {
          const [appsRes, intsRes, compsRes] = await Promise.all([
            api.get('/applications'),
            api.get('/internships'),
            api.get('/companies')
          ]);
          setApplications(appsRes.data);
          setInternships(intsRes.data);
          setCompanies(compsRes.data);
        } else {
          // Company view - filtered data
          const [appsRes, intsRes] = await Promise.all([
            api.get(`/applications/company/${companyId}`),
            api.get(`/internships/company/${companyId}`)
          ]);
          setApplications(appsRes.data);
          setInternships(intsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, role, companyId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('role');
    localStorage.removeItem('companyId');
    navigate('/admin');
  };

  const handlePostInternship = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (role === 'company') {
        payload.company = { id: parseInt(companyId) };
        payload.companyName = adminName; // Automatically use company name
      }
      
      const res = await api.post('/internships', payload);
      setInternships([...internships, res.data]);
      setFormData({ title: '', companyName: '', location: '', stipend: '', description: '' });
      setShowPostForm(false);
      alert('Internship posted successfully!');
    } catch (error) {
      alert('Failed to post internship');
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/companies/register', companyFormData);
      setCompanies([...companies, res.data]);
      setCompanyFormData({ name: '', email: '', password: '', description: '', logoUrl: '' });
      setShowCompanyForm(false);
      alert('Partner Company registered successfully!');
    } catch (error) {
      alert('Failed to register company');
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/companies/${selectedCompany.id}`, selectedCompany);
      setCompanies(companies.map(c => c.id === selectedCompany.id ? res.data : c));
      setShowEditCompanyForm(false);
      alert('Partner details updated!');
    } catch (error) {
      alert('Failed to update company');
    }
  };

  const handleToggleCompanyStatus = async (id) => {
    try {
      const res = await api.patch(`/companies/${id}/toggle-status`);
      setCompanies(companies.map(c => c.id === id ? res.data : c));
    } catch (error) {
      alert('Failed to toggle status');
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

  const handleDeleteApplication = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete the application from "${studentName}"?`)) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      alert('Failed to delete application');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      const res = await api.put(`/applications/${id}/status?status=${newStatus}`);
      // Update local state and keep student/internship objects intact
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      if (newStatus === 'HIRED') {
        alert('Status updated to HIRED!');
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const downloadExcel = () => {
    if (applications.length === 0) {
      alert('No applications to download!');
      return;
    }

    const headers = ['S.No', 'Student Name', 'Email', 'Mobile', 'Skills', 'Internship Applied', 'Resume URL', 'LinkedIn URL', 'Status'];

    const rows = applications.map((app, index) => [
      index + 1,
      app.student?.name || 'N/A',
      app.student?.email || 'N/A',
      app.student?.mobile || 'N/A',
      app.student?.skills || 'N/A',
      app.internship?.title || 'N/A',
      app.student?.resumeUrl || 'N/A',
      app.student?.linkedinUrl || 'N/A',
      app.status || 'N/A',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const BOM = '\uFEFF'; // UTF-8 BOM for Excel
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KaroStartup_Applications_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div style={{ minHeight: '100vh', background: '#f0f2f5', color: '#1a1a1a', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .glass-card {
          background: #ffffff;
          border-radius: 1.25rem;
          border: 1px solid #eef0f2;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);
        }

        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 0.5rem;
          font-size: 0.95rem;
        }

        .premium-table thead th {
          background: #f8fafc;
          padding: 1rem 1.5rem;
          color: #475569;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }

        .premium-table tbody tr {
          transition: all 0.2s ease;
        }

        .premium-table tbody tr:hover {
          background-color: #f8fafc;
        }

        .premium-table td {
          padding: 1rem 1.5rem;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .premium-table tr:last-child td {
          border-bottom: none;
        }

        .admin-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        @media (max-width: 1024px) {
          .premium-table { font-size: 0.85rem; }
          .premium-table td, .premium-table th { padding: 0.8rem 1rem; }
        }

        @media (max-width: 768px) {
          .admin-welcome-text { display: none; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .tab-container { flex-direction: row; overflow-x: auto; padding-bottom: 0.5rem; }
          
          /* Table to Cards on Mobile */
          .premium-table thead { display: none; }
          .premium-table, .premium-table tbody, .premium-table tr, .premium-table td {
            display: block;
            width: 100%;
          }
          .premium-table tr {
            margin-bottom: 1.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            padding: 1.25rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            background: #fff;
          }
          .premium-table td {
            text-align: right;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }
          .premium-table td:last-child { border-bottom: none; }
          .premium-table td::before {
            content: attr(data-label);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            color: #64748b;
          }
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .btn-action {
          border: none;
          padding: 0.5rem 0.85rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view {
          color: #fb2c36;
          background: rgba(251,44,54,0.05);
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 0.8rem;
          border: 1px solid rgba(251,44,54,0.1);
          transition: all 0.2s;
        }
        .btn-view:hover {
          background: #fb2c36;
          color: #fff;
        }
      `}</style>
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
            {role === 'admin' ? 'SUPER ADMIN' : 'PARTNER'}
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
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
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
        <div className="tab-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button style={tabStyle('applications')} onClick={() => { setActiveTab('applications'); setShowPostForm(false); setShowCompanyForm(false); setFilterInternshipId(null); setFilterCompanyName('All'); }}>
             {role === 'admin' ? 'All Applications' : 'My Applicants'}
          </button>
          {role === 'admin' && (
            <button style={tabStyle('my_applications')} onClick={() => { setActiveTab('my_applications'); setShowPostForm(false); setShowCompanyForm(false); setFilterInternshipId(null); setFilterCompanyName('KaroStartup'); }}>
               KaroStartup Applicants
            </button>
          )}
          <button style={tabStyle('internships')} onClick={() => { setActiveTab('internships'); setShowPostForm(false); setShowCompanyForm(false); }}>
             {role === 'admin' ? 'All Internships' : 'My Internships'}
          </button>
          {role === 'admin' && (
            <button style={tabStyle('partners')} onClick={() => { setActiveTab('partners'); setShowPostForm(false); setShowCompanyForm(false); }}>
               Manage Partners
            </button>
          )}
          <button
            onClick={() => { setShowPostForm(true); setActiveTab('post'); setShowCompanyForm(false); }}
            style={{
              ...tabStyle('post'),
              background: activeTab === 'post' ? 'linear-gradient(135deg, #fb2c36, #e51d27)' : '#fff',
              border: activeTab === 'post' ? 'none' : '2px solid #fb2c36',
              color: activeTab === 'post' ? '#fff' : '#fb2c36',
            }}
          >
             Post New Internship
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>Loading data...</div>
        ) : (
          <>
            {/* Applications Tab */}
            {(activeTab === 'applications' || activeTab === 'my_applications') && (
              <div style={{
                background: '#fff',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #eee'
              }}>
                {/* Download Button Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid #f1f5f9',
                  background: '#ffffff',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>
                        {filterInternshipId ? `Applicants for Internship #${filterInternshipId}` : (filterCompanyName !== 'All' ? `Applications for ${filterCompanyName}` : 'Student Applications')}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.4rem 0 0', fontWeight: '500' }}>
                      {filterInternshipId 
                        ? `${applications.filter(app => app.internship?.id === filterInternshipId).length} filtered applications`
                        : (filterCompanyName !== 'All' 
                            ? `${applications.filter(app => (app.internship?.company?.name || app.internship?.companyName) === filterCompanyName).length} applications`
                            : `${applications.length} total applications`)
                      }
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Search student, email, or role..." 
                      value={applicationSearch}
                      onChange={(e) => setApplicationSearch(e.target.value)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        minWidth: '280px'
                      }}
                    />
                    {role === 'admin' && !filterInternshipId && (
                      <select 
                        value={filterCompanyName} 
                        onChange={(e) => {
                          setFilterCompanyName(e.target.value);
                          if (e.target.value === 'KaroStartup') setActiveTab('my_applications');
                          else setActiveTab('applications');
                        }}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #ddd',
                          fontSize: '0.9rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="All">All Companies</option>
                        <option value="KaroStartup">KaroStartup</option>
                        {[...new Set(companies.map(c => c.name))].filter(Boolean).map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    )}
                    { (filterInternshipId || filterCompanyName !== 'All') && (
                      <button 
                        onClick={() => { setFilterInternshipId(null); setFilterCompanyName('All'); }}
                        style={{
                          padding: '0.65rem 1.25rem',
                          borderRadius: '9999px',
                          background: '#f0f0f0',
                          color: '#333',
                          border: 'none',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                         Clear Filter
                      </button>
                    )}
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="All">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="HIRED">Hired</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <button
                      onClick={downloadExcel}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '0.6rem',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#059669'}
                      onMouseLeave={(e) => e.target.style.background = '#10b981'}
                    >
                       Download Excel
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Skills</th>
                        <th>Internship</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.filter(app => {
                        const matchesInternship = !filterInternshipId || app.internship?.id === filterInternshipId;
                        const matchesCompany = filterCompanyName === 'All' || (app.internship?.company?.name || app.internship?.companyName) === filterCompanyName;
                        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
                        const searchStr = applicationSearch.toLowerCase();
                        const matchesSearch = !searchStr || 
                          (app.student?.name || '').toLowerCase().includes(searchStr) ||
                          (app.student?.email || '').toLowerCase().includes(searchStr) ||
                          (app.internship?.title || '').toLowerCase().includes(searchStr);
                        return matchesInternship && matchesCompany && matchesStatus && matchesSearch;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            No applications match the current filter.
                          </td>
                        </tr>
                      ) : (
                        applications
                          .filter(app => {
                            const matchesInternship = !filterInternshipId || app.internship?.id === filterInternshipId;
                            const matchesCompany = filterCompanyName === 'All' || (app.internship?.company?.name || app.internship?.companyName) === filterCompanyName;
                            const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
                            const searchStr = applicationSearch.toLowerCase();
                            const matchesSearch = !searchStr || 
                              (app.student?.name || '').toLowerCase().includes(searchStr) ||
                              (app.student?.email || '').toLowerCase().includes(searchStr) ||
                              (app.internship?.title || '').toLowerCase().includes(searchStr);
                            return matchesInternship && matchesCompany && matchesStatus && matchesSearch;
                          })
                          .map((app) => (
                            <tr key={app.id}>
                              <td data-label="Student Name" style={{ fontWeight: '700', color: '#1e293b' }}>{app.student?.name || 'Unknown'}</td>
                              <td data-label="Email" style={{ color: '#64748b' }}>{app.student?.email || 'N/A'}</td>
                              <td data-label="Mobile" style={{ color: '#64748b' }}>{app.student?.mobile || 'N/A'}</td>
                              <td data-label="Skills">
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
                                  {app.student?.skills || 'N/A'}
                                </span>
                              </td>
                              <td data-label="Internship" style={{ color: '#fb2c36', fontWeight: '700' }}>{app.internship?.title || 'Unknown'}</td>
                              <td data-label="Resume">
                                {app.student?.resumeUrl ? (
                                  <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="btn-view">
                                     View
                                  </a>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No Resume</span>
                                )}
                              </td>
                              <td data-label="Status">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '160px' }}>
                                  <span className="status-badge" style={{ 
                                    background: app.status === 'REJECTED' ? 'rgba(239,68,68,0.1)' : (app.status === 'HIRED' ? 'rgba(34,197,94,0.1)' : (app.status === 'SHORTLISTED' ? 'rgba(59,130,246,0.1)' : 'rgba(148,163,184,0.1)')), 
                                    color: app.status === 'REJECTED' ? '#ef4444' : (app.status === 'HIRED' ? '#16a34a' : (app.status === 'SHORTLISTED' ? '#2563eb' : '#64748b')), 
                                    textAlign: 'center',
                                    width: 'fit-content',
                                    padding: '0.4rem 0.8rem'
                                  }}>
                                    {app.status}
                                  </span>
                                  
                                  {/* Quick Action Buttons */}
                                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <button 
                                      disabled={updatingStatusId === app.id || app.status === 'SHORTLISTED'}
                                      onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                                      style={{
                                        padding: '0.35rem 0.6rem',
                                        borderRadius: '0.4rem',
                                        border: '1px solid #2563eb',
                                        background: app.status === 'SHORTLISTED' ? '#2563eb' : 'transparent',
                                        color: app.status === 'SHORTLISTED' ? '#fff' : '#2563eb',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        opacity: updatingStatusId === app.id ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                      }}
                                      title="Shortlist Candidate"
                                    >
                                      {updatingStatusId === app.id && app.status !== 'SHORTLISTED' ? '...' : 'Shortlist'}
                                    </button>
                                    
                                    <button 
                                      disabled={updatingStatusId === app.id || app.status === 'HIRED'}
                                      onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                                      style={{
                                        padding: '0.35rem 0.6rem',
                                        borderRadius: '0.4rem',
                                        border: '1px solid #16a34a',
                                        background: app.status === 'HIRED' ? '#16a34a' : 'transparent',
                                        color: app.status === 'HIRED' ? '#fff' : '#16a34a',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        opacity: updatingStatusId === app.id ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                      }}
                                      title="Hire Candidate"
                                    >
                                      {updatingStatusId === app.id && app.status !== 'HIRED' ? '...' : 'Hired'}
                                    </button>

                                    <button 
                                      disabled={updatingStatusId === app.id || app.status === 'REJECTED'}
                                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                      style={{
                                        padding: '0.35rem 0.6rem',
                                        borderRadius: '0.4rem',
                                        border: '1px solid #ef4444',
                                        background: app.status === 'REJECTED' ? '#ef4444' : 'transparent',
                                        color: app.status === 'REJECTED' ? '#fff' : '#ef4444',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        opacity: updatingStatusId === app.id ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                      }}
                                      title="Reject Candidate"
                                    >
                                      {updatingStatusId === app.id && app.status !== 'REJECTED' ? '...' : 'Reject'}
                                    </button>
                                  </div>

                                  <select
                                    value={app.status}
                                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                    style={{
                                      padding: '0.3rem',
                                      borderRadius: '0.4rem',
                                      border: '1px solid #cbd5e1',
                                      fontSize: '0.65rem',
                                      fontWeight: '600',
                                      background: '#f8fafc',
                                      outline: 'none',
                                      color: '#64748b',
                                      cursor: 'pointer',
                                      width: '100%'
                                    }}
                                  >
                                    <option value="PENDING">Pending</option>
                                    <option value="SHORTLISTED">Shortlisted</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="HIRED">Hired</option>
                                    <option value="REJECTED">Rejected</option>
                                  </select>
                                </div>
                              </td>
                              <td data-label="Actions">
                                <button
                                  onClick={() => handleDeleteApplication(app.id, app.student?.name || 'Unknown')}
                                  style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #fb2c36', background: 'transparent', color: '#fb2c36', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                   Delete
                                </button>
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
                  <div key={int.id} className="glass-card" style={{
                    padding: '1.5rem 2rem',
                    borderRadius: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.3s'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: '#1a1a1a' }}>{int.title}</h3>
                      <p style={{ color: '#fb2c36', fontWeight: '700', fontSize: '0.9rem' }}>
                         {int.company?.name || int.companyName || 'KaroStartup'}   {int.location}
                      </p>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: '500' }}> {int.stipend}</p>
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
                        onClick={() => setSelectedInternship(int)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #ddd',
                          background: '#fff',
                          color: '#333',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                         View Details
                      </button>
                      <button
                        onClick={() => {
                          setFilterInternshipId(int.id);
                          setActiveTab('applications');
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: '#fb2c36',
                          color: '#fff',
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                         View Applicants
                      </button>
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
                         Delete
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
                        placeholder="15,000/month"
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

            {/* Manage Partners Tab (Super Admin Only) */}
            {activeTab === 'partners' && role === 'admin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Add Partner Button */}
                {!showCompanyForm && (
                  <button
                    onClick={() => setShowCompanyForm(true)}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #fb2c36, #e51d27)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                     Register New Partner Company
                  </button>
                )}

                {showCompanyForm ? (
                  <div style={{
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    border: '1px solid #eee',
                    maxWidth: '600px'
                  }}>
                    <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Register New Partner</h3>
                    <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input type="text" placeholder="Company Name" required style={inputStyle}
                        value={companyFormData.name} onChange={(e) => setCompanyFormData({...companyFormData, name: e.target.value})} />
                      <input type="email" placeholder="Company Email" required style={inputStyle}
                        value={companyFormData.email} onChange={(e) => setCompanyFormData({...companyFormData, email: e.target.value})} />
                      <input type="password" placeholder="Login Password" required style={inputStyle}
                        value={companyFormData.password} onChange={(e) => setCompanyFormData({...companyFormData, password: e.target.value})} />
                      <textarea placeholder="Description" rows="3" style={inputStyle}
                        value={companyFormData.description} onChange={(e) => setCompanyFormData({...companyFormData, description: e.target.value})} />
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="url" placeholder="Logo Image URL" required style={{...inputStyle, flex: 1}}
                          value={companyFormData.logoUrl} onChange={(e) => setCompanyFormData({...companyFormData, logoUrl: e.target.value})} />
                        {companyFormData.logoUrl && (
                          <img src={companyFormData.logoUrl} alt="Logo Preview" style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '0.5rem', border: '1px solid #eee', background: '#f9f9f9', padding: '2px' }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#fb2c36', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700' }}>Register</button>
                        <button type="button" onClick={() => setShowCompanyForm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', border: 'none', borderRadius: '0.5rem' }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {companies.map(comp => (
                      <div key={comp.id} style={{ 
                        background: '#fff', 
                        padding: '1.5rem', 
                        borderRadius: '1rem', 
                        border: '1px solid #eee',
                        opacity: comp.active === false ? 0.6 : 1,
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Outfit' }}>{comp.name}</h4>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '0.4rem', 
                            background: comp.active !== false ? 'rgba(33,115,70,0.1)' : 'rgba(251,44,54,0.1)',
                            color: comp.active !== false ? '#217346' : '#fb2c36',
                            fontWeight: '700'
                          }}>
                            {comp.active !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>{comp.email}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', background: '#f9f9f9', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}>ID: #{comp.id}</span>
                          <button 
                            onClick={() => { setSelectedCompany(comp); setShowEditCompanyForm(true); }}
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', background: '#f0f0f0', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleToggleCompanyStatus(comp.id)}
                            style={{ 
                              padding: '0.3rem 0.75rem', 
                              fontSize: '0.75rem', 
                              background: comp.active !== false ? 'rgba(251,44,54,0.1)' : 'rgba(33,115,70,0.1)', 
                              color: comp.active !== false ? '#fb2c36' : '#217346', 
                              border: 'none', 
                              borderRadius: '0.5rem', 
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}>
                            {comp.active !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Internship Details Modal */}
      {selectedInternship && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.25rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedInternship(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              
            </button>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.75rem', marginBottom: '0.5rem' }}>{selectedInternship.title}</h2>
            <p style={{ color: '#fb2c36', fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              {selectedInternship.company?.name || selectedInternship.companyName || 'KaroStartup'}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Location</p>
                <p style={{ fontWeight: '600' }}> {selectedInternship.location}</p>
              </div>
              <div>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Stipend</p>
                <p style={{ fontWeight: '600' }}> {selectedInternship.stipend}</p>
              </div>
            </div>

            <div>
              <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Description</p>
              <div style={{
                background: '#f9f9f9',
                padding: '1.25rem',
                borderRadius: '1rem',
                lineHeight: '1.6',
                color: '#444',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedInternship.description}
              </div>
            </div>

            <button
              onClick={() => setSelectedInternship(null)}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '0.85rem',
                borderRadius: '9999px',
                background: '#000',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Company Modal */}
      {showEditCompanyForm && selectedCompany && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1.25rem', backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" style={{
            background: '#fff', padding: '2.5rem', borderRadius: '1.5rem',
            maxWidth: '500px', width: '100%', position: 'relative'
          }}>
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Edit Partner Details</h3>
            <form onSubmit={handleUpdateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Company Name</label>
                <input type="text" value={selectedCompany.name} style={inputStyle}
                  onChange={(e) => setSelectedCompany({...selectedCompany, name: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email</label>
                <input type="email" value={selectedCompany.email} style={inputStyle}
                  onChange={(e) => setSelectedCompany({...selectedCompany, email: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Description</label>
                <textarea rows="3" value={selectedCompany.description} style={inputStyle}
                  onChange={(e) => setSelectedCompany({...selectedCompany, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Logo URL</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="text" value={selectedCompany.logoUrl || ''} style={{...inputStyle, flex: 1}}
                    onChange={(e) => setSelectedCompany({...selectedCompany, logoUrl: e.target.value})} />
                  {selectedCompany.logoUrl && (
                    <img src={selectedCompany.logoUrl} alt="Logo Preview" style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '0.5rem', border: '1px solid #eee', background: '#f9f9f9', padding: '2px' }} onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.9rem', background: '#fb2c36', color: '#fff', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' }}>Update Details</button>
                <button type="button" onClick={() => setShowEditCompanyForm(false)} style={{ flex: 1, padding: '0.9rem', background: '#f0f0f0', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
