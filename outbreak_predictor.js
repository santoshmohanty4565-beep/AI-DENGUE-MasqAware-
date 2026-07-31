/**
 * MosqAware — Dengue Outbreak Predictor Engine (Present & Future Controller)
 * Manages dual-mode (Present 2026 vs Future 2027-2035+) live telemetry calculations.
 */

class DengueOutbreakPredictorEngine {
  constructor() {
    this.activeMode = 'present'; // 'present' or 'future'
    this.selectedDistrict = 'Khordha';
    this.selectedYear = 2026;
    this.selectedMonth = 'August';

    this.params = {
      temp: 30.5,
      humidity: 80,
      rainfall: 140,
      ndwi: 0.70,
      fogging: 20
    };

    this.output = {
      riskScore: 78,
      r0: 2.85,
      eipDays: 7.2,
      category: 'CRITICAL OUTBREAK EMERGENCY',
      badgeClass: 'critical',
      surge: 'CRITICAL SURGE: Activate +45% Isolation Beds & SCB Blood Reserves',
      actionPlan: 'Immediate 24h thermal fogging, drone larvicide spray in hotspots, and emergency medical transport standby.'
    };
  }

  initUI() {
    this.bindControls();
    this.recalculateOutbreakRisk();
  }

  bindControls() {
    const modePresentBtn = document.getElementById('op-mode-present');
    const modeFutureBtn = document.getElementById('op-mode-future');
    const futureControls = document.getElementById('op-future-controls');

    if (modePresentBtn && modeFutureBtn) {
      modePresentBtn.addEventListener('click', () => {
        this.activeMode = 'present';
        modePresentBtn.className = 'btn btn-primary btn-sm';
        modeFutureBtn.className = 'btn btn-outline btn-sm';
        if (futureControls) futureControls.style.display = 'none';
        this.recalculateOutbreakRisk();
      });

      modeFutureBtn.addEventListener('click', () => {
        this.activeMode = 'future';
        modeFutureBtn.className = 'btn btn-primary btn-sm';
        modePresentBtn.className = 'btn btn-outline btn-sm';
        if (futureControls) futureControls.style.display = 'flex';
        this.recalculateOutbreakRisk();
      });
    }

    const distSelect = document.getElementById('op-district-select');
    if (distSelect) {
      distSelect.addEventListener('change', (e) => {
        this.selectedDistrict = e.target.value;
        this.recalculateOutbreakRisk();
      });
    }

    const yrSelect = document.getElementById('op-year-select');
    if (yrSelect) {
      yrSelect.addEventListener('change', (e) => {
        this.selectedYear = parseInt(e.target.value);
        this.recalculateOutbreakRisk();
      });
    }

    const bindSlider = (id, paramKey, unit = '') => {
      const slider = document.getElementById(id);
      const valDisp = document.getElementById(`${id}-val`);
      if (slider && valDisp) {
        slider.addEventListener('input', (e) => {
          this.params[paramKey] = parseFloat(e.target.value);
          valDisp.textContent = `${e.target.value}${unit}`;
          this.recalculateOutcalculate();
        });
      }
    };

    bindSlider('op-temp', 'temp', '°C');
    bindSlider('op-humidity', 'humidity', '%');
    bindSlider('op-rain', 'rainfall', 'mm');
    bindSlider('op-ndwi', 'ndwi', '');
    bindSlider('op-fogging', 'fogging', '%');
  }

  async recalculateOutbreakRisk() {
    try {
      const res = await fetch('/api/v1/outbreak-predictor/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: this.activeMode,
          district: this.selectedDistrict,
          year: this.selectedYear,
          month: this.selectedMonth,
          temp: this.params.temp,
          humidity: this.params.humidity,
          rainfall: this.params.rainfall,
          ndwi: this.params.ndwi,
          foggingCoverage: this.params.fogging
        })
      });

      if (res.ok) {
        const data = await res.json();
        this.output = data.metrics;
        this.updateUI();
        return;
      }
    } catch {
      console.warn('API predictor unavailable, using client calculations');
    }

    this.fallbackCalculation();
    this.updateUI();
  }

  recalculateOutcalculate() {
    this.recalculateOutbreakRisk();
  }

  fallbackCalculation() {
    const T = this.params.temp;
    const H = this.params.humidity;
    const R = this.params.rainfall;
    const W = this.params.ndwi;
    const F = this.params.fogging / 100.0;

    const bitingRate = (T > 13.2 && T < 39.6) ? (0.00014 * T * (T - 13.2) * Math.sqrt(39.6 - T)) : 0.25;
    const eip = Math.max(4.0, Math.exp(4.7 - 0.09 * T));
    const vectorLifespan = (H / 100.0) * 28.0;
    const breedingIndex = Math.pow(W, 1.2) * (R > 50 ? 2.5 : 1.2);

    let r0 = (bitingRate * bitingRate * vectorLifespan * breedingIndex) / (eip * 0.4);
    r0 = parseFloat(Math.max(0.2, r0 * (1.0 - F * 0.75)).toFixed(2));

    let score = Math.min(100, Math.round(((T - 25) * 4) + ((H - 50) * 0.5) + (R * 0.15) + (W * 25)));
    if (this.activeMode === 'future' && [2027, 2031, 2035].includes(this.selectedYear)) {
      score = Math.min(100, Math.round(score * 1.2));
    }

    this.output = {
      riskScore: score,
      r0,
      eipDays: parseFloat(eip.toFixed(1)),
      category: score > 70 ? 'CRITICAL OUTBREAK EMERGENCY' : (score > 45 ? 'HIGH SURVEILLANCE' : 'MODERATE WATCH'),
      badgeClass: score > 70 ? 'critical' : (score > 45 ? 'warning' : 'safe'),
      surge: score > 70 ? 'CRITICAL SURGE: +45% Emergency Bed Requirement' : 'Standard Capacity',
      actionPlan: score > 70 ? 'Execute 24h thermal fogging & drone larvicide spray.' : 'Routine monitoring.'
    };
  }

  updateUI() {
    const el = id => document.getElementById(id);
    if (!el('op-risk-score-val')) return;

    el('op-risk-score-val').textContent = `${this.output.riskScore}%`;
    el('op-risk-score-val').style.color = this.output.riskScore > 70 ? '#ff3b5c' : (this.output.riskScore > 45 ? '#ff8c00' : '#00e5a0');

    el('op-category-val').textContent = this.output.riskCategory || this.output.category;
    el('op-category-val').className = `badge badge-${this.output.alertBadge || this.output.badgeClass}`;

    el('op-r0-val').textContent = this.output.r0;
    el('op-eip-val').textContent = `${this.output.eipDays} Days`;
    el('op-surge-val').textContent = this.output.hospitalSurge || this.output.surge;
    el('op-action-val').textContent = this.output.actionPlan;
  }
}

// Global instance
window.outbreakPredictor = new DengueOutbreakPredictorEngine();
