import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Clock, CheckCircle, XCircle, Star } from 'lucide-react';

export default function RequestCard({ request, type, onUpdate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const other = type === 'sent' ? request.provider : request.requester;
  const skill = request.skill;
  const initials = other?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const action = async (endpoint) => {
    setLoading(true);
    try {
      await api.put(`/requests/${request._id}/${endpoint}`, endpoint === 'respond' ? {} : {});
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (status) => {
    setLoading(true);
    try {
      await api.put(`/requests/${request._id}/respond`, { status });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Status + time */}
      <div className="flex-between">
        <span className={`status-${request.status}`}>{request.status}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Skill info */}
      {skill && (
        <div style={{ padding: '0.75rem', background: 'var(--color-bg-glass)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>SKILL</div>
          <div style={{ fontWeight: 700 }}>{skill.skillName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{skill.category} · {skill.level} · {skill.mode}</div>
        </div>
      )}

      {/* Other user */}
      {other && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{initials}</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {type === 'sent' ? 'Mentor: ' : 'Requester: '}
              <Link to={`/profile/${other._id}`} style={{ color: 'var(--color-brand-400)', textDecoration: 'none' }}>
                {other.name}
              </Link>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{other.department} · {other.year}</div>
          </div>
        </div>
      )}

      {/* Message */}
      {request.message && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, padding: '0.5rem', background: 'var(--color-bg-glass)', borderRadius: 8, borderLeft: '3px solid var(--color-brand-600)' }}>
          {request.message}
        </p>
      )}

      {/* Preferred time */}
      {request.preferredTime && (
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          📅 Preferred: {request.preferredTime}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
        {/* Received + pending → Accept / Reject */}
        {type === 'received' && request.status === 'pending' && (
          <>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => respond('accepted')} disabled={loading}>
              <CheckCircle size={14} /> Accept
            </button>
            <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => respond('rejected')} disabled={loading}>
              <XCircle size={14} /> Reject
            </button>
          </>
        )}

        {/* Sent + accepted → Mark Complete */}
        {type === 'sent' && request.status === 'accepted' && (
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => action('complete')} disabled={loading}>
            <CheckCircle size={14} /> Mark Completed
          </button>
        )}

        {/* Sent + pending → Cancel */}
        {type === 'sent' && request.status === 'pending' && (
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => action('cancel')} disabled={loading}>
            Cancel
          </button>
        )}

        {/* Sent + completed + no review → Review */}
        {type === 'sent' && request.status === 'completed' && !request.reviewed && (
          <Link
            to={`/review/${request._id}`}
            className="btn btn-accent btn-sm"
            style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
          >
            <Star size={14} /> Leave Review
          </Link>
        )}
      </div>
    </div>
  );
}
