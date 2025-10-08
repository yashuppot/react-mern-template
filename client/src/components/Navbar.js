import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
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
          <h2>MERN Auth</h2>
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
