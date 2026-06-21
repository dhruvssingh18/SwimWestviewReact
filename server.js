const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── DB helpers ───────────────────────────────────────────
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return getDefaultDB();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getDefaultDB() {
  return {
    events: [
      { id: 1, name: 'vs Jesuit HS — Girls', type: 'meet', date: '2026-01-15', time: '16:00', location: 'Beaverton Aquatic Center' },
      { id: 2, name: 'vs Jesuit HS — Boys', type: 'meet', date: '2026-01-15', time: '16:00', location: 'Beaverton Aquatic Center' },
      { id: 3, name: 'Regional Qualifiers', type: 'meet', date: '2026-07-05', time: '08:00', location: 'Metro Swim Complex' },
    ],
    times: [
      { id: 1, name: 'Jami Lee', gender: 'girls', stroke: 'Butterfly', dist: '100m', time: '64.16', date: '2026-01-15', pb: true },
      { id: 2, name: 'Helen Jeong', gender: 'girls', stroke: 'Freestyle', dist: '100m', time: '62.96', date: '2026-01-15', pb: true },
      { id: 3, name: 'Ethan Xu', gender: 'boys', stroke: 'Freestyle', dist: '50m', time: '25.49', date: '2026-01-15', pb: true },
      { id: 4, name: 'Aidan Chang', gender: 'boys', stroke: 'Freestyle', dist: '200m', time: '122.95', date: '2026-01-15', pb: true },
    ],
    team: [
      { id: 1, name: 'Jami Lee', gender: 'girls', grade: '11th', spec: 'Butterfly', status: 'active', best: '1:04.16', note: '' },
      { id: 2, name: 'Helen Jeong', gender: 'girls', grade: '12th', spec: 'Freestyle', status: 'active', best: '1:02.96', note: '' },
      { id: 3, name: 'Naomi Lin', gender: 'girls', grade: '11th', spec: 'Breaststroke', status: 'active', best: '1:12.95', note: '' },
      { id: 4, name: 'Ethan Xu', gender: 'boys', grade: '11th', spec: 'Freestyle', status: 'active', best: '25.49s', note: '' },
      { id: 5, name: 'Aidan Chang', gender: 'boys', grade: '9th', spec: 'Freestyle', status: 'active', best: '2:02.95', note: '' },
    ],
    announcements: [
      { id: 1, title: 'Welcome to the 2026 Season!', text: 'Practice begins Monday at 7:00 AM. Bring your registration forms.', from: 'Coach Williams', date: 'Jan 10, 2026' },
      { id: 2, title: 'Jesuit Meet Results', text: 'Westview Girls 81 pts, Boys 50 pts. Great work everyone!', from: 'Coach Williams', date: 'Jan 15, 2026' },
    ],
    calEvents: [
      { id: 1, name: 'Practice', type: 'practice', date: '2026-06-16', note: 'Sprint focus' },
      { id: 2, name: 'Practice', type: 'practice', date: '2026-06-18', note: 'Endurance' },
      { id: 3, name: 'Lap-a-thon', type: 'lapathon', date: '2026-06-21', note: 'Fundraiser' },
      { id: 4, name: 'vs Jefferson', type: 'meet', date: '2026-06-27', note: 'Dual meet' },
    ],
    nextId: 200
  };
}

// Seed DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) writeDB(getDefaultDB());

// ── API Routes ───────────────────────────────────────────

// Get all data at once (initial load)
app.get('/api/all', (req, res) => {
  res.json(readDB());
});

// Save entire DB at once (simple sync from client)
app.post('/api/sync', (req, res) => {
  const db = readDB();
  const incoming = req.body;
  // Merge each collection
  ['events', 'times', 'team', 'announcements', 'calEvents'].forEach(key => {
    if (Array.isArray(incoming[key])) db[key] = incoming[key];
  });
  if (incoming.nextId) db.nextId = incoming.nextId;
  writeDB(db);
  res.json({ ok: true, nextId: db.nextId });
});

// Individual collection endpoints for granular updates
// EVENTS
app.get('/api/events', (req, res) => res.json(readDB().events));
app.post('/api/events', (req, res) => {
  const db = readDB();
  const item = { ...req.body, id: db.nextId++ };
  db.events.unshift(item);
  writeDB(db);
  res.json(item);
});
app.delete('/api/events/:id', (req, res) => {
  const db = readDB();
  db.events = db.events.filter(e => e.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// TIMES
app.get('/api/times', (req, res) => res.json(readDB().times));
app.post('/api/times', (req, res) => {
  const db = readDB();
  const item = { ...req.body, id: db.nextId++ };
  db.times.unshift(item);
  writeDB(db);
  res.json(item);
});
app.delete('/api/times/:id', (req, res) => {
  const db = readDB();
  db.times = db.times.filter(t => t.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// TEAM
app.get('/api/team', (req, res) => res.json(readDB().team));
app.post('/api/team', (req, res) => {
  const db = readDB();
  const item = { ...req.body, id: db.nextId++ };
  db.team.push(item);
  writeDB(db);
  res.json(item);
});
app.patch('/api/team/:id', (req, res) => {
  const db = readDB();
  const s = db.team.find(t => t.id === parseInt(req.params.id));
  if (s) Object.assign(s, req.body);
  writeDB(db);
  res.json(s || {});
});

// ANNOUNCEMENTS
app.get('/api/announcements', (req, res) => res.json(readDB().announcements));
app.post('/api/announcements', (req, res) => {
  const db = readDB();
  const item = { ...req.body, id: db.nextId++ };
  db.announcements.unshift(item);
  writeDB(db);
  res.json(item);
});
app.delete('/api/announcements/:id', (req, res) => {
  const db = readDB();
  db.announcements = db.announcements.filter(a => a.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// CALENDAR
app.get('/api/cal', (req, res) => res.json(readDB().calEvents));
app.post('/api/cal', (req, res) => {
  const db = readDB();
  const item = { ...req.body, id: db.nextId++ };
  db.calEvents.push(item);
  writeDB(db);
  res.json(item);
});
app.delete('/api/cal/:id', (req, res) => {
  const db = readDB();
  db.calEvents = db.calEvents.filter(e => e.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ ok: true });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Westview Swim Team running on port ${PORT}`));
