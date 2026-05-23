import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SportDashboard from './pages/SportDashboard';
import EventDashboard from './pages/EventDashboard';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navigation isAuthenticated={isAuthenticated} onLogout={() => setIsAuthenticated(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage onRegister={() => setIsAuthenticated(true)} />}
            />
            <Route path="/sport/:slug" element={<SportDashboard />} />
            <Route path="/event/:eventId" element={<EventDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
