import React, { useState, useRef, useEffect } from 'react';

const socialPlatforms = {
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    url: 'https://www.instagram.com/karo_startup/',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    posts: [
      { id: 1, image: '🚀', caption: 'Launching new startup partnerships across India! 🇮🇳', likes: '2,847', comments: '142', time: '2h ago', user: 'karostartup' },
      { id: 2, image: '💼', caption: 'Our interns are building the future, one project at a time ✨', likes: '1,923', comments: '89', time: '5h ago', user: 'karostartup' },
      { id: 3, image: '🎯', caption: 'Goal setting workshop with 500+ students! Amazing energy 🔥', likes: '3,456', comments: '201', time: '1d ago', user: 'karostartup' },
      { id: 4, image: '🏆', caption: 'Congratulations to our top 10 interns of the month! 🌟', likes: '4,102', comments: '312', time: '2d ago', user: 'karostartup' },
      { id: 5, image: '📈', caption: '5000+ startup stories published and counting! 📖', likes: '5,678', comments: '445', time: '3d ago', user: 'karostartup' },
      { id: 6, image: '🤝', caption: 'Networking event highlights from Bangalore meetup 🎉', likes: '2,190', comments: '167', time: '4d ago', user: 'karostartup' },
    ]
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2, #0a5dc2)',
    url: 'https://www.facebook.com/karostartup/',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    posts: [
      { id: 1, content: '🎉 Exciting news! KaroStartup just crossed 1 Million followers. Thank you for being part of our journey to empower Bharat\'s entrepreneurs!', likes: '12K', shares: '3.2K', comments: '856', time: '3 hours ago', user: 'KaroStartup', avatar: 'K' },
      { id: 2, content: '📢 New internship alert! 15 startups have posted fresh opportunities this week. From AI/ML to Digital Marketing — there\'s something for everyone. Apply now on our portal!', likes: '8.5K', shares: '2.1K', comments: '634', time: '8 hours ago', user: 'KaroStartup', avatar: 'K' },
      { id: 3, content: '💡 "The best time to start was yesterday. The next best time is now." — Meet Rahul, who went from our intern to CTO of a funded startup in just 2 years!', likes: '15K', shares: '5.4K', comments: '1.2K', time: '1 day ago', user: 'KaroStartup', avatar: 'K' },
    ]
  },
  twitter: {
    name: 'Twitter / X',
    color: '#000000',
    gradient: 'linear-gradient(135deg, #14171A, #657786)',
    url: 'https://twitter.com/karo_startup',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    posts: [
      { id: 1, content: 'Just published our 5,000th startup story! 🚀 From chai stalls to tech unicorns — Bharat\'s founders are rewriting the rules. #KaroStartup #StartupIndia', likes: '4.2K', retweets: '1.8K', replies: '234', time: '1h', user: '@karostartup', verified: true },
      { id: 2, content: 'Hot take: The best learning doesn\'t happen in classrooms. It happens when you ship real products at real startups. \n\nThat\'s exactly what our internship platform offers. 💪', likes: '7.8K', retweets: '3.2K', replies: '567', time: '4h', user: '@karostartup', verified: true },
      { id: 3, content: '📊 This month\'s numbers:\n\n• 500+ new applications\n• 45 startups onboarded\n• 120 interns placed\n• 98% satisfaction rate\n\nWe\'re just getting started. 🔥', likes: '9.1K', retweets: '4.5K', replies: '789', time: '12h', user: '@karostartup', verified: true },
      { id: 4, content: 'Reminder: Your college CGPA doesn\'t define your startup potential.\n\nSkills > Grades. Always. 🎯\n\n#InternshipTips #CareerAdvice', likes: '12K', retweets: '6.7K', replies: '1.1K', time: '1d', user: '@karostartup', verified: true },
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    gradient: 'linear-gradient(135deg, #0A66C2, #004182)',
    url: 'https://www.linkedin.com/company/karo-startup/',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    posts: [
      { id: 1, content: "I'm thrilled to announce that KaroStartup's internship platform has successfully placed 1,000+ students across 200+ startups in India.\n\nWhat started as a simple idea has now become a movement. We believe every student deserves real-world experience, not just theoretical knowledge.\n\n#Hiring #Internships #StartupEcosystem", likes: '2,345', comments: '189', time: '2 days ago', user: 'KaroStartup Official', role: 'India\'s Largest Startup Storytelling Platform', avatar: 'K' },
      { id: 2, content: "🔔 We're hiring!\n\nLooking for passionate interns in:\n• Full Stack Development\n• UI/UX Design\n• Content & Social Media Marketing\n• Business Development\n\nNo prior experience needed — just hunger to learn and build.\n\nApply through our portal today!\n\n#JobAlert #FreshersWelcome", likes: '5,678', comments: '423', time: '4 days ago', user: 'KaroStartup Official', role: 'India\'s Largest Startup Storytelling Platform', avatar: 'K' },
    ]
  }
};

function InstagramFeed({ posts }) {
  return (
    <div className="sf-instagram-feed">
      <div className="sf-ig-header">
        <div className="sf-ig-avatar">K</div>
        <div className="sf-ig-info">
          <strong>karostartup</strong>
          <span>5,247 posts · 1.2M followers</span>
        </div>
        <button className="sf-ig-follow-btn">Follow</button>
      </div>
      <div className="sf-ig-grid">
        {posts.map(post => (
          <div key={post.id} className="sf-ig-post">
            <div className="sf-ig-post-emoji">{post.image}</div>
            <div className="sf-ig-post-overlay">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacebookFeed({ posts }) {
  return (
    <div className="sf-facebook-feed">
      {posts.map(post => (
        <div key={post.id} className="sf-fb-post">
          <div className="sf-fb-post-header">
            <div className="sf-fb-avatar">{post.avatar}</div>
            <div>
              <strong>{post.user}</strong>
              <span className="sf-fb-time">{post.time} · 🌐</span>
            </div>
          </div>
          <p className="sf-fb-content">{post.content}</p>
          <div className="sf-fb-stats">
            <span>👍 {post.likes}</span>
            <span>{post.comments} comments · {post.shares} shares</span>
          </div>
          <div className="sf-fb-actions">
            <button>👍 Like</button>
            <button>💬 Comment</button>
            <button>↗️ Share</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TwitterFeed({ posts }) {
  return (
    <div className="sf-twitter-feed">
      {posts.map(post => (
        <div key={post.id} className="sf-tw-post">
          <div className="sf-tw-avatar">K</div>
          <div className="sf-tw-body">
            <div className="sf-tw-header">
              <strong>KaroStartup</strong>
              <span className="sf-tw-handle">{post.user}</span>
              {post.verified && <span className="sf-tw-verified">✓</span>}
              <span className="sf-tw-dot">·</span>
              <span className="sf-tw-time">{post.time}</span>
            </div>
            <p className="sf-tw-content">{post.content}</p>
            <div className="sf-tw-actions">
              <span>💬 {post.replies}</span>
              <span>🔁 {post.retweets}</span>
              <span>❤️ {post.likes}</span>
              <span>📤</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkedInFeed({ posts }) {
  return (
    <div className="sf-linkedin-feed">
      {posts.map(post => (
        <div key={post.id} className="sf-li-post">
          <div className="sf-li-header">
            <div className="sf-li-avatar">{post.avatar}</div>
            <div>
              <strong>{post.user}</strong>
              <span className="sf-li-role">{post.role}</span>
              <span className="sf-li-time">{post.time}</span>
            </div>
          </div>
          <p className="sf-li-content">{post.content}</p>
          <div className="sf-li-stats">
            <span>👍 {post.likes} reactions</span>
            <span>{post.comments} comments</span>
          </div>
          <div className="sf-li-actions">
            <button>👍 Like</button>
            <button>💬 Comment</button>
            <button>🔁 Repost</button>
            <button>📤 Send</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SocialFeed() {
  const [activePlatform, setActivePlatform] = useState(null);
  const feedRef = useRef(null);

  const handleToggle = (platform) => {
    if (activePlatform === platform) {
      setActivePlatform(null);
    } else {
      setActivePlatform(platform);
    }
  };

  useEffect(() => {
    if (activePlatform && feedRef.current) {
      setTimeout(() => {
        feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activePlatform]);

  const renderFeed = () => {
    if (!activePlatform) return null;
    const data = socialPlatforms[activePlatform];
    switch (activePlatform) {
      case 'instagram': return <InstagramFeed posts={data.posts} />;
      case 'facebook': return <FacebookFeed posts={data.posts} />;
      case 'twitter': return <TwitterFeed posts={data.posts} />;
      case 'linkedin': return <LinkedInFeed posts={data.posts} />;
      default: return null;
    }
  };

  const active = activePlatform ? socialPlatforms[activePlatform] : null;

  return (
    <footer className="sf-footer">
      <div className="sf-footer-inner container">
        {/* Feed Section */}
        {activePlatform && (
          <div
            ref={feedRef}
            className="sf-feed-section"
            style={{ '--platform-color': active.color }}
          >
            <div className="sf-feed-header">
              <div className="sf-feed-title">
                <span className="sf-feed-icon" style={{ background: active.gradient, color: '#fff' }}>
                  {active.icon}
                </span>
                <h3>{active.name}</h3>
              </div>
              <button className="sf-feed-close" onClick={() => setActivePlatform(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="sf-feed-content">
              {renderFeed()}
            </div>
          </div>
        )}

        {/* Social Icons Bar */}
        <div className="sf-social-bar">
          <p className="sf-follow-text">Follow <span className="text-gradient">KaroStartup</span></p>
          <div className="sf-icons-row">
            {Object.entries(socialPlatforms).map(([key, platform]) => (
              <a
                key={key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`sf-icon-btn`}
                style={{
                  '--btn-color': platform.color,
                  '--btn-gradient': platform.gradient,
                }}
                aria-label={platform.name}
              >
                {platform.icon}
                <span className="sf-icon-label">{platform.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="sf-copyright">
          <p>© 2025 KaroStartup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
