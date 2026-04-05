import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, dbRes] = await Promise.all([
        api.get('/admin/stats'), 
        api.get('/admin/users'),
        api.get('/admin/database')
      ]);
      setStats(sRes.data);
      setUsers(uRes.data);
      setDbData(dbRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(u => u.filter(x => x._id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-label">Admin Panel</div>
        <div className="page-title">Admin Dashboard</div>
        <p className="page-subtitle">Platform health, user management, and analytics.</p>

        <div className="tabs" style={{ maxWidth: 420, marginBottom: '2rem' }}>
          <button className={`tab${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>📊 Overview</button>
          <button className={`tab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>👥 Users</button>
          <button className={`tab${tab === 'database' ? ' active' : ''}`} onClick={() => setTab('database')}>🗄️ Database</button>
        </div>

        {loading ? (
          <div className="grid-4">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
        ) : tab === 'overview' ? (
          <>
            <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
              <StatCard icon="👤" label="Total Students" value={stats?.totalUsers} />
              <StatCard icon="📚" label="Skills Listed" value={stats?.totalSkills} color="var(--color-accent-400)" />
              <StatCard icon="📨" label="Total Requests" value={stats?.totalRequests} color="#fbbf24" />
              <StatCard icon="⭐" label="Reviews Given" value={stats?.totalReviews} color="#4ade80" />
            </div>

            {stats?.popularSkills?.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>🔥 Most Requested Skills</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {stats.popularSkills.map((s, i) => (
                    <div key={s._id} className="card-glass" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-brand-400)', width: 24, textAlign: 'center' }}>#{i + 1}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.skillName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.category}</div>
                        </div>
                      </div>
                      <span className="badge badge-brand">{s.count} requests</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats?.statusBreakdown?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>📈 Request Status Breakdown</h2>
                <div className="grid-4">
                  {stats.statusBreakdown.map(s => (
                    <div key={s._id} className="stat-card">
                      <div className={`status-${s._id}`} style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>{s._id}</div>
                      <div className="stat-number" style={{ fontSize: '1.75rem' }}>{s.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : tab === 'users' ? (
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {users.length} registered users
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map(u => (
                <div key={u._id} className="card-glass" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                      {u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{u.department} · {u.year}</span>
                    <span className="badge badge-gold">⭐ {u.reputationPoints}</span>
                    <span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-gray'}`}>{u.role}</span>
                    {u.role !== 'admin' && (
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === 'database' ? (
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Live SQL Database Schematic & Row Preview (Limit 10 per table)
            </p>
            {dbData.map(db => (
              <div key={db.tableName} className="card" style={{ marginBottom: '2rem', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-brand-400)' }}>🗃️ {db.tableName}</h3>
                {db.rows.length === 0 ? (
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>0 rows in set.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-glass)' }}>
                        {Object.keys(db.rows[0]).map(col => (
                          <th key={col} style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {db.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          {Object.values(row).map((val, vi) => (
                            <td key={vi} style={{ padding: '0.75rem', color: 'var(--color-text-primary)' }}>
                              {val === null ? <span style={{ color: 'var(--color-text-muted)' }}>NULL</span> : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
