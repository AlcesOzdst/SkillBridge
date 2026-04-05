import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import RequestCard from '../components/RequestCard';

export default function RequestsPage() {
  const [data, setData] = useState({ sent: [], received: [] });
  const [tab, setTab] = useState('received');
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests/my');
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const current = data[tab] || [];
  const pending = data.received.filter(r => r.status === 'pending').length;

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">Session Requests</div>
        <p className="page-subtitle">Manage your incoming and outgoing skill session requests.</p>

        <div className="tabs" style={{ maxWidth: 380, marginBottom: '2rem' }}>
          <button
            className={`tab${tab === 'received' ? ' active' : ''}`}
            onClick={() => setTab('received')}
          >
            📥 Received {pending > 0 && <span className="badge badge-gold" style={{ marginLeft: 4 }}>{pending}</span>}
          </button>
          <button
            className={`tab${tab === 'sent' ? ' active' : ''}`}
            onClick={() => setTab('sent')}
          >
            📤 Sent
          </button>
        </div>

        {loading ? (
          <div className="grid-2">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}</div>
        ) : current.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{tab === 'received' ? '📭' : '📤'}</div>
            <h3>No {tab} requests yet</h3>
            <p>{tab === 'received' ? 'When students request sessions with you, they\'ll appear here.' : 'Browse skills and request sessions with mentors!'}</p>
          </div>
        ) : (
          <div className="grid-2">
            {current.map(r => (
              <div key={r._id} className="animate-fadeInUp">
                <RequestCard request={r} type={tab} onUpdate={fetchRequests} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
