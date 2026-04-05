import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import SkillCard from '../components/SkillCard';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Technical', 'Design', 'Web3', 'Cybersecurity', 'Engineering', 'Creative', 'Other'];
const MODES = ['All', 'Online', 'Offline', 'Hybrid'];

export default function SkillsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [skills, setSkills] = useState([]);
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('offered');
  const [mode, setMode] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (keyword) q.set('keyword', keyword);
      if (category !== 'All') q.set('category', category);
      q.set('type', type);
      if (mode !== 'All') q.set('mode', mode);
      const { data } = await api.get(`/skills?${q.toString()}`);
      setSkills(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, [type, category, mode]);

  const handleSearch = e => {
    e.preventDefault();
    fetchSkills();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">Browse Skills</div>
        <p className="page-subtitle">Discover skills offered and wanted across your campus.</p>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              id="skill-search"
              className="input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search by skill name, category, description..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
        </form>

        {/* Type toggle */}
        <div className="tabs" style={{ marginBottom: '1.25rem', maxWidth: 320 }}>
          <button className={`tab${type === 'offered' ? ' active' : ''}`} onClick={() => setType('offered')}>
            📤 Offered
          </button>
          <button className={`tab${type === 'wanted' ? ' active' : ''}`} onClick={() => setType('wanted')}>
            📥 Wanted
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-pill${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
          <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 0.25rem' }} />
          {MODES.map(m => (
            <button
              key={m}
              className={`filter-pill${mode === m ? ' active' : ''}`}
              onClick={() => setMode(m)}
            >{m}</button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid-2">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 220 }} />)}</div>
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No skills found</h3>
            <p>Try adjusting your search or filters, or be the first to list this skill!</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              {skills.length} result{skills.length !== 1 ? 's' : ''}
            </p>
            <div className="grid-2">
              {skills.map((skill, i) => (
                <div key={skill._id} className={`animate-fadeInUp stagger-${Math.min(i + 1, 5)}`}>
                  <SkillCard skill={skill} showUser />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
