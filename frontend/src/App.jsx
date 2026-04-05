import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="text-4xl font-extrabold text-brand-600 mb-4">Welcome to SkillBridge 🚀</h1>
    <p className="text-lg text-gray-600 max-w-lg">
      A peer-to-peer campus platform to exchange skills, schedule mentorship sessions, and earn reputation points.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar placeholder */}
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-600">SkillBridge</div>
          <div className="space-x-4">
            <button className="text-gray-600 hover:text-brand-600 border px-4 py-2 rounded-lg">Login</button>
            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg">Sign Up</button>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
