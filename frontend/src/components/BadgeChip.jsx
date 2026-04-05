// Maps badge name -> trophy emoji + color
const BADGE_META = {
  'Rising Mentor':     { emoji: '🌱', color: '#4ade80' },
  'Campus Guide':      { emoji: '🧭', color: '#2dd4bf' },
  'Skill Hero':        { emoji: '⚡', color: '#fbbf24' },
  'Community Builder': { emoji: '🏗️', color: '#818cf8' },
  'Top Mentor':        { emoji: '🏆', color: '#f59e0b' },
};

export default function BadgeChip({ badge }) {
  const meta = BADGE_META[badge] || { emoji: '🎖️', color: '#94a3b8' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.25rem 0.75rem', borderRadius: 999,
      background: `${meta.color}18`,
      border: `1px solid ${meta.color}44`,
      color: meta.color,
      fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      {meta.emoji} {badge}
    </span>
  );
}
