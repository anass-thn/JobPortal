import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    companies: 0,
    employers: 0,
    jobsPosted: 0
  });

  const targetStats = {
    activeUsers: 12500,
    companies: 850,
    employers: 1200,
    jobsPosted: 3500
  };

  // Animate counters on component mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounter = (key, target) => {
      let current = 0;
      const increment = target / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    };

    setTimeout(() => animateCounter('activeUsers', targetStats.activeUsers), 100);
    setTimeout(() => animateCounter('companies', targetStats.companies), 200);
    setTimeout(() => animateCounter('employers', targetStats.employers), 300);
    setTimeout(() => animateCounter('jobsPosted', targetStats.jobsPosted), 400);
  }, []);

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>
      
      <div className="hero-container">
        {/* Section 1: Title and Description */}
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of{' '}
            <span className="gradient-text">Career Matching</span>
            <br />
            is Here
          </h1>
          
          <p className="hero-description">
            AI-powered job matching meets human connection. Discover opportunities that align with your skills, values, and career aspirations in our 
            next-generation talent marketplace.
          </p>
        </div>

        {/* Section 2: Buttons */}
        <div className="hero-actions">
          <Link to="/find-jobs" className="btn btn-primary">
            <span>Explore Jobs</span>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/employer/dashboard" className="btn btn-secondary">
            <span>Hire Talent</span>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Section 3: 4 Statistics Cards */}
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeUsers.toLocaleString()}+</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-number">{stats.companies.toLocaleString()}+</div>
              <div className="stat-label">Companies</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <div className="stat-number">{stats.employers.toLocaleString()}+</div>
              <div className="stat-label">Employers</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{stats.jobsPosted.toLocaleString()}+</div>
              <div className="stat-label">Jobs Posted</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
