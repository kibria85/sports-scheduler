import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI, paymentsAPI } from '../api/client';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Admin {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  payment_status: string;
}

interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone: string;
  payment_status: string;
  amount_due: number;
}

interface Team {
  id: string;
  name: string;
  logo_url?: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function EventDashboard() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!eventId) return;

        const [eventRes, teamsRes, sponsorsRes] = await Promise.all([
          eventsAPI.get(eventId),
          eventsAPI.getTeams(eventId),
          paymentsAPI.getEventSponsors(eventId),
        ]);

        setEvent(eventRes.data);
        setTeams(teamsRes.data);
        setSponsors(sponsorsRes.data);
      } catch (err) {
        setError('Failed to load event data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) return <div className="loading">Loading event...</div>;
  if (!event) return <div className="alert alert-error">Event not found</div>;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">{event.name}</h1>
        <p>{event.description}</p>
        <p>
          📅 {new Date(event.start_date).toLocaleDateString()} -{' '}
          {new Date(event.end_date).toLocaleDateString()}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <button
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{
              marginRight: '0.5rem',
              background: activeTab === 'overview' ? '' : 'transparent',
              color: activeTab === 'overview' ? 'white' : '#4b5563',
            }}
          >
            Overview
          </button>
          <button
            className={`btn ${activeTab === 'teams' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('teams')}
            style={{
              marginRight: '0.5rem',
              background: activeTab === 'teams' ? '' : 'transparent',
              color: activeTab === 'teams' ? 'white' : '#4b5563',
            }}
          >
            Teams
          </button>
          <button
            className={`btn ${activeTab === 'sponsors' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('sponsors')}
            style={{
              marginRight: '0.5rem',
              background: activeTab === 'sponsors' ? '' : 'transparent',
              color: activeTab === 'sponsors' ? 'white' : '#4b5563',
            }}
          >
            Sponsors
          </button>
          <button
            className={`btn ${activeTab === 'calendar' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('calendar')}
            style={{
              background: activeTab === 'calendar' ? '' : 'transparent',
              color: activeTab === 'calendar' ? 'white' : '#4b5563',
            }}
          >
            Calendar
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Teams</div>
              <div className="stat-value">{teams.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Sponsors</div>
              <div className="stat-value">{sponsors.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Days Remaining</div>
              <div className="stat-value">
                {Math.max(0, Math.ceil((new Date(event.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h3 className="card-title">Teams</h3>
            {teams.length === 0 ? (
              <p>No teams yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Players</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>TBD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div>
            <h3 className="card-title">Sponsors</h3>
            {sponsors.length === 0 ? (
              <p>No sponsors yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td>{sponsor.name}</td>
                      <td>${sponsor.amount_due}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          background: sponsor.payment_status === 'done' ? '#d1fae5' : '#fee2e2',
                          color: sponsor.payment_status === 'done' ? '#065f46' : '#991b1b',
                        }}>
                          {sponsor.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <h3 className="card-title">Event Calendar</h3>
            <p>Calendar view for {new Date(event.start_date).getFullYear()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
