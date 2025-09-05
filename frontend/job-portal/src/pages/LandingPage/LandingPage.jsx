import React from 'react';

const LandingPage = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Welcome to Job Portal</h1>
            <p>Find your dream job or post job opportunities</p>
            <div style={{ marginTop: '20px' }}>
                <a href="/login" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Login
                </a>
                <a href="/signup" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Sign Up
                </a>
            </div>
        </div>
    );
};

export default LandingPage;
