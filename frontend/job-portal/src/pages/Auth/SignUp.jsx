import React from 'react';

const SignUp = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Sign Up</h1>
            <p>Create your account</p>
            <div style={{ marginTop: '20px' }}>
                <a href="/login" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Back to Login
                </a>
            </div>
        </div>
    );
};

export default SignUp;
