import React from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to your Dashboard!</h1>
        
        <div className="user-info">
          <div className="user-avatar-large">
            {user?.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="avatar-image"
              />
            )}
          </div>
          
          <div className="user-details">
            <h2>{user?.name}</h2>
            <p className="user-email">{user?.email}</p>
            <p className="user-id">ID: {user?.id}</p>
          </div>
        </div>
        
        <div className="dashboard-content">
          <h3>Authentication Status: ✅ Authenticated</h3>
          <p>You have successfully logged in using Google OAuth!</p>
          
          <div className="features-list">
            <h4>What's working:</h4>
            <ul>
              <li>✅ Google OAuth Integration</li>
              <li>✅ Redux State Management</li>
              <li>✅ Protected Routes</li>
              <li>✅ Session Management</li>
              <li>✅ User Profile Display</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
