import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="brand">
            <div className="brand-logo">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">JobPortal</div>
              <div className="brand-tagline">Where talent meets opportunity.</div>
            </div>
          </div>

          <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
            <label className="newsletter-label">Get product updates and job market tips</label>
            <div className="newsletter-inputs">
              <input className="newsletter-input" type="email" placeholder="Enter your email" required />
              <button className="newsletter-btn" type="submit">Subscribe</button>
            </div>
            <p className="newsletter-hint">No spam. Unsubscribe anytime.</p>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div className="col-title">For Job Seekers</div>
            <Link to="/find-jobs" className="col-link">Find Jobs</Link>
            <Link to="/login" className="col-link">Login</Link>
            <Link to="/signup" className="col-link">Create Account</Link>
            <Link to="/saved" className="col-link">Saved Jobs</Link>
            <Link to="/profile" className="col-link">Profile</Link>
          </div>

          <div className="footer-col">
            <div className="col-title">For Employers</div>
            <Link to="/employer/dashboard" className="col-link">Dashboard</Link>
            <Link to="/employer/post" className="col-link">Post a Job</Link>
            <Link to="/employer/manage" className="col-link">Manage Jobs</Link>
            <Link to="/employer/applications" className="col-link">Applications</Link>
            <Link to="/employer/profile" className="col-link">Company Profile</Link>
          </div>

          <div className="footer-col">
            <div className="col-title">Company</div>
            <Link to="#" className="col-link">About</Link>
            <Link to="#" className="col-link">Careers</Link>
            <Link to="#" className="col-link">Press</Link>
            <Link to="#" className="col-link">Contact</Link>
          </div>

          <div className="footer-col">
            <div className="col-title">Resources</div>
            <Link to="#" className="col-link">Blog</Link>
            <Link to="#" className="col-link">Help Center</Link>
            <Link to="#" className="col-link">Guides</Link>
            <Link to="#" className="col-link">API</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="legal">
            <span>© {new Date().getFullYear()} JobPortal</span>
            <span className="dot">•</span>
            <Link to="#" className="legal-link">Privacy</Link>
            <span className="dot">•</span>
            <Link to="#" className="legal-link">Terms</Link>
            <span className="dot">•</span>
            <Link to="#" className="legal-link">Security</Link>
          </div>
          <div className="socials">
            <a href="#" aria-label="Twitter" className="social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.75c-.75.5-1.6.85-2.5 1 1-.6 1.6-1.5 1.9-2.6-.9.55-1.9.95-3 1.15A4.2 4.2 0 0 0 12 8.5c0 .35 0 .7.1 1.05-3.5-.2-6.6-1.9-8.7-4.6-.4.7-.6 1.5-.6 2.3 0 1.6.8 3 2 3.8-.7 0-1.4-.25-2-.6v.05c0 2.2 1.6 4 3.6 4.5-.4.1-.8.15-1.2.15-.3 0-.6 0-.9-.05.6 1.8 2.3 3.1 4.3 3.15-1.6 1.2-3.6 1.9-5.8 1.9H2c2.1 1.3 4.6 2 7.2 2 8.7 0 13.5-7.2 13.5-13.5v-.6c.9-.65 1.6-1.45 2.3-2.35z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.5A2.5 2.5 0 1 1 1 6.5 2.5 2.5 0 0 1 6 6.5zM1.5 8.5h3V21h-3V8.5zM9 8.5h2.9v1.7h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5.1V21h-3v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V21H9V8.5z"/></svg>
            </a>
            <a href="#" aria-label="GitHub" className="social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-1.9c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.7.1-3.6 0 0 1-.3 3.5 1.3a12 12 0 0 1 6.3 0c2.5-1.6 3.5-1.3 3.5-1.3.7 1.9.2 3.3.1 3.6.8.9 1.3 2 1.3 3.4 0 4.9-2.9 5.9-5.6 6.2.4.3.7 1 .7 2v3c0 .3.2.6.8.5A12 12 0 0 0 12 .5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


