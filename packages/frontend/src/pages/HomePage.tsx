import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sportsAPI } from '../api/client';

interface Sport {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  url_slug: string;
}

export default function HomePage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await sportsAPI.getAll();
        setSports(response.data);
      } catch (err) {
        setError('Failed to load sports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  if (loading) return <div className="loading">Loading sports...</div>;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Welcome to Sports Scheduler</h1>
        <p>Manage your sports events, teams, and registrations all in one place.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h2 className="card-title">Available Sports</h2>
        {sports.length === 0 ? (
          <p>No sports available yet.</p>
        ) : (
          <div className="grid grid-cols-3">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to={`/sport/${sport.url_slug}`}
                className="sport-card"
              >
                <div className="sport-card-image">{sport.name.charAt(0)}</div>
                <div className="sport-card-content">
                  <div className="sport-card-title">{sport.name}</div>
                  <div className="sport-card-description">
                    {sport.description || 'Click to view events'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
