import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import './Vote.css';

const Vote = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetchInitialPair();
  }, []);

  const fetchInitialPair = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/resumes/pair`);
      setResumes(res.data.pair);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pair:', err);
      setLoading(false);
    }
  };

  const fetchNewResume = async (excludeId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/resumes/random?excludeId=${excludeId}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching new resume:', err);
      return null;
    }
  };

  const handleVote = async (winner, loser) => {
    if (animating) return;
    setAnimating(true);

    try {
      const voteResponse = await axios.post(`${API_BASE_URL}/api/resumes/vote`, {
        winnerId: winner._id,
        loserId: loser._id
      });

      // Update winner with new rating
      const updatedWinner = {
        ...winner,
        rating: voteResponse.data.winnerCurrentRating,
        wins: winner.wins + 1
      };

      const newOpponent = await fetchNewResume(winner._id);
      
      if (newOpponent) {
        const loserIndex = resumes.indexOf(loser);
        const winnerIndex = resumes.indexOf(winner);
        
        setTimeout(() => {
            setResumes(prev => {
                const newPair = [...prev];
                newPair[loserIndex] = newOpponent;
                newPair[winnerIndex] = updatedWinner; // Update winner with new rating
                return newPair;
            });
            setAnimating(false);
        }, 500);
      } else {
         setAnimating(false);
      }

    } catch (err) {
      console.error('Vote error:', err);
      setAnimating(false);
    }
  };

  if (loading) return <div className="vote-container loading">Loading Resumes...</div>;
  if (resumes.length < 2) return <div className="vote-container">Not enough resumes to vote!</div>;

  return (
    <div className="vote-container">
      <div className="resume-battle-ground">
        {resumes.map((resume, index) => (
          <div 
            key={resume._id} 
            className={`resume-card ${animating ? 'animating' : ''}`}
          >
            <div className="pdf-preview">
              <iframe 
                src={`${resume.cloudinaryUrl || `${API_BASE_URL}/uploads/${resume.fileName}`}#zoom=115`}
                title={resume.originalName}
                className="pdf-iframe"
                onError={(e) => console.error('PDF load error:', e)}
              />
            </div>
            <div className="resume-info">
              <div className="resume-rating">
                <span className="star-icon">⭐</span>
                <span className="rating-value">{resume.rating}</span>
              </div>
            </div>
            <div className="vote-overlay">
              <span onClick={() => handleVote(resume, resumes[index === 0 ? 1 : 0])}>
                Vote!
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="vs-badge">VS</div>
    </div>
  );
};

export default Vote;

