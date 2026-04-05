import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Users, Star, BookOpen } from 'lucide-react';

const FEATURES = [
  { icon: <BookOpen size={22} />, title: 'Offer Skills', desc: 'List what you can teach — from Python to dance to video editing.' },
  { icon: <Users size={22} />, title: 'Find Mentors', desc: 'Discover talented peers in your college and book sessions with them.' },
  { icon: <Star size={22} />, title: 'Earn Reputation', desc: 'Get rated after sessions and unlock badges as you help others grow.' },
  { icon: <Zap size={22} />, title: 'Smart Matching', desc: 'Our match score finds the best mentor based on skill, mode, and rating.' },
];

const DEMO_SKILLS = [
  { name: 'React.js', cat: 'Technical', color: '#2dd4bf' },
  { name: 'Figma Design', cat: 'Design', color: '#818cf8' },
  { name: 'Solidity', cat: 'Web3', color: '#fbbf24' },
  { name: 'CTF Basics', cat: 'Cybersecurity', color: '#f87171' },
  { name: 'Robotics', cat: 'Engineering', color: '#4ade80' },
  { name: 'Video Editing', cat: 'Creative', color: '#fb923c' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ====== HERO ====== */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13,148,136,0.15) 0%, transparent 70%)',
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '8%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="animate-fadeInUp">
          <div className="badge badge-brand" style={{ marginBottom: '1.5rem', fontSize: '0.75rem', padding: '0.35rem 1rem' }}>
            🎓 Built for Campus Communities
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            maxWidth: 800,
          }}>
            Exchange Skills,{' '}
            <span className="gradient-text">Grow Together</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: 560,
            marginBottom: '2.5rem',
            lineHeight: 1.7,
          }}>
            SkillBridge connects students to teach, learn, and collaborate through
            peer-to-peer skill sessions. Book sessions, earn reputation, unlock badges.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/skills')}>
                Browse Skills <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/skills" className="btn btn-ghost btn-lg">
                  Browse Skills
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Demo skill pills */}
        <div className="animate-fadeInUp stagger-2" style={{ marginTop: '4rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: 600 }}>
          {DEMO_SKILLS.map(s => (
            <div key={s.name} className="card-glass" style={{ padding: '0.5rem 1rem', borderRadius: 999, cursor: 'pointer' }}
              onClick={() => navigate(`/skills?keyword=${s.name}`)}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: s.color }}>{s.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: 6 }}>{s.cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Why SkillBridge?</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Everything you need to <span className="gradient-text">level up</span></h2>
          </div>
          <div className="grid-2">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`card animate-fadeInUp stagger-${i + 1}`}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: '1rem',
                  background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(99,102,241,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-brand-400)',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to <span className="gradient-text">bridge the gap?</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Join your campus community on SkillBridge — start sharing what you know.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
