import React, { useEffect, useState } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    jobsPosted: 0,
    successfulHires: 0,
    matchRate: 0
  });

  // Percent changes and progress-to-goal (example values)
  const meta = {
    activeUsersGrowth: 14, // % vs last month
    jobsPostedGrowth: 9,
    successfulHiresGrowth: 12,
    matchRateGoalProgress: 92
  };

  const targets = {
    activeUsers: 12500,
    jobsPosted: 3500,
    successfulHires: 2100,
    matchRate: 92
  };

  useEffect(() => {
    const duration = 1800;
    const frames = 60;
    const step = duration / frames;

    const animate = (key, target) => {
      let current = 0;
      const inc = target / frames;
      const t = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(t);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, step);
    };

    animate('activeUsers', targets.activeUsers);
    setTimeout(() => animate('jobsPosted', targets.jobsPosted), 120);
    setTimeout(() => animate('successfulHires', targets.successfulHires), 240);
    setTimeout(() => animate('matchRate', targets.matchRate), 360);
  }, []);

  return (
    <section className="analytics">
      <div className="analytics-container">
        <header className="analytics-header">
          <h2 className="analytics-title">Platform analytics</h2>
          <p className="analytics-subtitle">Real-time indicators that show how our marketplace connects people with the right opportunities — at scale.</p>
        </header>

        <div className="analytics-grid">
          <div className="analytic-card">
            <div className="analytic-icon">👥</div>
            <div className="analytic-content">
              <div className="analytic-topline">
                <div className="analytic-number">{stats.activeUsers.toLocaleString()}+</div>
                <span className="trend ">+{meta.activeUsersGrowth}%</span>
              </div>
              <div className="analytic-label">Active Users</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, 70 + meta.activeUsersGrowth))}%` }}></div>
              </div>
            </div>
          </div>

          <div className="analytic-card">
            <div className="analytic-icon">📌</div>
            <div className="analytic-content">
              <div className="analytic-topline">
                <div className="analytic-number">{stats.jobsPosted.toLocaleString()}+</div>
                <span className="trend trend-up">+{meta.jobsPostedGrowth}%</span>
              </div>
              <div className="analytic-label">Jobs Posted</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, 60 + meta.jobsPostedGrowth))}%` }}></div>
              </div>
            </div>
          </div>

          <div className="analytic-card">
            <div className="analytic-icon">✅</div>
            <div className="analytic-content">
              <div className="analytic-topline">
                <div className="analytic-number">{stats.successfulHires.toLocaleString()}+</div>
                <span className="trend ">+{meta.successfulHiresGrowth}%</span>
              </div>
              <div className="analytic-label">Successful Hires</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, 65 + meta.successfulHiresGrowth))}%` }}></div>
              </div>
            </div>
          </div>

          <div className="analytic-card">
            <div className="analytic-icon">🎯</div>
            <div className="analytic-content">
              <div className="analytic-topline">
                <div className="analytic-number">{stats.matchRate}%</div>
                <span className="trend trend-up">{meta.matchRateGoalProgress}% goal</span>
              </div>
              <div className="analytic-label">Match Rate</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, meta.matchRateGoalProgress))}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;


