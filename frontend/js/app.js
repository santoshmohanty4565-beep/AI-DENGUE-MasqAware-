/**
 * MosqAware — Core Application Logic
 * Charts, Weather API, Navigation, Animations, Risk Engine
 */

// ─── CHART COLOR PALETTE ──────────────────────────────────────────────────
const CHART_COLORS = {
  cyan:    '#00d4ff',
  coral:   '#ff6b6b',
  green:   '#00e5a0',
  yellow:  '#ffd666',
  orange:  '#ff9f43',
  purple:  '#a855f7',
  muted:   '#4a5580',
  grid:    'rgba(255,255,255,0.04)',
  text:    '#8b9cc8',
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: CHART_COLORS.text,
        font: { family: 'Inter', size: 11 },
        boxWidth: 10,
        boxHeight: 10,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(5,13,26,0.95)',
      borderColor: 'rgba(0,212,255,0.2)',
      borderWidth: 1,
      titleColor: '#f0f4ff',
      bodyColor: '#8b9cc8',
      titleFont: { family: 'Inter', size: 12, weight: '600' },
      bodyFont: { family: 'Inter', size: 11 },
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.text, font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.text, font: { family: 'Inter', size: 11 } },
    },
  },
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────
function initNav() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Set active nav item
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}

// ─── LANGUAGE SWITCHER ────────────────────────────────────────────────────
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      i18n.setLanguage(lang);
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Set active on load
  const savedLang = localStorage.getItem('denguel_lang') || 'en';
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === savedLang);
  });
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1500, prefix = '', suffix = '') {
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = isFloat
      ? (start + (target - start) * eased).toFixed(2)
      : Math.floor(start + (target - start) * eased);
    el.textContent = prefix + Number(current).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target, 1800, prefix, suffix);
        observer.disconnect();
      }
    });
    observer.observe(el);
  });
}

// ─── LIVE WEATHER ─────────────────────────────────────────────────────────
async function loadLiveWeather() {
  const weatherEl = document.getElementById('live-weather');
  if (!weatherEl) return;

  try {
    const data = await fetchLiveWeather(20.2961, 85.8246); // Bhubaneswar

    if (data) {
      document.getElementById('w-temp') && (document.getElementById('w-temp').textContent = `${data.temperature_2m}°C`);
      document.getElementById('w-humidity') && (document.getElementById('w-humidity').textContent = `${data.relative_humidity_2m}%`);
      document.getElementById('w-rain') && (document.getElementById('w-rain').textContent = `${data.precipitation} mm`);
      document.getElementById('w-wind') && (document.getElementById('w-wind').textContent = `${data.wind_speed_10m} km/h`);
    } else {
      // Fallback to simulated data
      const sim = ODISHA_DATA.currentWeather.bhubaneswar;
      document.getElementById('w-temp') && (document.getElementById('w-temp').textContent = `${sim.temp}°C`);
      document.getElementById('w-humidity') && (document.getElementById('w-humidity').textContent = `${sim.humidity}%`);
      document.getElementById('w-rain') && (document.getElementById('w-rain').textContent = `${sim.rainfall} mm`);
      document.getElementById('w-wind') && (document.getElementById('w-wind').textContent = `${sim.windSpeed} km/h`);
    }
  } catch {
    const sim = ODISHA_DATA.currentWeather.bhubaneswar;
    document.getElementById('w-temp') && (document.getElementById('w-temp').textContent = `${sim.temp}°C`);
    document.getElementById('w-humidity') && (document.getElementById('w-humidity').textContent = `${sim.humidity}%`);
    document.getElementById('w-rain') && (document.getElementById('w-rain').textContent = `${sim.rainfall} mm`);
    document.getElementById('w-wind') && (document.getElementById('w-wind').textContent = `${sim.windSpeed} km/h`);
  }
}

// Update timestamp
function updateTimestamp() {
  const el = document.getElementById('last-updated');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' });
  }
}

// ─── CHART: WEEKLY TREND ──────────────────────────────────────────────────
function initWeeklyTrendChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const data2024 = ODISHA_DATA.monthlyCases2024.map(d => d.cases);
  const data2025 = ODISHA_DATA.monthlyCases2025.map(d => d.cases);
  const labels   = ODISHA_DATA.monthlyCases2024.map(d => d.month);

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '2024',
          data: data2024,
          borderColor: CHART_COLORS.coral,
          backgroundColor: 'rgba(255,107,107,0.08)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: '2025',
          data: data2025,
          borderColor: CHART_COLORS.cyan,
          backgroundColor: 'rgba(0,212,255,0.08)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: { ...CHART_DEFAULTS.plugins.legend, position: 'top' },
      },
    },
  });
}

// ─── CHART: WEATHER CORRELATION ───────────────────────────────────────────
function initWeatherCorrChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const labels = ODISHA_DATA.monthlyCases2024.map(d => d.month);
  const cases  = ODISHA_DATA.monthlyCases2024.map(d => d.cases);
  const temps  = ODISHA_DATA.monthlyCases2024.map(d => d.temperature);

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Cases (2024)',
          data: cases,
          borderColor: CHART_COLORS.coral,
          backgroundColor: 'rgba(255,107,107,0.07)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          yAxisID: 'y',
          pointRadius: 3,
        },
        {
          label: 'Avg Temp (°C)',
          data: temps,
          borderColor: CHART_COLORS.yellow,
          backgroundColor: 'transparent',
          tension: 0.4,
          borderDash: [5, 3],
          borderWidth: 2,
          yAxisID: 'y1',
          pointRadius: 3,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        x: CHART_DEFAULTS.scales.x,
        y: {
          ...CHART_DEFAULTS.scales.y,
          position: 'left',
          title: { display: true, text: 'Cases', color: CHART_COLORS.text, font: { size: 10 } },
        },
        y1: {
          ...CHART_DEFAULTS.scales.y,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Temp °C', color: CHART_COLORS.text, font: { size: 10 } },
        },
      },
    },
  });
}

// ─── CHART: YEARLY CASES BAR ──────────────────────────────────────────────
function initYearlyCasesChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const labels = ODISHA_DATA.yearlyCases.map(d => d.year);
  const cases  = ODISHA_DATA.yearlyCases.map(d => d.cases);
  const tprs   = ODISHA_DATA.yearlyCases.map(d => d.tpr);

  const bgColors = cases.map(c => c === Math.max(...cases) ? CHART_COLORS.coral : 'rgba(0,212,255,0.3)');

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Cases',
          data: cases,
          backgroundColor: bgColors,
          borderColor: bgColors.map(c => c === CHART_COLORS.coral ? CHART_COLORS.coral : CHART_COLORS.cyan),
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'TPR (%)',
          data: tprs,
          type: 'line',
          borderColor: CHART_COLORS.yellow,
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          borderDash: [4, 3],
          pointRadius: 4,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        x: CHART_DEFAULTS.scales.x,
        y: {
          ...CHART_DEFAULTS.scales.y,
          position: 'left',
          title: { display: true, text: 'Cases', color: CHART_COLORS.text, font: { size: 10 } },
        },
        y1: {
          ...CHART_DEFAULTS.scales.y,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'TPR %', color: CHART_COLORS.text, font: { size: 10 } },
          suggestedMin: 0, suggestedMax: 8,
        },
      },
    },
  });
}

// ─── CHART: DISTRICT BAR ──────────────────────────────────────────────────
function initDistrictChart(canvasId, year = 2025) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const top10 = [...ODISHA_DATA.districts]
    .sort((a, b) => b[`cases${year}`] - a[`cases${year}`])
    .slice(0, 10);

  const labels = top10.map(d => d.name);
  const cases  = top10.map(d => d[`cases${year}`]);
  const riskColors = top10.map(d => {
    if (d.riskScore >= 76) return 'rgba(255,68,68,0.6)';
    if (d.riskScore >= 56) return 'rgba(255,159,67,0.6)';
    if (d.riskScore >= 31) return 'rgba(255,214,102,0.6)';
    return 'rgba(0,229,160,0.6)';
  });

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `Cases ${year}`,
        data: cases,
        backgroundColor: riskColors,
        borderRadius: 6,
        borderWidth: 0,
      }],
    },
    options: {
      ...CHART_DEFAULTS,
      indexAxis: 'y',
      plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } },
      scales: {
        x: CHART_DEFAULTS.scales.x,
        y: { ...CHART_DEFAULTS.scales.y, ticks: { color: CHART_COLORS.text, font: { size: 11 } } },
      },
    },
  });
}

// ─── CHART: BREEDING INDEX ────────────────────────────────────────────────
function initBreedingChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const data = ODISHA_DATA.breedingData.weeklyIndex;
  const labels = data.map(d => d.week);

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Composite Breeding Index',
          data: data.map(d => d.composite),
          borderColor: CHART_COLORS.orange,
          backgroundColor: 'rgba(255,159,67,0.1)',
          fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4,
        },
        {
          label: 'NDWI (Water)',
          data: data.map(d => (d.ndwi * 10).toFixed(2)),
          borderColor: CHART_COLORS.cyan,
          backgroundColor: 'transparent',
          tension: 0.4, borderWidth: 1.5, borderDash: [4, 3], pointRadius: 3,
        },
        {
          label: 'LST (Temp °C/10)',
          data: data.map(d => (d.lst / 10).toFixed(2)),
          borderColor: CHART_COLORS.yellow,
          backgroundColor: 'transparent',
          tension: 0.4, borderWidth: 1.5, borderDash: [4, 3], pointRadius: 3,
        },
      ],
    },
    options: { ...CHART_DEFAULTS },
  });
}

// ─── CHART: FORECAST ──────────────────────────────────────────────────────
function initForecastChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const data   = ODISHA_DATA.predictions2026;
  const labels = data.map(d => d.month);

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Predicted Cases',
          data: data.map(d => d.predicted),
          backgroundColor: 'rgba(168,85,247,0.4)',
          borderColor: CHART_COLORS.purple,
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Upper Bound',
          data: data.map(d => d.upper),
          type: 'line',
          borderColor: 'rgba(168,85,247,0.3)',
          backgroundColor: 'transparent',
          tension: 0.3, borderDash: [5, 3], borderWidth: 1.5, pointRadius: 3,
        },
        {
          label: 'Lower Bound',
          data: data.map(d => d.lower),
          type: 'line',
          borderColor: 'rgba(168,85,247,0.3)',
          backgroundColor: 'transparent',
          tension: 0.3, borderDash: [5, 3], borderWidth: 1.5, pointRadius: 3,
        },
      ],
    },
    options: { ...CHART_DEFAULTS },
  });
}

// ─── CHART: SEROTYPE DOUGHNUT ──────────────────────────────────────────────
function initSerotypeChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const s = ODISHA_DATA.serotypes;
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['DENV-1', 'DENV-2 (Dominant)', 'DENV-3', 'DENV-4'],
      datasets: [{
        data: [s.DENV1, s.DENV2, s.DENV3, s.DENV4],
        backgroundColor: [
          'rgba(0,212,255,0.6)',
          'rgba(255,107,107,0.8)',
          'rgba(255,214,102,0.6)',
          'rgba(0,229,160,0.6)',
        ],
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: CHART_COLORS.text,
            font: { family: 'Inter', size: 11 },
            boxWidth: 10, boxHeight: 10, padding: 12,
          },
        },
        tooltip: CHART_DEFAULTS.plugins.tooltip,
      },
    },
  });
}

// ─── SHAP CHART RENDERER ──────────────────────────────────────────────────
function renderShapChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const features = ODISHA_DATA.shapFeatures;
  const maxAbs = Math.max(...features.map(f => Math.abs(f.importance)));

  container.innerHTML = features.map(f => {
    const pct = Math.abs(f.importance) / maxAbs * 100;
    const color = f.direction === 'positive' ? CHART_COLORS.coral : CHART_COLORS.green;
    const sign  = f.direction === 'positive' ? '+' : '-';
    return `
      <div class="shap-bar">
        <div class="shap-feature-name">${f.feature}</div>
        <div class="shap-bar-track">
          <div class="shap-bar-fill" style="width:${pct}%; background:${color}; height:8px; border-radius:4px;"></div>
        </div>
        <div class="shap-value" style="color:${color}">${sign}${f.importance.toFixed(3)}</div>
      </div>
    `;
  }).join('');
}

// ─── DISTRICT TABLE RENDERER ──────────────────────────────────────────────
function renderDistrictTable(containerId, limit = 10) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sorted = [...ODISHA_DATA.districts].sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
  const maxCases = Math.max(...sorted.map(d => d.cases2025));

  container.innerHTML = `
    <table class="data-table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>District</th>
          <th>2025 Cases</th>
          <th>TPR %</th>
          <th>Risk Score</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((d, i) => `
          <tr onclick="focusDistrict('${d.name}')" style="cursor:pointer;">
            <td><span class="rank-num">${i + 1}</span></td>
            <td><span class="district-name">${d.name}</span></td>
            <td>
              ${d.cases2025.toLocaleString()}
              <div class="progress-bar">
                <div class="progress-fill" style="width:${(d.cases2025/maxCases*100).toFixed(0)}%; background:${getRiskColorByLevel(d.riskLevel)};"></div>
              </div>
            </td>
            <td>${d.tpr}%</td>
            <td>
              <span style="font-family:Rajdhani,sans-serif; font-size:16px; font-weight:700; color:${getRiskColorByLevel(d.riskLevel)};">${d.riskScore}</span>
              <span style="font-size:10px; color:var(--text-muted);">/100</span>
            </td>
            <td><span class="risk-badge ${d.riskLevel}">${d.riskLevel}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getRiskColorByLevel(level) {
  const map = { LOW: '#00e5a0', MODERATE: '#ffd666', HIGH: '#ff9f43', CRITICAL: '#ff4444' };
  return map[level] || '#8b9cc8';
}

// ─── AWARENESS: SYMPTOM LIST ──────────────────────────────────────────────
function renderSymptomList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const icons = ['🌡️', '🤕', '🦴', '🔴', '🩸', '🤢'];
  const symptoms = TRANSLATIONS[i18n.currentLang]?.symptoms || TRANSLATIONS.en.symptoms;

  container.innerHTML = symptoms.map((s, i) => `
    <div class="symptom-card animate-fadeInUp" style="animation-delay:${i * 0.08}s">
      <div class="symptom-icon">${icons[i] || '⚠️'}</div>
      <div style="font-size:13px; color:var(--text-secondary);">${s}</div>
    </div>
  `).join('');
}

// ─── PREVENTION LIST ──────────────────────────────────────────────────────
function renderPreventionList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const steps = TRANSLATIONS[i18n.currentLang]?.prevention || TRANSLATIONS.en.prevention;

  container.innerHTML = steps.map((s, i) => `
    <div class="prevention-step animate-fadeInUp" style="animation-delay:${i * 0.08}s">
      <div class="step-num">${i + 1}</div>
      <div style="font-size:13px; color:var(--text-secondary);">${s}</div>
    </div>
  `).join('');
}

// ─── TABS ─────────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tab-group]');
      if (!group) return;
      const target = btn.dataset.tab;

      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .kpi-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ─── RISK GAUGE (SVG) ─────────────────────────────────────────────────────
function drawRiskGauge(canvasId, score) {
  const container = document.getElementById(canvasId);
  if (!container) return;

  const angle = (score / 100) * 180 - 90;
  const color = score >= 76 ? '#ff4444' : score >= 56 ? '#ff9f43' : score >= 31 ? '#ffd666' : '#00e5a0';
  const label = score >= 76 ? 'CRITICAL' : score >= 56 ? 'HIGH' : score >= 31 ? 'MODERATE' : 'LOW';

  container.innerHTML = `
    <svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" width="200" height="110">
      <!-- Background arc -->
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="16" stroke-linecap="round"/>
      <!-- Green zone -->
      <path d="M 20 100 A 80 80 0 0 1 60 34" fill="none" stroke="#00e5a00" stroke-width="16" stroke-linecap="round" opacity="0.4"/>
      <!-- Gradient arc fill -->
      <defs>
        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00e5a0"/>
          <stop offset="50%" stop-color="#ffd666"/>
          <stop offset="100%" stop-color="#ff4444"/>
        </linearGradient>
      </defs>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-grad)" stroke-width="16" stroke-linecap="round" opacity="0.3"/>

      <!-- Needle -->
      <g transform="translate(100, 100) rotate(${angle})">
        <line x1="0" y1="0" x2="0" y2="-68" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="7" fill="${color}" stroke="rgba(5,13,26,0.8)" stroke-width="2"/>
      </g>

      <!-- Score text -->
      <text x="100" y="90" text-anchor="middle" fill="${color}" font-size="28" font-weight="700" font-family="Rajdhani,sans-serif">${score}</text>
      <text x="100" y="108" text-anchor="middle" fill="${color}" font-size="11" font-weight="700" font-family="Inter,sans-serif">${label}</text>
    </svg>
  `;
}

// ─── AUTO-UPDATE TIMER ────────────────────────────────────────────────────
function startAutoUpdate(intervalMs = 60000) {
  setInterval(() => {
    loadLiveWeather();
    updateTimestamp();
  }, intervalMs);
}

// ─── PWA SERVICE WORKER ───────────────────────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW not critical for demo
    });
  }
}

// ─── INIT ALL ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
  initNav();
  initLangSwitcher();
  initCounters();
  initTabs();
  initScrollAnimations();
  loadLiveWeather();
  updateTimestamp();
  startAutoUpdate();
  registerServiceWorker();
});
