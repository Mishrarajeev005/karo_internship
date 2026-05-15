import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import api from '../api';
import techflit from '../assets/partners/techflit.png';
import eduvibe from '../assets/partners/eduvibe.png';
import greenroot from '../assets/partners/greenroot.png';
import healthsync from '../assets/partners/healthsync.png';

const localLogos = {
  TechFlit: techflit,
  EduVibe: eduvibe,
  GreenRoot: greenroot,
  HealthSync: healthsync
};

function LandingPage() {
  const [partners, setPartners] = useState([]);

  const marqueeRef = useRef(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get('/companies');
        const activePartners = res.data.filter(c => c.active !== false);
        setPartners(activePartners.map(c => ({
          name: c.name,
          logo: localLogos[c.name] || c.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`
        })));
      } catch (err) {
        console.error("Failed to fetch partners", err);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || partners.length === 0) return;

    const totalWidth = marquee.scrollWidth / 2;
    
    gsap.to(marquee, {
      x: -totalWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marquee, { x: 0 });
      }
    });

    // Pause on hover
    marquee.addEventListener('mouseenter', () => gsap.globalTimeline.pause());
    marquee.addEventListener('mouseleave', () => gsap.globalTimeline.play());

    return () => {
      gsap.killTweensOf(marquee);
    };
  }, [partners]);

  return (
    <>
      <main className="container">
        <section className="hero">
          <h1>
            Kickstart Your Career with <br />
            <span className="text-gradient">Real Startup Experience</span>
          </h1>
          <p>
            The official internship portal by KaroStartup. Connect directly with India's fastest-growing startups, learn from founders, and build your future.
          </p>
          <div className="hero-actions">
            <Link to="/internships" className="btn btn-primary">Browse Internships</Link>
          </div>
        </section>
      </main>

      <section className="partners-section">
        <div className="partners-container">
          <div className="partners-label">
            <span>&#123;</span> Our Hiring Partners <span>&#125;</span>
          </div>
          
          <div className="marquee-wrapper">
            {partners.length > 0 ? (
              <div className="marquee-content" ref={marqueeRef}>
                {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
                  <div key={index} className="partner-logo-item">
                    <img src={partner.logo} alt={partner.name} className="partner-logo-img" title={partner.name} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No active partners at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <main className="container">
        <section id="about" className="about">
          <h2>About <span className="text-gradient">KaroStartup</span></h2>
          <p>
            <strong>KaroStartup</strong> is India’s largest storytelling platform highlighting the incredible journeys of founders from smaller cities. With over <strong>5,000+ stories published</strong> and a community of millions, we represent the true voice of Bharat's entrepreneurial ecosystem.
            <br/><br/>
            <strong>Why an Internship Platform?</strong> We realized that while startups need hungry, passionate talent, students are desperate for real-world experience. Our platform strictly connects students with legitimate startups solving real problems. Skip the crowded job boards—get hired by the next unicorn and make a measurable impact from day one.
          </p>
        </section>

        <section id="process" className="process">
          <h2>How It Works</h2>
          <div className="grid-3">
            <div className="card">
              <div className="card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3>1. Explore Roles</h3>
              <p>Browse through hundreds of curated internship opportunities from verified startups across India. Filter by role, stipend, and remote availability.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3>2. Apply Directly</h3>
              <p>No middlemen horizontally scaling your resume. Apply directly to founders with a streamlined application process. Showcase your skills, not just your CV.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3>3. Learn & Grow</h3>
              <p>Work directly with founders and core teams. Build products from scratch, gain rapid real-world exposure, and kickstart your career trajectory.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LandingPage;
