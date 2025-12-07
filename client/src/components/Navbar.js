import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import API_BASE_URL from '../config/api';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">ResumeSmash</Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Vote</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          {isAuthenticated && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          <Link to="/upload" className="nav-link">Upload</Link>
          {!isAuthenticated && (
            <a 
              href={`${API_BASE_URL}/api/auth/google`}
              className="nav-link"
            >
              Login
            </a>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="navbar-menu">
            <div className="navbar-user">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="user-avatar"
                />
              )}
              <span className="user-name">{user?.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
