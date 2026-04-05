export default function StatCard({ icon, label, value, color = 'var(--color-brand-400)' }) {
  return (
    <div className="stat-card animate-fadeInUp">
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div className="stat-number" style={{ color }}>{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
