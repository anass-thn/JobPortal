import React from 'react';
import './Features.css';

const Features = () => {
    return (
        <section className="features">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">Everything you need to succeed</h2>
                    <p className="features-subtitle">Whether you're looking for your next opportunity or the perfect candidate, we have the tools and features to make it happen.</p>
                </div>

                <div className="features-grid">
                    <div className="features-column">
                        <div className="column-header">
                            <div className="pill pill-jobseekers">For Job Seekers</div>
                            <h3>Find work that fits your life</h3>
                            <p>Discover roles tailored to your skills, values, and growth goals.</p>
                        </div>
                        <ul className="feature-list">
                            <li>
                                <span className="icon">🔎</span>
                                Smart search with role, salary, and remote filters
                            </li>
                            <li>
                                <span className="icon">🧭</span>
                                Personalized recommendations based on your profile
                            </li>
                            <li>
                                <span className="icon">⚡</span>
                                One-click apply with saved profiles
                            </li>
                            <li>
                                <span className="icon">💬</span>
                                Direct chat with employers and instant status updates
                            </li>
                            <li>
                                <span className="icon">🔔</span>
                                Real-time job alerts for your favorite keywords
                            </li>
                        </ul>
                    </div>

                    <div className="divider" aria-hidden="true"></div>

                    <div className="features-column">
                        <div className="column-header">
                            <div className="pill pill-employers">For Employers</div>
                            <h3>Hire better, faster</h3>
                            <p>Attract the right talent and streamline your hiring workflow.</p>
                        </div>
                        <ul className="feature-list">
                            <li>
                                <span className="icon">🎯</span>
                                AI-assisted candidate matching and ranking
                            </li>
                            <li>
                                <span className="icon">📣</span>
                                Branded job postings that stand out
                            </li>
                            <li>
                                <span className="icon">📊</span>
                                Pipeline tracking and team collaboration
                            </li>
                            <li>
                                <span className="icon">⚙️</span>
                                Custom screening questions and assessments
                            </li>
                            <li>
                                <span className="icon">⏱️</span>
                                Automated scheduling and interview reminders
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;


