/**
 * MosqAware — Auth Routes (Register / Login / Profile / Reports)
 * Uses bcryptjs + JWT. Users stored in a local JSON file.
 */

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();

const USERS_FILE   = path.join(__dirname, '../../data/users.json');
const REPORTS_FILE = path.join(__dirname, '../../data/reports.json');
const JWT_SECRET   = process.env.JWT_SECRET || 'mosqaware-secret-key-2026';

// ─── Helpers ────────────────────────────────────────────────────────────────
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function makeToken(user) {
  return jwt.sign(
    { uid: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already registered.' });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id:        'u_' + Date.now(),
    name:      name.trim(),
    email:     email.toLowerCase().trim(),
    password:  hash,
    avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4ff&color=000&size=80`,
    role:      'community_reporter',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON(USERS_FILE, users);

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const users = readJSON(USERS_FILE);
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: 'No account found with this email.' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Incorrect password.' });

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
});

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const users = readJSON(USERS_FILE);
  const user  = users.find(u => u.id === req.user.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role });
});

// ─── POST /api/auth/reports ───────────────────────────────────────────────────
router.post('/reports', authMiddleware, (req, res) => {
  const { reportType, district, location, description, severity, symptoms } = req.body;
  if (!reportType || !district || !description || !severity)
    return res.status(400).json({ error: 'reportType, district, description, and severity are required.' });

  const reports = readJSON(REPORTS_FILE);
  const report  = {
    id:          'r_' + Date.now(),
    uid:         req.user.uid,
    userName:    req.user.name,
    userEmail:   req.user.email,
    reportType, district, location: location || '',
    description, severity,
    symptoms:    Array.isArray(symptoms) ? symptoms : [],
    status:      'pending',
    createdAt:   new Date().toISOString(),
  };
  reports.unshift(report);
  writeJSON(REPORTS_FILE, reports);
  res.json({ success: true, report });
});

// ─── GET /api/auth/reports ─────────────────────────────────────────────────────
router.get('/reports', authMiddleware, (req, res) => {
  const reports = readJSON(REPORTS_FILE);
  const mine    = reports.filter(r => r.uid === req.user.uid);
  res.json({ reports: mine.slice(0, 20) });
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
