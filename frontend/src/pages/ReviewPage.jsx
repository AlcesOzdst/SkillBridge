import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ReviewPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/requests/my');
        const found = res.data.sent.find(r => r._id === requestId);
        if (!found) setError('Request not found or not authorized.');
        else setRequest(found);
      } catch (e) { setError('Could not load request.'); }
      finally { setFetchLoading(false); }
    };
    fetch();
  }, [requestId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/reviews', { requestId, rating, feedback });
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally { setLoading(false); }
  };

  const provider = request?.providerId;
  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="page-title">Leave a Review</div>
        <p className="page-subtitle">How was your session? Your feedback helps mentors grow.</p>

        {fetchLoading ? (
          <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
        ) : error && !request ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="card animate-fadeInUp">
            {provider && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-glass)', borderRadius: 12 }}>
                <div className="avatar avatar-lg">
                  {provider.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{provider.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{provider.department} · {provider.year}</div>
                  {request.skillId && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-brand-400)', marginTop: 4 }}>
                      Skill: {request.skillId.skillName}
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Rating <span style={{ color: '#f87171' }}>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', padding: '0.25rem',
                        transform: (hovered || rating) >= s ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s',
                        filter: (hovered || rating) >= s ? 'none' : 'grayscale(1) opacity(0.3)' }}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}>
                      ⭐
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                    {LABELS[rating]} ({rating}/5)
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="rev-fb">Feedback <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
                <textarea id="rev-fb" className="input" rows={4}
                  placeholder="Share what you learned or how the session went..."
                  value={feedback} onChange={e => setFeedback(e.target.value)} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button id="submit-review" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/requests')}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
