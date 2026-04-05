import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const reviewer = review.reviewerId || {};
  const initials = reviewer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="card-glass" style={{ padding: '1.25rem' }}>
      <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
        <Link to={`/profile/${reviewer._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials}</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{reviewer.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{reviewer.department}</div>
          </div>
        </Link>
        <div>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={14} fill={s <= review.rating ? '#fbbf24' : 'none'} color={s <= review.rating ? '#fbbf24' : '#64748b'} />
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: 2 }}>
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      {review.feedback && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>"{review.feedback}"</p>
      )}
    </div>
  );
}
