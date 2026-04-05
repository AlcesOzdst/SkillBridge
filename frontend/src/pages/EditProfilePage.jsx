import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Data Science', 'AI & ML', 'Other'];
const YEARS = ['First Year', 'Second Year', 'Third Year', 'Final Year'];
const MODES = ['Online', 'Offline', 'Hybrid'];

export default function EditProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', department: '', year: '', bio: '',
    preferredMode: '', availability: '', clubAffiliations: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        department: user.department || '',
        year: user.year || '',
        bio: user.bio || '',
        preferredMode: user.preferredMode || '',
        availability: user.availability || '',
        clubAffiliations: (user.clubAffiliations || []).join(', '),
      });
    }
  }, [user]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const clubs = form.clubAffiliations
        ? form.clubAffiliations.split(',').map(c => c.trim()).filter(Boolean)
        : [];
      await api.put('/users/profile', { ...form, clubAffiliations: clubs });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate(`/profile/${user._id}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="page-title">Edit Profile</div>
        <p className="page-subtitle">Update your info, availability, and club affiliations.</p>

        {success && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <div className="card animate-fadeInUp">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="ep-name">Full Name</label>
              <input id="ep-name" name="name" className="input" value={form.name} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label" htmlFor="ep-dept">Department</label>
                <select id="ep-dept" name="department" className="select" value={form.department} onChange={handleChange}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="ep-year">Year</label>
                <select id="ep-year" name="year" className="select" value={form.year} onChange={handleChange}>
                  <option value="">Select</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="ep-bio">Bio</label>
              <textarea id="ep-bio" name="bio" className="input" rows={3}
                placeholder="Tell others about yourself, your interests, your goals..."
                value={form.bio} onChange={handleChange} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label" htmlFor="ep-mode">Preferred Mode</label>
                <select id="ep-mode" name="preferredMode" className="select" value={form.preferredMode} onChange={handleChange}>
                  <option value="">Select</option>
                  {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="ep-avail">Availability</label>
                <input id="ep-avail" name="availability" className="input"
                  placeholder="e.g. Weekends 4–7 PM"
                  value={form.availability} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="ep-clubs">Club Affiliations <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--color-text-muted)' }}>(comma-separated)</span></label>
              <input id="ep-clubs" name="clubAffiliations" className="input"
                placeholder="e.g. Hack-X Club, Robotics Club, Media Team"
                value={form.clubAffiliations} onChange={handleChange} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
