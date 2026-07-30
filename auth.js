/**
 * MosqAware — Frontend Auth Manager
 * Uses the backend /api/auth API with JWT tokens.
 * Falls back gracefully if not logged in.
 */

const API = '/api/auth';

let currentUser = null;

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
});

// ─── CHECK STORED SESSION ──────────────────────────────────────────────────
async function checkSession() {
  const token = localStorage.getItem('mq_token');
  if (!token) { renderLoggedOut(); return; }

  try {
    const res  = await fetch(API + '/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) { localStorage.removeItem('mq_token'); localStorage.removeItem('mq_user'); renderLoggedOut(); return; }
    const user = await res.json();
    currentUser = user;
    renderLoggedIn(user);
    loadUserReports();
  } catch {
    renderLoggedOut();
  }
}

// ─── SIGN OUT ─────────────────────────────────────────────────────────────
function signOut() {
  localStorage.removeItem('mq_token');
  localStorage.removeItem('mq_user');
  currentUser = null;
  closeModal('user-profile-modal');
  renderLoggedOut();
  showAuthToast('👋 You have been signed out.', 'success');
}

// ─── RENDER LOGGED IN ─────────────────────────────────────────────────────
function renderLoggedIn(user) {
  currentUser = user;
  const btn = document.getElementById('auth-btn');
  if (btn) {
    btn.innerHTML = `
      <img src="${user.avatar || getAvatar(user.name)}"
        style="width:26px;height:26px;border-radius:50%;border:2px solid #00d4ff;object-fit:cover;"
        onerror="this.src='${getAvatar(user.name)}'" />
      <span style="font-size:11px;max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(user.name||'User').split(' ')[0]}</span>
      <i class="fa-solid fa-chevron-down" style="font-size:9px;opacity:0.6;"></i>
    `;
    btn.onclick = () => openModal('user-profile-modal');
    btn.style.cssText += 'border-color:rgba(0,212,255,0.5);color:#00d4ff;';
  }

  // Populate profile modal
  const el = id => document.getElementById(id);
  if (el('profile-name'))   el('profile-name').textContent  = user.name  || 'User';
  if (el('profile-email'))  el('profile-email').textContent = user.email || '';
  if (el('profile-avatar')) { el('profile-avatar').src = user.avatar || getAvatar(user.name); }

  // Pre-fill report hidden fields
  if (el('report-user-name'))  el('report-user-name').value  = user.name  || '';
  if (el('report-user-email')) el('report-user-email').value = user.email || '';

  // Show report button in header
  const rBtn = el('report-hdr-btn');
  if (rBtn) rBtn.style.display = 'flex';
}

// ─── RENDER LOGGED OUT ────────────────────────────────────────────────────
function renderLoggedOut() {
  const btn = document.getElementById('auth-btn');
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-right-to-bracket" style="font-size:12px;"></i> Sign In`;
    btn.onclick = () => { window.location.href = 'login.html'; };
    btn.style.borderColor = 'rgba(255,255,255,0.2)';
    btn.style.color = '#f0f4ff';
  }
  const rBtn = document.getElementById('report-hdr-btn');
  if (rBtn) rBtn.style.display = 'none';
}

// ─── SUBMIT USER REPORT ───────────────────────────────────────────────────
async function submitUserReport(e) {
  e.preventDefault();
  if (!currentUser) { window.location.href = 'login.html'; return; }

  const token = localStorage.getItem('mq_token');
  const btn   = document.getElementById('report-submit-btn');

  const body = {
    reportType:  document.getElementById('report-type').value,
    district:    document.getElementById('report-district').value,
    location:    document.getElementById('report-location').value,
    description: document.getElementById('report-description').value,
    severity:    document.getElementById('report-severity').value,
    symptoms:    Array.from(document.querySelectorAll('.report-symptom-cb:checked')).map(c => c.value),
  };

  if (!body.reportType || !body.district || !body.description || !body.severity) {
    showAuthToast('⚠️ Please fill all required fields.', 'warn'); return;
  }

  btn.disabled = true; btn.textContent = '⏳ Submitting…';

  try {
    const res  = await fetch(API + '/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');
    showAuthToast('✅ Report submitted! ID: ' + data.report.id, 'success');
    document.getElementById('user-report-form').reset();
    closeModal('report-modal');
    loadUserReports();
  } catch (err) {
    showAuthToast('❌ ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '📤 Submit Report to Health Officials';
  }
}

// ─── LOAD USER REPORTS ────────────────────────────────────────────────────
async function loadUserReports() {
  const container = document.getElementById('user-reports-list');
  if (!container || !currentUser) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:#8b9cc8;font-size:12px;">⏳ Loading your reports…</div>';

  const token = localStorage.getItem('mq_token');
  try {
    const res  = await fetch(API + '/reports', { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    const reports = data.reports || [];

    if (!reports.length) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#8b9cc8;font-size:12px;">📭 No reports yet. Use <strong style=\'color:#00d4ff;\'>📋 Report Incident</strong> to submit your first report.</div>';
      return;
    }

    const sColor = { low:'#00e5a0', medium:'#ffd666', high:'#ff9f43', critical:'#ff4444' };
    container.innerHTML = reports.map(r => `
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">
          <div style="font-weight:700;font-size:13px;color:#f0f4ff;">${getReportTypeLabel(r.reportType)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${sColor[r.severity]||'#8b9cc8'}22;color:${sColor[r.severity]||'#8b9cc8'};border:1px solid ${sColor[r.severity]||'#8b9cc8'}44;white-space:nowrap;font-weight:700;">${(r.severity||'N/A').toUpperCase()}</span>
        </div>
        <div style="font-size:11px;color:#8b9cc8;margin-bottom:4px;">📍 ${r.district||'N/A'}${r.location?' — '+r.location:''}</div>
        <div style="font-size:11px;color:#c0caf5;">${(r.description||'').slice(0,100)}${(r.description||'').length>100?'…':''}</div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;color:#4a5580;">
          <span>🕐 ${new Date(r.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
          <span style="color:${r.status==='pending'?'#ffd666':'#00e5a0'};font-weight:700;">${r.status==='pending'?'⏳ Pending':'✅ Reviewed'}</span>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<div style="text-align:center;padding:16px;color:#ff6b6b;font-size:12px;">⚠️ Could not load reports. Please refresh.</div>';
  }
}

// ─── OPEN REPORT MODAL (requires login) ──────────────────────────────────
function openReportModal() {
  if (!currentUser) { window.location.href = 'login.html'; return; }
  openModal('report-modal');
}

// ─── HELPERS ─────────────────────────────────────────────────────────────
function getAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name||'U')}&background=00d4ff&color=000&size=80`;
}
function getReportTypeLabel(type) {
  const m = { dengue_case:'🦟 Dengue Case', breeding_site:'💧 Breeding Site', outbreak:'🚨 Outbreak Alert', stagnant_water:'🌊 Stagnant Water', dead_birds:'🐦 Unusual Deaths', other:'📌 Other' };
  return m[type] || type || 'Report';
}
function showAuthToast(msg, type='success') {
  const colors = { success:{bg:'rgba(0,229,160,0.95)',c:'#000'}, error:{bg:'rgba(255,68,68,0.97)',c:'#fff'}, warn:{bg:'rgba(255,214,102,0.95)',c:'#000'} };
  const c = colors[type]||colors.success;
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${c.bg};color:${c.c};padding:11px 22px;border-radius:12px;font-weight:700;font-size:13px;z-index:999999;box-shadow:0 6px 24px rgba(0,0,0,0.5);white-space:nowrap;max-width:90vw;text-align:center;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.4s'; setTimeout(()=>t.remove(),400); }, 3000);
}

// Stub for Firebase sign-in (no longer used, kept for compatibility)
function signInWithGoogle() { window.location.href = 'login.html'; }
function initFirebase() {}
