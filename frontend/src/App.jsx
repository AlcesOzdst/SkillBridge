import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SkillsPage from './pages/SkillsPage';
import AddSkillPage from './pages/AddSkillPage';
import RequestsPage from './pages/RequestsPage';
import ReviewPage from './pages/ReviewPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

            {/* Protected — students */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/skills/add" element={<ProtectedRoute><AddSkillPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/review/:requestId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

            {/* 404 fallback */}
            <Route path="*" element={
              <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '4rem' }}>🔍</div>
                <h1 style={{ fontSize: '1.5rem' }}>Page not found</h1>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;

