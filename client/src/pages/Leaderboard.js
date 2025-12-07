import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/resumes/leaderboard');
            setResumes(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">Top Resumes</h1>
            
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="leaderboard-table-wrapper">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Resume</th>
                                <th>Rating</th>
                                <th>W/L</th>
                                <th>Win Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((resume, index) => {
                                const total = resume.wins + resume.losses;
                                const winRate = total > 0 ? Math.round((resume.wins / total) * 100) : 0;
                                return (
                                    <tr key={resume._id}>
                                        <td className="rank-cell">#{index + 1}</td>
                                        <td className="resume-cell">
                                            <a 
                                                href={`http://localhost:5000/uploads/${resume.fileName}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {resume.originalName}
                                            </a>
                                            {resume.user && <span className="user-badge">User Upload</span>}
                                        </td>
                                        <td className="rating-cell">{resume.rating}</td>
                                        <td>{resume.wins}W - {resume.losses}L</td>
                                        <td>{winRate}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
