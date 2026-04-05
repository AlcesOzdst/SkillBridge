import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import BadgeChip from '../components/BadgeChip';
import ReviewCard from '../components/ReviewCard';
import { Star, MapPin, Users, BookOpen, Send } from 'lucide-react';

const TYPE_COLORS = { offered: '#2dd4bf', wanted: '#818cf8' };

export default function ProfilePage() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState({ reviews: [], averageRating: null });
  const [loading, setLoading] = useState(true);
  const [reqModal, setReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({ skillId: '', message: '', preferredTime: '' });
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState('');
  const [reqError, setReqError] = useState('');

  const isOwnProfile = me?._id === id;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (searchParams.get('request') === 'true' && profile && !isOwnProfile) {
      setReqModal(true);
    }
  }, [location.search, profile, isOwnProfile]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, sRes, rRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/skills/user/${id}`),
          api.get(`/reviews/user/${id}`),
        ]);
        setProfile(pRes.data);
        setSkills(sRes.data);
        setReviews(rRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const sendRequest = async e => {
    e.preventDefault();
    setReqLoading(true);
    setReqError('');
    try {
      await api.post('/requests', { providerId: id, ...reqForm });
      setReqSuccess('Request sent successfully!');
      setReqModal(false);
    } catch (err) {
      setReqError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="skeleton" style={{ height: 200, marginBottom: '1rem', borderRadius: 16 }} />
        <div className="grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
      </div>
    );
  }

  if (!profile) return (
    <div className="page container flex-center">
      <div className="empty-state"><h3>User not found</h3></div>
    </div>
  );

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const offeredSkills = skills.filter(s => s.type === 'offered');
  const wantedSkills = skills.filter(s => s.type === 'wanted');

  return (
    <div className="page">
      <div className="container">
        {/* ===== PROFILE HEADER ===== */}
        <div className="card animate-fadeInUp" style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(99,102,241,0.08))',
          borderColor: 'var(--color-border-brand)',
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="avatar avatar-xl">{initials}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{profile.name}</h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {profile.department && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <BookOpen size={14} style={{ display: 'inline', marginRight: 4 }} />
                    {profile.department}
                  </span>
                )}
                {profile.year && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    📅 {profile.year}
                  </span>
                )}
                {profile.preferredMode && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                    {profile.preferredMode}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 500 }}>
                  {profile.bio}
                </p>
              )}
              {profile.clubAffiliations?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {profile.clubAffiliations.map(c => (
                    <span key={c} className="badge badge-accent">
                      <Users size={10} /> {c}
                    </span>
                  ))}
                </div>
              )}
              {profile.badges?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {profile.badges.map(b => <BadgeChip key={b} badge={b} />)}
                </div>
              )}
            </div>

            {/* Reputation + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={20} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{profile.reputationPoints}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>reputation pts</div>
              </div>
              {reviews.averageRating && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{reviews.averageRating} ★</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{reviews.totalReviews} reviews</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {isOwnProfile ? (
                  <Link to="/profile/edit" className="btn btn-ghost btn-sm">Edit Profile</Link>
                ) : me && (
                  <button className="btn btn-primary btn-sm" onClick={() => setReqModal(true)}>
                    <Send size={14} /> Request Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {reqSuccess && <div className="alert alert-success animate-fadeIn" style={{ marginBottom: '1rem' }}>{reqSuccess}</div>}

        {/* ===== SKILLS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Offered */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>📤 Skills Offered ({offeredSkills.length})</h2>
            {offeredSkills.length === 0
              ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No skills offered yet.</p>
              : offeredSkills.map(s => (
                <div key={s._id} className="card-glass" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: 600 }}>{s.skillName}</span>
                    {s.level && <span style={{ fontSize: '0.75rem', color: TYPE_COLORS.offered }}>{s.level}</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{s.category} · {s.mode}</div>
                </div>
              ))
            }
          </div>
          {/* Wanted */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>📥 Skills Wanted ({wantedSkills.length})</h2>
            {wantedSkills.length === 0
              ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No skills listed as wanted.</p>
              : wantedSkills.map(s => (
                <div key={s._id} className="card-glass" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: 600 }}>{s.skillName}</span>
                    {s.level && <span style={{ fontSize: '0.75rem', color: TYPE_COLORS.wanted }}>{s.level}</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{s.category} · {s.mode}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* ===== REVIEWS ===== */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            ⭐ Reviews ({reviews.totalReviews})
            {reviews.averageRating && <span style={{ color: '#fbbf24', marginLeft: '0.75rem', fontSize: '1rem' }}>{reviews.averageRating} avg</span>}
          </h2>
          {reviews.reviews.length === 0
            ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No reviews yet.</p>
            : reviews.reviews.slice(0, 5).map(r => <ReviewCard key={r._id} review={r} />)
          }
        </div>
      </div>

      {/* ===== REQUEST MODAL ===== */}
      {reqModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setReqModal(false)}>
          <div className="card animate-fadeInUp" style={{ width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
              Request Session with {profile.name}
            </h2>
            {reqError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{reqError}</div>}
            <form onSubmit={sendRequest}>
              <div className="form-group">
                <label className="label" htmlFor="req-skill">Choose Skill</label>
                <select id="req-skill" className="select"
                  value={reqForm.skillId} onChange={e => setReqForm(p => ({ ...p, skillId: e.target.value }))} required>
                  <option value="">-- Select a skill --</option>
                  {offeredSkills.map(s => <option key={s._id} value={s._id}>{s.skillName} ({s.level})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="req-msg">Message <span style={{ textTransform: 'none', color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea id="req-msg" className="input" rows={3} placeholder="Hi! I'd love to learn React basics from you..."
                  value={reqForm.message} onChange={e => setReqForm(p => ({ ...p, message: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="req-time">Preferred Time <span style={{ textTransform: 'none', color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input id="req-time" className="input" placeholder="e.g. Weekends 3–5 PM"
                  value={reqForm.preferredTime} onChange={e => setReqForm(p => ({ ...p, preferredTime: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={reqLoading}>
                  {reqLoading ? 'Sending...' : 'Send Request'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setReqModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
