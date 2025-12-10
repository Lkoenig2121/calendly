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

// Meetings storage (in-memory) - actual booked appointments
// This will be populated dynamically based on event types
let meetings = [];

// Sample attendees for generating meetings
const sampleAttendees = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' },
  { name: 'Bob Johnson', email: 'bob@example.com' },
  { name: 'Alice Williams', email: 'alice@example.com' },
  { name: 'Charlie Brown', email: 'charlie@example.com' },
  { name: 'Diana Prince', email: 'diana@example.com' },
];

// Helper function to generate meetings based on event types
const generateMeetingsFromEventTypes = () => {
  meetings = [];
  
  if (eventTypes.length === 0) {
    console.log('No event types found, returning empty meetings');
    return;
  }

  console.log(`Generating meetings for ${eventTypes.length} event types`);

  // Generate 2 meetings per event type to ensure all types are represented
  eventTypes.forEach((eventType, eventIndex) => {
    const meetingsPerType = 2; // Always generate 2 meetings per event type
    
    console.log(`Processing event type: ${eventType.title} (${eventType.id})`);
    
    for (let i = 0; i < meetingsPerType; i++) {
      const attendeeIndex = (eventIndex * meetingsPerType + i) % sampleAttendees.length;
      const attendee = sampleAttendees[attendeeIndex];
      
      // Generate dates starting from tomorrow, spaced out by event type and meeting number
      const daysFromNow = eventIndex * meetingsPerType + i + 1;
      const meetingDate = new Date();
      meetingDate.setDate(meetingDate.getDate() + daysFromNow);
      
      // Parse availability to get a reasonable time
      const availability = eventType.availability || 'Weekdays, 9:00 am - 5:00 pm';
      let startHour = 10;
      let startMinute = 30;
      
      // Try to extract time from availability string
      const timeMatch = availability.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
      if (timeMatch) {
        startHour = parseInt(timeMatch[1]);
        if (timeMatch[3].toLowerCase() === 'pm' && startHour !== 12) {
          startHour += 12;
        } else if (timeMatch[3].toLowerCase() === 'am' && startHour === 12) {
          startHour = 0;
        }
        startMinute = parseInt(timeMatch[2]);
      }
      
      // Offset each meeting by 30-60 minutes within the same day
      const meetingStart = new Date(meetingDate);
      const timeOffset = i * 60; // Offset by 60 minutes (1 hour) for second meeting
      meetingStart.setHours(startHour, startMinute + timeOffset, 0, 0);
      
      // Ensure time is within reasonable bounds (9 AM - 5 PM)
      if (meetingStart.getHours() < 9) {
        meetingStart.setHours(9, 0, 0, 0);
      } else if (meetingStart.getHours() >= 17) {
        meetingStart.setHours(16, 0, 0, 0);
      }
      
      const meetingEnd = new Date(meetingStart);
      meetingEnd.setMinutes(meetingEnd.getMinutes() + eventType.duration);
      
      const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      };
      
      const dateString = meetingDate.toISOString().split('T')[0];
      const platform = eventType.platform || 'Google Meet';
      const meetingLink = platform.includes('Google Meet') 
        ? `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`
        : platform.includes('Zoom')
        ? `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`
        : platform.includes('Teams')
        ? `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substr(2, 9)}`
        : 'https://example.com/meeting';
      
      const meeting = {
        id: `meeting_${eventType.id}_${i}_${Date.now()}`,
        eventTypeId: eventType.id,
        eventTypeTitle: eventType.title,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        date: dateString,
        startTime: formatTime(meetingStart),
        endTime: formatTime(meetingEnd),
        timezone: 'Eastern Time',
        status: 'scheduled',
        meetingLink: meetingLink,
        platform: platform,
        createdAt: new Date().toISOString(),
      };
      
      console.log(`Created meeting for ${eventType.title}: ${meeting.attendeeName} on ${dateString}`);
      meetings.push(meeting);
    }
  });
  
  console.log(`Total meetings generated: ${meetings.length}`);
};

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

// Meetings endpoints
app.get('/api/meetings', (req, res) => {
  console.log('GET /api/meetings hit');
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    console.log('No session found, returning 401');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  console.log('Current event types:', eventTypes.length);
  
  // Generate meetings based on current event types
  generateMeetingsFromEventTypes();
  
  console.log('Generated meetings:', meetings.length);

  // Sort meetings by date and time
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  console.log('Returning', sortedMeetings.length, 'meetings');
  res.json(sortedMeetings);
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
  console.log('  GET  /api/meetings');
});

