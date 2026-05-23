import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sportsAPI, eventsAPI } from '../api/client';

interface Event {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export default function SportDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const [sport, setSport] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        const sportResponse = await sportsAPI.getBySlug(slug);
        setSport(sportResponse.data);

        const eventsResponse = await sportsAPI.getEvents(sportResponse.data.id);
        setEvents(eventsResponse.data);
      } catch (err) {
        setError('Failed to load sport data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!sport) return <div className="alert alert-error">Sport not found</div>;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">{sport.name}</h1>
        {sport.description && <p>{sport.description}</p>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h2 className="card-title">Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No events scheduled yet.</p>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="event-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="event-title">{event.name}</div>
                <div className="event-date">
                  {new Date(event.start_date).toLocaleDateString()} -{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </div>
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
