const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(cookieParser());

// Dummy users database
const users = [
  {
    id: '1',
    email: 'lukas@example.com',
    password: 'password123',
    name: 'Lukas Koenig',
    initials: 'LK',
  },
  {
    id: '2',
    email: 'demo@calendly.com',
    password: 'demo123',
    name: 'Demo User',
    initials: 'DU',
  },
];

// Dummy sessions
const sessions = {};

// Event types storage (in-memory)
let eventTypes = [
  {
    id: '1',
    title: '30 Minute Meeting',
    duration: 30,
    type: 'One-on-One',
    platform: 'Google Meet',
    availability: 'Weekdays, 10:30 am - 12:30 pm',
    color: 'purple',
  },
];

// Auth endpoints
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions[sessionId] = { userId: user.id, email: user.email };

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials,
    },
    sessionId,
  });
});

app.post('/api/auth/signout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  res.clearCookie('sessionId');
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const session = sessions[sessionId];
  const user = users.find(u => u.id === session.userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials,
    },
  });
});

// Event types endpoints
app.get('/api/event-types', (req, res) => {
  res.json(eventTypes);
});

app.post('/api/event-types', (req, res) => {
  console.log('POST /api/event-types hit');
  console.log('Cookies:', req.cookies);
  console.log('Body:', req.body);
  
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Not authenticated. Please sign in again.' });
  }

  const { title, duration, type, platform, availability, color } = req.body;

  if (!title || !duration || !type) {
    return res.status(400).json({ error: 'Missing required fields: title, duration, and type are required.' });
  }

  // Ensure duration is a number
  const durationNum = parseInt(duration, 10);
  if (isNaN(durationNum) || durationNum <= 0) {
    return res.status(400).json({ error: 'Duration must be a positive number.' });
  }

  const newEventType = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title.trim(),
    duration: durationNum,
    type: type,
    platform: platform || 'Google Meet',
    availability: availability || 'Weekdays, 9:00 am - 5:00 pm',
    color: color || 'purple',
  };

  eventTypes.push(newEventType);
  res.status(201).json(newEventType);
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Registered routes:');
  console.log('  POST /api/auth/signin');
  console.log('  POST /api/auth/signout');
  console.log('  GET  /api/auth/me');
  console.log('  GET  /api/event-types');
  console.log('  POST /api/event-types');
});

