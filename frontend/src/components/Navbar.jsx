import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Inbox, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">SkillBridge</NavLink>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <NavLink to="/skills" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <BookOpen size={15} style={{ display: 'inline', marginRight: 4 }} />
          Browse Skills
        </NavLink>

        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <LayoutDashboard size={15} style={{ display: 'inline', marginRight: 4 }} />
              Dashboard
            </NavLink>
            <NavLink to="/requests" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Inbox size={15} style={{ display: 'inline', marginRight: 4 }} />
              Requests
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Shield size={15} style={{ display: 'inline', marginRight: 4 }} />
                Admin
              </NavLink>
            )}
            <NavLink
              to={`/profile/${user._id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginLeft: '0.5rem' }}
            >
              <div className="avatar" title={user.name}>{initials}</div>
            </NavLink>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: '0.25rem' }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost btn-sm">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
