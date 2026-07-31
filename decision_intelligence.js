/**
 * MosqAware — AI Future Decision Intelligence & Action Engine (Client Controller)
 * Manages Explainable AI (XAI) contribution charts, bottleneck problem forecasting,
 * multi-stakeholder action tabs, and resource demand analytics.
 */

class AIDecisionIntelligenceController {
  constructor() {
    this.currentYear = 2027;
    this.currentDistrict = 'Khordha';
    this.activeStakeholder = 'citizens';

    this.inputs = {
      temp: 30.5,
      humidity: 80,
      rainfall: 140,
      ndwi: 0.70,
      vectorControl: 30,
      popDensity: 800
    };

    this.data = null;
  }

  initUI() {
    this.bindEvents();
    this.runSimulation();
  }

  bindEvents() {
    const yrSelect = document.getElementById('di-year-select');
    if (yrSelect) {
      yrSelect.addEventListener('change', (e) => {
        this.currentYear = parseInt(e.target.value);
        this.runSimulation();
      });
    }

    const distSelect = document.getElementById('di-district-select');
    if (distSelect) {
      distSelect.addEventListener('change', (e) => {
        this.currentDistrict = e.target.value;
        this.runSimulation();
      });
    }

    // Stakeholder tab buttons
    document.querySelectorAll('.stakeholder-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.stakeholder;
        this.switchStakeholderTab(target);
      });
    });
  }

  switchStakeholderTab(stakeholderKey) {
    this.activeStakeholder = stakeholderKey;
    document.querySelectorAll('.stakeholder-tab-btn').forEach(btn => {
      if (btn.dataset.stakeholder === stakeholderKey) {
        btn.className = 'btn btn-primary btn-sm stakeholder-tab-btn';
      } else {
        btn.className = 'btn btn-outline btn-sm stakeholder-tab-btn';
      }
    });
    this.renderActionEngine();
  }

  async runSimulation() {
    try {
      const res = await fetch('/api/v1/decision-intelligence/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: this.currentYear,
          district: this.currentDistrict,
          temp: this.inputs.temp,
          humidity: this.inputs.humidity,
          rainfall: this.inputs.rainfall,
          ndwi: this.inputs.ndwi,
          vectorControlEffectiveness: this.inputs.vectorControl,
          populationDensity: this.inputs.popDensity
        })
      });

      if (res.ok) {
        this.data = await res.json();
        this.renderAll();
        return;
      }
    } catch (err) {
      console.warn('API unavailable, rendering fallback decision intelligence');
    }
  }

  renderAll() {
    if (!this.data) return;

    // 1. Overall Risk & Confidence Badge
    const scoreVal = document.getElementById('di-risk-score-val');
    if (scoreVal) {
      scoreVal.textContent = `${this.data.riskScore}/100`;
      scoreVal.style.color = this.data.riskScore >= 75 ? '#ff3b5c' : (this.data.riskScore >= 50 ? '#ff8c00' : '#00e5a0');
    }

    const catVal = document.getElementById('di-risk-cat-val');
    if (catVal) {
      catVal.textContent = `RISK: ${this.data.riskCategory} (Confidence: ${this.data.confidenceScore}%)`;
      catVal.className = `badge badge-${this.data.riskScore >= 75 ? 'critical' : (this.data.riskScore >= 50 ? 'warning' : 'safe')}`;
    }

    // 2. Explainable AI (XAI) Feature Contributions
    const xaiBox = document.getElementById('di-xai-list');
    if (xaiBox && this.data.xaiInfluence) {
      xaiBox.innerHTML = this.data.xaiInfluence.map(item => `
        <div style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
            <span style="color:var(--text-primary); font-weight:600;">${item.factor}</span>
            <span style="color:var(--accent-cyan); font-weight:700;">+${item.contributionPct}% (${item.change})</span>
          </div>
          <div class="progress-bar" style="height:6px;">
            <div class="progress-fill" style="width:${item.contributionPct}%; background:linear-gradient(90deg, #00d4ff, #a855f7);"></div>
          </div>
        </div>
      `).join('');
    }

    // 3. Predicted Healthcare Bottlenecks
    const probBox = document.getElementById('di-problems-grid');
    if (probBox && this.data.problems) {
      probBox.innerHTML = this.data.problems.map(p => `
        <div style="padding:14px; background:rgba(5,13,26,0.8); border:1px solid rgba(255,255,255,0.08); border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <div style="font-size:13px; font-weight:800; color:var(--text-primary);">${p.issue}</div>
            <span class="badge badge-${p.severity === 'CRITICAL' ? 'critical' : 'warning'}" style="font-size:10px;">${p.severity}</span>
          </div>
          <div style="display:flex; gap:16px; font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            <div>Prob: <strong style="color:#ff3b5c;">${p.probability}</strong></div>
            <div>Horizon: <strong style="color:#00d4ff;">${p.timeHorizon}</strong></div>
            <div>Conf: <strong style="color:#00e5a0;">${p.confidence}</strong></div>
          </div>
          <div style="font-size:11px; color:var(--text-secondary); background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px;">
            <strong>💡 Suggested Mitigation:</strong> ${p.mitigation}
          </div>
        </div>
      `).join('');
    }

    // 4. Resource Requirements Forecast Grid
    const resGrid = document.getElementById('di-resource-grid');
    if (resGrid && this.data.resourceForecast) {
      const rf = this.data.resourceForecast;
      resGrid.innerHTML = `
        <div class="stat-hero-card">
          <div style="font-size:20px;">🛏️</div>
          <div class="stat-hero-val" style="color:#ff3b5c;">${rf.isolationBedsNeeded.toLocaleString()}</div>
          <div class="stat-hero-label">Isolation Beds</div>
        </div>
        <div class="stat-hero-card">
          <div style="font-size:20px;">🏥</div>
          <div class="stat-hero-val" style="color:#ff8c00;">${rf.icuBedsNeeded.toLocaleString()}</div>
          <div class="stat-hero-label">ICU Beds</div>
        </div>
        <div class="stat-hero-card">
          <div style="font-size:20px;">🩸</div>
          <div class="stat-hero-val" style="color:#ff3b5c;">${rf.plateletUnits.toLocaleString()}</div>
          <div class="stat-hero-label">Platelet Units</div>
        </div>
        <div class="stat-hero-card">
          <div style="font-size:20px;">🧪</div>
          <div class="stat-hero-val" style="color:#00d4ff;">${rf.cbcTestKits.toLocaleString()}</div>
          <div class="stat-hero-label">CBC Rapid Kits</div>
        </div>
        <div class="stat-hero-card">
          <div style="font-size:20px;">🚑</div>
          <div class="stat-hero-val" style="color:#00e5a0;">${rf.ambulancesDispatched}</div>
          <div class="stat-hero-label">108 Ambulances</div>
        </div>
      `;
    }

    // 5. Render Action Engine
    this.renderActionEngine();
  }

  renderActionEngine() {
    if (!this.data || !this.data.actionEngine) return;
    const actions = this.data.actionEngine[this.activeStakeholder];
    const box = document.getElementById('di-action-timeline-box');
    if (!box || !actions) return;

    box.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
        <div style="padding:14px; background:rgba(255,59,92,0.06); border:1px solid rgba(255,59,92,0.2); border-radius:10px;">
          <div style="font-size:11px; font-weight:800; color:#ff3b5c; margin-bottom:4px;">⚡ NEXT 24 HOURS</div>
          <div style="font-size:12px; color:var(--text-primary); line-height:1.5;">${actions.next24h}</div>
        </div>
        <div style="padding:14px; background:rgba(255,140,0,0.06); border:1px solid rgba(255,140,0,0.2); border-radius:10px;">
          <div style="font-size:11px; font-weight:800; color:#ff8c00; margin-bottom:4px;">📅 NEXT 7 DAYS</div>
          <div style="font-size:12px; color:var(--text-primary); line-height:1.5;">${actions.next7d}</div>
        </div>
        <div style="padding:14px; background:rgba(0,212,255,0.06); border:1px solid rgba(0,212,255,0.2); border-radius:10px;">
          <div style="font-size:11px; font-weight:800; color:#00d4ff; margin-bottom:4px;">🗓️ NEXT 30 DAYS</div>
          <div style="font-size:12px; color:var(--text-primary); line-height:1.5;">${actions.next30d}</div>
        </div>
        <div style="padding:14px; background:rgba(0,229,160,0.06); border:1px solid rgba(0,229,160,0.2); border-radius:10px;">
          <div style="font-size:11px; font-weight:800; color:#00e5a0; margin-bottom:4px;">🏛️ 6–12 MONTHS</div>
          <div style="font-size:12px; color:var(--text-primary); line-height:1.5;">${actions.longTerm}</div>
        </div>
      </div>
    `;
  }
}

// Global instance
window.aiDecisionEngine = new AIDecisionIntelligenceController();
