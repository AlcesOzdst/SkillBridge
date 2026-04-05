import { Link } from 'react-router-dom';
import { MapPin, BookOpen, Star, ArrowRight } from 'lucide-react';

const LEVEL_COLORS = { Beginner: '#4ade80', Intermediate: '#fbbf24', Advanced: '#f87171' };
const TYPE_COLORS  = { offered: '#2dd4bf', wanted: '#818cf8' };

export default function SkillCard({ skill, showUser = true }) {
  const user = skill.user || {};

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top row */}
      <div className="flex-between">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
            background: `${TYPE_COLORS[skill.type]}18`,
            border: `1px solid ${TYPE_COLORS[skill.type]}44`,
            color: TYPE_COLORS[skill.type],
          }}>
            {skill.type === 'offered' ? '📤 Offering' : '📥 Wanted'}
          </span>
          {skill.level && (
            <span style={{
              padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
              background: `${LEVEL_COLORS[skill.level] || '#94a3b8'}18`,
              border: `1px solid ${LEVEL_COLORS[skill.level] || '#94a3b8'}44`,
              color: LEVEL_COLORS[skill.level] || '#94a3b8',
            }}>
              {skill.level}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{skill.category}</span>
      </div>

      {/* Skill name */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{skill.skillName}</h3>
        {skill.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {skill.description.length > 100 ? skill.description.slice(0, 100) + '…' : skill.description}
          </p>
        )}
      </div>

      {/* Mode */}
      {skill.mode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <MapPin size={13} />
          {skill.mode}
        </div>
      )}

      {/* User row */}
      {showUser && user.name && (
        <>
          <hr className="divider" style={{ margin: '0' }} />
          <div className="flex-between">
            <Link to={`/profile/${user._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {[user.department, user.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            </Link>
            {user.reputationPoints !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#fbbf24' }}>
                <Star size={13} fill="#fbbf24" />
                <span style={{ fontWeight: 700 }}>{user.reputationPoints}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* CTA */}
      {showUser && user._id && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/profile/${user._id}`} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: 'center', border: '1px solid var(--color-border)' }}>
            View Profile
          </Link>
          {skill.type === 'offered' && (
            <Link to={`/profile/${user._id}?request=true`} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              Request <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
