import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import BadgeChip from '../components/BadgeChip';
import { Star, BookOpen, Inbox, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [reviews, setReviews] = useState({ reviews: [], averageRating: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [skillsRes, reqRes, revRes] = await Promise.all([
          api.get(`/skills/user/${user._id}`),
          api.get('/requests/my'),
          api.get(`/reviews/user/${user._id}`),
        ]);
        setSkills(skillsRes.data);
        setRequests(reqRes.data);
        setReviews(revRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (user) fetchAll();
  }, [user]);

  const pendingReceived = requests.received.filter(r => r.status === 'pending').length;
  const completedSessions = requests.sent.filter(r => r.status === 'completed').length +
                             requests.received.filter(r => r.status === 'completed').length;

  const nextBadgePoints = [10, 50, 100, 200, 500];
  const currentPoints = user?.reputationPoints || 0;
  const nextGoal = nextBadgePoints.find(p => p > currentPoints) || 500;
  const progress = Math.min((currentPoints / nextGoal) * 100, 100);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page">
      <div className="container">
        {/* ===== HERO SECTION ===== */}
        <div className="card animate-fadeInUp" style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.15) 0%, rgba(99,102,241,0.1) 100%)',
          borderColor: 'var(--color-border-brand)',
          display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <div className="avatar avatar-xl">{initials}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="section-label">Welcome back</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {user?.name}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              {[user?.department, user?.year].filter(Boolean).join(' · ')}
            </p>
            {/* Badges */}
            {user?.badges?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {user.badges.map(b => <BadgeChip key={b} badge={b} />)}
              </div>
            )}
          </div>
          {/* Reputation */}
          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <Star size={18} fill="#fbbf24" color="#fbbf24" />
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{currentPoints}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', alignSelf: 'flex-end', marginBottom: 2 }}>pts</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
              Next goal: {nextGoal} pts
            </div>
            <div className="rep-bar-bg">
              <div className="rep-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* ===== STAT CARDS ===== */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { icon: <BookOpen size={20} />, label: 'Skills Listed', val: skills.length, color: 'var(--color-brand-400)' },
            { icon: <Inbox size={20} />, label: 'Pending Requests', val: pendingReceived, color: '#fbbf24' },
            { icon: <Star size={20} />, label: 'Sessions Done', val: completedSessions, color: '#4ade80' },
            { icon: <Star size={20} />, label: 'Avg Rating', val: reviews.averageRating ? `${reviews.averageRating} ★` : '—', color: '#818cf8' },
          ].map((s, i) => (
            <div key={s.label} className={`stat-card animate-fadeInUp stagger-${i + 1}`}>
              <div style={{ color: s.color, marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-number" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link to="/skills/add" className="btn btn-primary">
            <Plus size={16} /> Add Skill
          </Link>
          <Link to="/skills" className="btn btn-ghost">
            <BookOpen size={16} /> Browse Skills
          </Link>
          <Link to="/requests" className="btn btn-ghost">
            <Inbox size={16} /> View Requests {pendingReceived > 0 && <span className="badge badge-gold" style={{ marginLeft: 4 }}>{pendingReceived}</span>}
          </Link>
          <Link to={`/profile/${user?._id}`} className="btn btn-ghost">
            View My Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* ===== MY SKILLS ===== */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Skills</h2>
            <Link to="/skills/add" className="btn btn-ghost btn-sm"><Plus size={14} /> Add</Link>
          </div>
          {loading ? (
            <div className="grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}</div>
          ) : skills.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No skills listed yet</h3>
              <p>Add your first skill and start getting session requests!</p>
              <Link to="/skills/add" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                <Plus size={15} /> Add Your First Skill
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {skills.map(s => (
                <div key={s._id} className="card" style={{ padding: '1rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>{s.skillName}</span>
                    <span className={`badge ${s.type === 'offered' ? 'badge-brand' : 'badge-accent'}`}>
                      {s.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {s.category} · {s.level} · {s.mode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== PENDING REQUESTS ===== */}
        {requests.received.filter(r => r.status === 'pending').length > 0 && (
          <div>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔔 Pending Requests</h2>
              <Link to="/requests" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="grid-2">
              {requests.received.filter(r => r.status === 'pending').slice(0, 2).map(r => (
                <div key={r._id} className="card" style={{ padding: '1rem' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      From: {r.requesterId?.name}
                    </span>
                    <span className="status-pending">{r.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                    Skill: {r.skillId?.skillName}
                  </div>
                  <Link to="/requests" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Respond
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
