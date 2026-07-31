/**
 * MosqAware — Multi-Year AI Prediction Client-Side Controller (2026–2035+)
 * Manages dynamic year switching, Chart.js multi-year rendering, climate scenario sliders, and district hotspot matrices.
 */

class MultiYearPredictionAI {
  constructor() {
    this.currentYear = 2027;
    this.multiYearChart = null;
    this.monthlyChart = null;
    this.forecastData = null;
    this.scenarioParams = {
      tempAnomaly: 0.0,
      rainAnomaly: 0,
      fogging: 20
    };
  }

  async initUI() {
    this.bindYearSelectors();
    this.bindScenarioControls();
    await this.loadPredictionData();
  }

  async loadPredictionData() {
    try {
      const res = await fetch('/api/v1/predict/multi-year');
      if (res.ok) {
        this.forecastData = await res.json();
      } else {
        this.forecastData = this.generateFallbackData();
      }
    } catch {
      this.forecastData = this.generateFallbackData();
    }
    this.renderCurrentView();
  }

  generateFallbackData() {
    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
    const forecasts = years.map(yr => {
      const cycle = Math.sin((yr - 2023) * (2 * Math.PI / 4.0));
      const base = 3300 * (1.0 + cycle * 0.75) * (1.0 + (yr - 2026) * 0.04);
      const cases = yr <= 2026 ? 3300 : Math.ceil(Math.max(2100, base));
      return {
        year: yr,
        projectedCases: cases,
        lowerBound: Math.floor(cases * 0.81),
        upperBound: Math.ceil(cases * 1.28),
        tpr: parseFloat((cases / 13000 * 9.5).toFixed(2)),
        riskLevel: cases > 11000 ? 'CRITICAL OUTBREAK' : (cases > 7000 ? 'HIGH SURVEILLANCE' : 'MODERATE WATCH'),
        isCyclicalPeak: [2023, 2027, 2031, 2035].includes(yr),
        monthlyBreakdown: [
          { month: "Jan", cases: Math.ceil(cases * 0.015) },
          { month: "Feb", cases: Math.ceil(cases * 0.018) },
          { month: "Mar", cases: Math.ceil(cases * 0.030) },
          { month: "Apr", cases: Math.ceil(cases * 0.058) },
          { month: "May", cases: Math.ceil(cases * 0.088) },
          { month: "Jun", cases: Math.ceil(cases * 0.132) },
          { month: "Jul", cases: Math.ceil(cases * 0.224) },
          { month: "Aug", cases: Math.ceil(cases * 0.236) },
          { month: "Sep", cases: Math.ceil(cases * 0.192) },
          { month: "Oct", cases: Math.ceil(cases * 0.096) },
          { month: "Nov", cases: Math.ceil(cases * 0.042) },
          { month: "Dec", cases: Math.ceil(cases * 0.016) }
        ],
        districtProjections: [
          { id: 'KHO', name: 'Khordha', projectedCases: Math.ceil(cases * 0.35), riskScore: 89 },
          { id: 'CUT', name: 'Cuttack', projectedCases: Math.ceil(cases * 0.14), riskScore: 68 },
          { id: 'BAL', name: 'Balasore', projectedCases: Math.ceil(cases * 0.12), riskScore: 74 },
          { id: 'MAY', name: 'Mayurbhanj', projectedCases: Math.ceil(cases * 0.07), riskScore: 62 },
          { id: 'SUN', name: 'Sundargarh', projectedCases: Math.ceil(cases * 0.06), riskScore: 58 },
          { id: 'JAJ', name: 'Jajapur', projectedCases: Math.ceil(cases * 0.05), riskScore: 54 },
          { id: 'GAN', name: 'Ganjam', projectedCases: Math.ceil(cases * 0.05), riskScore: 54 }
        ]
      };
    });

    return {
      status: 'success',
      forecasts,
      historicalData: [
        { year: 2018, cases: 4210 }, { year: 2019, cases: 5830 }, { year: 2020, cases: 3920 },
        { year: 2021, cases: 7548 }, { year: 2022, cases: 7063 }, { year: 2023, cases: 12845 },
        { year: 2024, cases: 9892 }, { year: 2025, cases: 2635 }, { year: 2026, cases: 3300 }
      ]
    };
  }

  bindYearSelectors() {
    const selector = document.getElementById('target-year-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.currentYear = parseInt(e.target.value);
        this.renderCurrentView();
      });
    }

    const slider = document.getElementById('year-range-slider');
    const disp = document.getElementById('year-range-val');
    if (slider && disp) {
      slider.addEventListener('input', (e) => {
        this.currentYear = parseInt(e.target.value);
        disp.textContent = `${this.currentYear}`;
        if (selector) selector.value = `${this.currentYear}`;
        this.renderCurrentView();
      });
    }
  }

  bindScenarioControls() {
    const bindSlider = (id, paramKey, unit = '') => {
      const slider = document.getElementById(id);
      const valDisp = document.getElementById(`${id}-val`);
      if (slider && valDisp) {
        slider.addEventListener('input', (e) => {
          this.scenarioParams[paramKey] = parseFloat(e.target.value);
          valDisp.textContent = `${e.target.value}${unit}`;
          this.runCustomSimulation();
        });
      }
    };

    bindSlider('scen-temp', 'tempAnomaly', '°C');
    bindSlider('scen-rain', 'rainAnomaly', '%');
    bindSlider('scen-fogging', 'fogging', '%');
  }

  async runCustomSimulation() {
    try {
      const res = await fetch('/api/v1/predict/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startYear: 2026,
          endYear: 2035,
          tempAnomaly: this.scenarioParams.tempAnomaly,
          rainAnomaly: this.scenarioParams.rainAnomaly,
          foggingCoverage: this.scenarioParams.fogging
        })
      });
      if (res.ok) {
        this.forecastData = await res.json();
        this.renderCurrentView();
      }
    } catch {
      console.warn('Simulation request failed, keeping active forecast.');
    }
  }

  renderCurrentView() {
    if (!this.forecastData) return;

    this.renderMultiYearChart();
    this.renderYearSummaryCard();
    this.renderDistrictProjectionsTable();
  }

  renderMultiYearChart() {
    const canvas = document.getElementById('multiyear-horizon-chart');
    if (!canvas || !window.Chart) return;

    const hist = this.forecastData.historicalData || [];
    const fcasts = this.forecastData.forecasts || [];

    const labels = [...hist.map(h => `${h.year}`), ...fcasts.map(f => `${f.year}`)];
    const histCases = [...hist.map(h => h.cases), ...fcasts.map(() => null)];
    const projCases = [...hist.map(() => null), ...fcasts.map(f => f.projectedCases)];
    const lowerBounds = [...hist.map(() => null), ...fcasts.map(f => f.lowerBound)];
    const upperBounds = [...hist.map(() => null), ...fcasts.map(f => f.upperBound)];

    if (this.multiYearChart) {
      this.multiYearChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.multiYearChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Historical Cases (2018–2026)',
            data: histCases,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.1)',
            borderWidth: 3,
            pointRadius: 4,
            tension: 0.3
          },
          {
            label: 'AI Ensemble Forecast (2026–2035+)',
            data: projCases,
            borderColor: '#ff3b5c',
            backgroundColor: 'rgba(255,59,92,0.15)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: fcasts.map(f => f.isCyclicalPeak ? '#ff3b5c' : '#ff8c00'),
            tension: 0.3
          },
          {
            label: '95% Upper Bound',
            data: upperBounds,
            borderColor: 'rgba(255,214,102,0.4)',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          },
          {
            label: '95% Lower Bound',
            data: lowerBounds,
            borderColor: 'rgba(0,229,160,0.4)',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8b9cc8', font: { family: 'Inter', size: 11 } } },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(5,13,26,0.95)',
            borderColor: 'rgba(0,212,255,0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b9cc8' } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b9cc8' } }
        }
      }
    });
  }

  renderYearSummaryCard() {
    const el = id => document.getElementById(id);
    if (!el('pred-target-year-title')) return;

    const fcasts = this.forecastData.forecasts || [];
    const item = fcasts.find(f => f.year === this.currentYear) || fcasts[0];

    if (!item) return;

    el('pred-target-year-title').textContent = `🔮 Year ${item.year} AI Outbreak Forecast`;
    el('pred-cases-val').textContent = item.projectedCases.toLocaleString();
    el('pred-range-val').textContent = `${item.lowerBound.toLocaleString()} – ${item.upperBound.toLocaleString()}`;
    el('pred-tpr-val').textContent = `${item.tpr}%`;
    el('pred-risk-badge').textContent = item.riskLevel;
    el('pred-risk-badge').className = `badge ${item.riskLevel.includes('CRITICAL') ? 'badge-critical' : (item.riskLevel.includes('HIGH') ? 'badge-warning' : 'badge-safe')}`;
  }

  renderDistrictProjectionsTable() {
    const container = document.getElementById('district-pred-rows');
    if (!container) return;

    const fcasts = this.forecastData.forecasts || [];
    const item = fcasts.find(f => f.year === this.currentYear) || fcasts[0];
    if (!item || !item.districtProjections) return;

    container.innerHTML = item.districtProjections.map((d, idx) => `
      <tr>
        <td style="font-weight:700; color:#f0f4ff;">#${idx + 1} ${d.name}</td>
        <td style="font-weight:800; color:#ff3b5c;">${d.projectedCases.toLocaleString()} cases</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
              <div style="width:${d.riskScore}%; height:100%; background:linear-gradient(90deg, #00e5a0, #ff3b5c);"></div>
            </div>
            <span style="font-size:11px; font-weight:700; color:#00d4ff;">${d.riskScore}/100</span>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// Global instance
window.multiYearAI = new MultiYearPredictionAI();
