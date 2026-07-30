/**
 * MosqAware — Firebase Authentication & User Report System
 * Google Sign-In + Firestore database for user reports
 */

// ─── FIREBASE CONFIGURATION ────────────────────────────────────────────────
// Replace these values with your actual Firebase project config from:
// https://console.firebase.google.com → Your Project → Project Settings → Web App
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemo-Replace-With-Your-Real-Key",
  authDomain: "mosqaware-demo.firebaseapp.com",
  projectId: "mosqaware-demo",
  storageBucket: "mosqaware-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// ─── STATE ─────────────────────────────────────────────────────────────────
let currentUser = null;
let db = null;
let auth = null;
let firebaseReady = false;

// ─── INIT FIREBASE ─────────────────────────────────────────────────────────
function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    auth = firebase.auth();
    db   = firebase.firestore();
    firebaseReady = true;

    // Listen for auth state changes
    auth.onAuthStateChanged(onAuthStateChanged);
  } catch (err) {
    console.warn('Firebase init error (using demo mode):', err.message);
    firebaseReady = false;
    renderLoggedOut();
  }
}

// ─── AUTH STATE HANDLER ────────────────────────────────────────────────────
function onAuthStateChanged(user) {
  currentUser = user;
  if (user) {
    renderLoggedIn(user);
    loadUserReports();
  } else {
    renderLoggedOut();
  }
}

// ─── GOOGLE SIGN IN ────────────────────────────────────────────────────────
async function signInWithGoogle() {
  if (!firebaseReady) {
    showAuthToast('⚠️ Firebase not configured. Please add your Firebase config to auth.js', 'warn');
    return;
  }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    await auth.signInWithPopup(provider);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showAuthToast('❌ Sign-in failed: ' + err.message, 'error');
    }
  }
}

// ─── SIGN OUT ──────────────────────────────────────────────────────────────
async function signOut() {
  if (!firebaseReady) return;
  try {
    await auth.signOut();
    closeModal('user-profile-modal');
    showAuthToast('👋 You have been signed out.', 'success');
  } catch (err) {
    showAuthToast('Sign-out error: ' + err.message, 'error');
  }
}

// ─── RENDER LOGGED IN ──────────────────────────────────────────────────────
function renderLoggedIn(user) {
  const btn = document.getElementById('auth-btn');
  if (!btn) return;
  btn.innerHTML = `
    <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'U') + '&background=00d4ff&color=000'}"
      style="width:26px; height:26px; border-radius:50%; border:2px solid #00d4ff; object-fit:cover;"
      onerror="this.src='https://ui-avatars.com/api/?name=U&background=00d4ff&color=000'" />
    <span style="font-size:11px; max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${(user.displayName || user.email || 'User').split(' ')[0]}</span>
    <i class="fa-solid fa-chevron-down" style="font-size:9px; opacity:0.6;"></i>
  `;
  btn.onclick = () => openModal('user-profile-modal');
  btn.style.borderColor = 'rgba(0,212,255,0.5)';
  btn.style.color = '#00d4ff';

  // Populate profile modal
  const nameEl  = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const avatarEl = document.getElementById('profile-avatar');
  if (nameEl)  nameEl.textContent  = user.displayName || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) avatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=00d4ff&color=000&size=80`;

  // Pre-fill report form
  const reportName  = document.getElementById('report-user-name');
  const reportEmail = document.getElementById('report-user-email');
  if (reportName)  reportName.value = user.displayName || '';
  if (reportEmail) reportEmail.value = user.email || '';

  // Show report button in header
  const reportHdrBtn = document.getElementById('report-hdr-btn');
  if (reportHdrBtn) reportHdrBtn.style.display = 'flex';

  showAuthToast(`✅ Welcome, ${(user.displayName || 'User').split(' ')[0]}!`, 'success');
}

// ─── RENDER LOGGED OUT ─────────────────────────────────────────────────────
function renderLoggedOut() {
  const btn = document.getElementById('auth-btn');
  if (!btn) return;
  btn.innerHTML = `<i class="fa-brands fa-google" style="font-size:12px;"></i> Sign In`;
  btn.onclick = () => openModal('login-modal');
  btn.style.borderColor = 'rgba(255,255,255,0.2)';
  btn.style.color = '#f0f4ff';

  const reportHdrBtn = document.getElementById('report-hdr-btn');
  if (reportHdrBtn) reportHdrBtn.style.display = 'none';
}

// ─── SUBMIT USER REPORT ────────────────────────────────────────────────────
async function submitUserReport(e) {
  e.preventDefault();
  if (!currentUser) {
    openModal('login-modal');
    return;
  }

  const form = document.getElementById('user-report-form');
  const btn  = document.getElementById('report-submit-btn');

  const reportData = {
    uid:         currentUser.uid,
    userName:    currentUser.displayName || '',
    userEmail:   currentUser.email || '',
    userPhoto:   currentUser.photoURL || '',
    reportType:  document.getElementById('report-type').value,
    district:    document.getElementById('report-district').value,
    location:    document.getElementById('report-location').value,
    description: document.getElementById('report-description').value,
    severity:    document.getElementById('report-severity').value,
    symptoms:    Array.from(document.querySelectorAll('.report-symptom-cb:checked')).map(c => c.value),
    timestamp:   firebase.firestore.FieldValue.serverTimestamp(),
    status:      'pending',
    createdAt:   new Date().toISOString(),
  };

  if (!reportData.reportType || !reportData.district || !reportData.description) {
    showAuthToast('⚠️ Please fill all required fields.', 'warn');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Submitting...';

  try {
    let docId;
    if (firebaseReady && db) {
      const docRef = await db.collection('user_reports').add(reportData);
      docId = docRef.id;
    } else {
      // Local demo mode
      docId = 'LOCAL-' + Date.now();
      const local = JSON.parse(localStorage.getItem('mosqaware_reports') || '[]');
      local.unshift({ ...reportData, id: docId });
      localStorage.setItem('mosqaware_reports', JSON.stringify(local.slice(0, 50)));
    }

    showAuthToast('✅ Report submitted! ID: ' + docId.slice(0, 12) + '...', 'success');
    form.reset();
    closeModal('report-modal');
    loadUserReports();
  } catch (err) {
    showAuthToast('❌ Submit failed: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '📤 Submit Report';
  }
}

// ─── LOAD USER REPORTS ─────────────────────────────────────────────────────
async function loadUserReports() {
  if (!currentUser) return;
  const container = document.getElementById('user-reports-list');
  if (!container) return;

  container.innerHTML = '<div style="text-align:center; padding:20px; color:#8b9cc8; font-size:12px;">⏳ Loading your reports...</div>';

  let reports = [];

  try {
    if (firebaseReady && db) {
      const snap = await db.collection('user_reports')
        .where('uid', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();
      reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const local = JSON.parse(localStorage.getItem('mosqaware_reports') || '[]');
      reports = local.filter(r => r.uid === currentUser.uid || r.userEmail === currentUser.email);
    }
  } catch (err) {
    // Fallback to local
    const local = JSON.parse(localStorage.getItem('mosqaware_reports') || '[]');
    reports = local.slice(0, 10);
  }

  if (!reports.length) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#8b9cc8; font-size:12px;">📭 No reports submitted yet. Use the <strong style=\'color:#00d4ff;\'>📋 Report Incident</strong> button to submit your first report.</div>';
    return;
  }

  const severityColor = { low: '#00e5a0', medium: '#ffd666', high: '#ff9f43', critical: '#ff4444' };
  container.innerHTML = reports.map(r => `
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:6px;">
        <div style="font-weight:700; font-size:13px; color:#f0f4ff;">${getReportTypeLabel(r.reportType)}</div>
        <span style="font-size:10px; padding:2px 8px; border-radius:99px; background:${severityColor[r.severity] || '#8b9cc8'}22; color:${severityColor[r.severity] || '#8b9cc8'}; border:1px solid ${severityColor[r.severity] || '#8b9cc8'}44; white-space:nowrap; font-weight:700;">${(r.severity || 'N/A').toUpperCase()}</span>
      </div>
      <div style="font-size:11px; color:#8b9cc8; margin-bottom:4px;">📍 ${r.district || 'N/A'} ${r.location ? '— ' + r.location : ''}</div>
      <div style="font-size:11px; color:#c0caf5;">${(r.description || '').slice(0, 100)}${r.description?.length > 100 ? '...' : ''}</div>
      <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:10px; color:#4a5580;">
        <span>🕐 ${r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'Just now'}</span>
        <span style="color:${r.status === 'pending' ? '#ffd666' : '#00e5a0'}; font-weight:700;">${r.status === 'pending' ? '⏳ Pending Review' : '✅ Reviewed'}</span>
      </div>
    </div>
  `).join('');
}

function getReportTypeLabel(type) {
  const map = {
    dengue_case: '🦟 Dengue Case Report',
    breeding_site: '💧 Mosquito Breeding Site',
    outbreak: '🚨 Outbreak Alert',
    stagnant_water: '🌊 Stagnant Water Area',
    dead_birds: '🐦 Unusual Animal Deaths',
    other: '📌 Other Health Concern'
  };
  return map[type] || type || 'Report';
}

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────
function showAuthToast(msg, type = 'success') {
  const colors = {
    success: { bg: 'rgba(0,229,160,0.95)', border: '#00e5a0' },
    error:   { bg: 'rgba(255,68,68,0.97)', border: '#ff4444' },
    warn:    { bg: 'rgba(255,214,102,0.95)', border: '#ffd666' },
  };
  const c = colors[type] || colors.success;
  const t = document.createElement('div');
  t.style.cssText = `position:fixed; top:20px; left:50%; transform:translateX(-50%); background:${c.bg}; color:#000; padding:11px 22px; border-radius:12px; font-weight:700; font-size:13px; z-index:999999; box-shadow:0 6px 24px rgba(0,0,0,0.5); border:1px solid ${c.border}; white-space:nowrap; max-width:90vw; text-align:center;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; setTimeout(() => t.remove(), 400); }, 3000);
}

// ─── OPEN REPORT MODAL (requires login) ───────────────────────────────────
function openReportModal() {
  if (!currentUser) {
    showAuthToast('⚠️ Please sign in to submit a report.', 'warn');
    openModal('login-modal');
    return;
  }
  openModal('report-modal');
}

// ─── INIT ON DOM READY ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
});
