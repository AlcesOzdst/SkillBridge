const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars first so they are available to imported files
dotenv.config();

const { connectDB } = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Configure CORS allowlist
const configuredFrontends = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultOrigins = [
  'https://skillbridges.dev',
  'https://www.skillbridges.dev',
  ...configuredFrontends
];

if (process.env.NODE_ENV !== 'production') {
  defaultOrigins.push(
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  );
}

const allowedOrigins = [...new Set(defaultOrigins)];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isPlatformHosted = origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app');

    if (isExplicitlyAllowed || isPlatformHosted) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());

// Health Check Endpoints (for Render and uptime monitoring)
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'skillbridge-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('SkillBridge API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

