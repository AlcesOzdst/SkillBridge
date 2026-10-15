import axios from 'axios';

// Normalize API base URL:
// - In local development without VITE_API_URL, fallback to '/api' (proxied via Vite).
// - In production with VITE_API_URL (e.g. https://skillbridge-backend.onrender.com),
//   strip trailing slashes and ensure /api is cleanly appended.
const rawBaseURL = (import.meta.env.VITE_API_URL || '').trim();
const baseURL = (() => {
  if (!rawBaseURL) return '/api';
  const clean = rawBaseURL.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
})();

const api = axios.create({
  baseURL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
