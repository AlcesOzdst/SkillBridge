import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Hash, Building2, Calendar } from 'lucide-react';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Data Science', 'AI & ML', 'Other'];
const YEARS = ['First Year', 'Second Year', 'Third Year', 'Final Year'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', prn: '', password: '', department: '', year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldIcon = (Icon) => (
    <Icon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
  );

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div className="card animate-fadeInUp" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-brand-600))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create account</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Join SkillBridge — your campus skill network
            </p>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label className="label" htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                {fieldIcon(User)}
                <input id="reg-name" name="name" type="text" className="input" style={{ paddingLeft: '2.5rem' }}
                  placeholder="Parth Sharma" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="label" htmlFor="reg-email">College Email</label>
              <div style={{ position: 'relative' }}>
                {fieldIcon(Mail)}
                <input id="reg-email" name="email" type="email" className="input" style={{ paddingLeft: '2.5rem' }}
                  placeholder="parth@college.edu" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* PRN */}
            <div className="form-group">
              <label className="label" htmlFor="reg-prn">PRN / Roll No <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                {fieldIcon(Hash)}
                <input id="reg-prn" name="prn" type="text" className="input" style={{ paddingLeft: '2.5rem' }}
                  placeholder="2023XXXX1234" value={form.prn} onChange={handleChange} />
              </div>
            </div>

            {/* Dept + Year side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="label" htmlFor="reg-dept">Department</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1, pointerEvents: 'none' }} />
                  <select id="reg-dept" name="department" className="select" style={{ paddingLeft: '2.5rem' }}
                    value={form.department} onChange={handleChange}>
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="reg-year">Year</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 1, pointerEvents: 'none' }} />
                  <select id="reg-year" name="year" className="select" style={{ paddingLeft: '2.5rem' }}
                    value={form.year} onChange={handleChange}>
                    <option value="">Select</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                {fieldIcon(Lock)}
                <input id="reg-password" name="password" type="password" className="input" style={{ paddingLeft: '2.5rem' }}
                  placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
            </div>

            <button id="register-submit" type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <hr className="divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-brand-400)', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
