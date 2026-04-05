import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Technical', 'Design', 'Web3', 'Cybersecurity', 'Engineering', 'Creative', 'Business', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const MODES = ['Online', 'Offline', 'Hybrid'];

export default function AddSkillPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    skillName: '', category: '', type: 'offered', level: '', description: '', mode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/skills', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-title">Add a Skill</div>
        <p className="page-subtitle">List a skill you can teach or one you want to learn.</p>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <div className="card animate-fadeInUp">
          <form onSubmit={handleSubmit}>
            {/* Type toggle */}
            <div className="form-group">
              <label className="label">I want to</label>
              <div className="tabs">
                <button type="button" className={`tab${form.type === 'offered' ? ' active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, type: 'offered' }))}>
                  📤 Offer this skill
                </button>
                <button type="button" className={`tab${form.type === 'wanted' ? ' active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, type: 'wanted' }))}>
                  📥 Learn this skill
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="sk-name">Skill Name <span style={{ color: '#f87171' }}>*</span></label>
              <input id="sk-name" name="skillName" className="input" placeholder="e.g. React.js, Canva Design, CTF Basics"
                value={form.skillName} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label" htmlFor="sk-cat">Category <span style={{ color: '#f87171' }}>*</span></label>
                <select id="sk-cat" name="category" className="select" value={form.category} onChange={handleChange} required>
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="sk-level">Level</label>
                <select id="sk-level" name="level" className="select" value={form.level} onChange={handleChange}>
                  <option value="">Select</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="sk-mode">Preferred Mode</label>
              <select id="sk-mode" name="mode" className="select" value={form.mode} onChange={handleChange}>
                <option value="">Select</option>
                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="sk-desc">Description <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <textarea id="sk-desc" name="description" className="input" rows={3}
                placeholder="Describe what you can teach or what you're hoping to learn..."
                value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Adding...' : 'Add Skill'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
