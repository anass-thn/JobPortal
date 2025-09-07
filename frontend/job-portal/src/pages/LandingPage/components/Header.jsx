import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  
  // Mock user data - replace with actual user context/state management
  const user = {
    fullName: "John Doe", // This should come from your auth context
    role: "jobseeker" // or "employer"
  };

  const handleDashboardClick = () => {
    if (user.role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/find-jobs');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left side - Logo and JobPortal */}
        <div className="header-left">
          <div className="logo-container">
            <div className="logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-name">JobPortal</span>
          </div>
        </div>

        {/* Middle - Navigation */}
        <nav className="header-center">
          <Link to="/find-jobs" className="nav-link">
            Find Jobs
          </Link>
          <Link to="/employer/dashboard" className="nav-link">
            For Employer
          </Link>
        </nav>

        {/* Right side - User info and Dashboard */}
        <div className="header-right">
          <span className="welcome-text">
            Welcome, {user.fullName}
          </span>
          <button 
            className="dashboard-btn"
            onClick={handleDashboardClick}
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;