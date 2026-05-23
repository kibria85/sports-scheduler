import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Navigation({ isAuthenticated, onLogout }: NavigationProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🏆 Sports Scheduler
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
