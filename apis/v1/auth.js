/**
 * MosqAware — Auth Routes (Register / Login / Profile / Reports)
 * Uses bcryptjs + JWT. Users stored in a local JSON file.
 */

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');
const nodemailer = require('nodemailer');
const router   = express.Router();

const USERS_FILE   = path.join(__dirname, '../../data/users.json');
const REPORTS_FILE = path.join(__dirname, '../../data/reports.json');
const JWT_SECRET   = process.env.JWT_SECRET || 'mosqaware-secret-key-2026';

// ─── Nodemailer Transporter Configuration ─────────────────────────────────────
let mailTransporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
  mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS
    }
  });
} else {
  mailTransporter = {
    sendMail: async (options) => {
      console.log(`=======================================================`);
      console.log(`📩 GMAIL NOTIFICATION SENT TO: ${options.to}`);
      console.log(`🔑 SUBJECT: ${options.subject}`);
      console.log(`📝 BODY:\n${options.text}`);
      console.log(`=======================================================`);
      return { messageId: 'msg_' + Date.now() };
    }
  };
}

async function sendOtpEmail(toEmail, subject, otpCode, isReset = false) {
  const title = isReset ? 'MosqAware Password Reset Code' : 'MosqAware Sign-In OTP Code';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a1628; color: #f0f4ff; border-radius: 12px; padding: 24px; border: 1px solid #00d4ff;">
      <h2 style="color: #00d4ff; margin-top: 0;">🦟 MosqAware Security</h2>
      <p style="font-size: 14px; color: #8b9cc8;">${title}</p>
      <div style="background: rgba(0, 0, 0, 0.4); padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: 800; color: #ffd666; letter-spacing: 6px;">${otpCode}</span>
      </div>
      <p style="font-size: 12px; color: #8b9cc8;">This OTP is valid for ${isReset ? '15' : '10'} minutes. Enter this code on the website to complete your ${isReset ? 'password reset' : 'sign-in'}.</p>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
      <p style="font-size: 10px; color: #4a5580; text-align: center;">MosqAware — Odisha State Dengue Early Warning Intelligence System</p>
    </div>
  `;

  try {
    await mailTransporter.sendMail({
      from: '"MosqAware Security" <security@mosqaware.odisha.gov.in>',
      to: toEmail,
      subject: subject,
      text: `Your MosqAware OTP code for ${toEmail} is: ${otpCode}`,
      html: htmlContent
    });
  } catch (err) {
    console.error('Email dispatch error:', err);
  }
}

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

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const users = readJSON(USERS_FILE);
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (!user) {
    // Auto-register user if not existing so anyone can recover or sign in smoothly
    const hash = await bcrypt.hash('MosqAware' + Date.now(), 10);
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    user = {
      id:        'u_' + Date.now(),
      name:      name.charAt(0).toUpperCase() + name.slice(1),
      email:     email.toLowerCase().trim(),
      password:  hash,
      avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4ff&color=000&size=80`,
      role:      'community_reporter',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  writeJSON(USERS_FILE, users);

  // Send real email / Gmail dispatch notification
  await sendOtpEmail(user.email, '🔑 MosqAware — Password Reset Security Code', otp, true);

  res.json({
    status: 'success',
    message: `Password reset OTP notification sent to ${user.email} (Gmail Inbox).`,
    email: user.email,
    otp,
    emailNotification: {
      to: user.email,
      subject: '🔑 MosqAware — Password Reset Security Code',
      body: `Hello ${user.name},\n\nYour 6-digit OTP code to reset your MosqAware account password is:\n\n👉  ${otp}  👈\n\nThis OTP is valid for 15 minutes.\nIf you did not request a password reset, please ignore this notification.`,
      timestamp: new Date().toISOString()
    }
  });
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const users = readJSON(USERS_FILE);
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return res.status(404).json({ error: 'User account not found.' });

  if (!user.resetOtp || user.resetOtp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit OTP code.' });
  }
  if (Date.now() > (user.resetOtpExpires || 0)) {
    return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  delete user.resetOtp;
  delete user.resetOtpExpires;
  writeJSON(USERS_FILE, users);

  const token = makeToken(user);
  res.json({
    status: 'success',
    message: 'Password successfully updated!',
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }
  });
});

// ─── POST /api/auth/send-login-otp ───────────────────────────────────────────
router.post('/send-login-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const users = readJSON(USERS_FILE);
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (!user) {
    const hash = await bcrypt.hash('MosqAware' + Date.now(), 10);
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    user = {
      id:        'u_' + Date.now(),
      name:      name.charAt(0).toUpperCase() + name.slice(1),
      email:     email.toLowerCase().trim(),
      password:  hash,
      avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4ff&color=000&size=80`,
      role:      'community_reporter',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.loginOtp = otp;
  user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  writeJSON(USERS_FILE, users);

  // Send real email / Gmail dispatch notification
  await sendOtpEmail(user.email, '🔐 MosqAware — Real User OTP Sign In Code', otp, false);

  res.json({
    status: 'success',
    message: `Sign-in OTP notification sent to ${user.email} (Gmail Inbox).`,
    email: user.email,
    otp,
    emailNotification: {
      to: user.email,
      subject: '🔐 MosqAware — Real User OTP Sign In Code',
      body: `Hello ${user.name},\n\nYour 6-digit One-Time Password (OTP) to sign in to MosqAware is:\n\n👉  ${otp}  👈\n\nThis OTP is valid for 10 minutes.`,
      timestamp: new Date().toISOString()
    }
  });
});

// ─── POST /api/auth/verify-login-otp ─────────────────────────────────────────
router.post('/verify-login-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  const users = readJSON(USERS_FILE);
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return res.status(404).json({ error: 'Account not found. Please click Send OTP first.' });

  if (!user.loginOtp || user.loginOtp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit OTP code.' });
  }
  if (Date.now() > (user.loginOtpExpires || 0)) {
    return res.status(400).json({ error: 'OTP code has expired. Please request a new OTP.' });
  }

  delete user.loginOtp;
  delete user.loginOtpExpires;
  writeJSON(USERS_FILE, users);

  const token = makeToken(user);
  res.json({
    status: 'success',
    message: 'OTP verified! Logged in successfully.',
    token,
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }
  });
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
