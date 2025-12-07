import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchUserResumes();
  }, [isAuthenticated, authLoading, navigate]);

  const fetchUserResumes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resumes/mine', {
        withCredentials: true
      });
      setResumes(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setLoading(false);
    }
  };

  const formatRatingHistory = (history) => {
    if (!history || history.length === 0) return [];
    
    return history.map((entry, index) => ({
      vote: index + 1,
      rating: entry.rating,
      date: new Date(entry.timestamp).toLocaleDateString()
    }));
  };

  const calculateWinRate = (wins, losses) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return ((wins / total) * 100).toFixed(1);
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your resumes...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
        </div>

        {resumes.length === 0 ? (
          <div className="no-resumes">
            <h3>No resumes uploaded yet</h3>
            <p>Upload your first resume to start tracking your stats!</p>
            <button 
              onClick={() => navigate('/upload')}
              className="upload-btn-link"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map((resume) => {
              const ratingData = formatRatingHistory(resume.ratingHistory);
              const winRate = calculateWinRate(resume.wins, resume.losses);
              
              return (
                <div key={resume._id} className="resume-card-dashboard">
                  <div className="resume-card-header">
                    <h3 className="resume-title">{resume.originalName}</h3>
                    <span className="resume-date">
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-box rating-box">
                      <span className="stat-label">Current Rating</span>
                      <span className="stat-value rating-value">{resume.rating}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Win Rate</span>
                      <span className="stat-value">{winRate}%</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Wins</span>
                      <span className="stat-value wins">{resume.wins}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Losses</span>
                      <span className="stat-value losses">{resume.losses}</span>
                    </div>
                  </div>

                  {ratingData.length > 1 && (
                    <div className="graph-container">
                      <h4 className="graph-title">Rating History</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={ratingData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="vote" 
                            label={{ value: 'Votes', position: 'insideBottom', offset: -5 }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                            domain={['dataMin - 50', 'dataMax + 50']}
                          />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#667eea" 
                            strokeWidth={3}
                            dot={{ fill: '#667eea', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {ratingData.length === 0 && (
                    <div className="no-data">
                      <p>No votes yet - your resume hasn't been voted on.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
