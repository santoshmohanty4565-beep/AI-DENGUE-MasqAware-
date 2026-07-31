/**
 * MosqAware — 2 to 8 Week Outbreak Early Warning Predictor UI Controller
 * Integrates 16 Multi-Modal Signals
 */

class EarlyWarningPredictorUI {
  constructor() {
    this.forecastWeeks = 4;
  }

  initUI() {
    this.bindEvents();
    this.runEarlyWarningForecast();
  }

  bindEvents() {
    const horizonBtns = document.querySelectorAll('.horizon-btn');
    horizonBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        horizonBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.forecastWeeks = parseInt(e.target.getAttribute('data-weeks'));
        this.runEarlyWarningForecast();
      });
    });
  }

  async runEarlyWarningForecast() {
    const district = document.getElementById('ew-district')?.value || 'Khordha';
    const rainfall = parseFloat(document.getElementById('ew-rainfall')?.value || 145);
    const temperature = parseFloat(document.getElementById('ew-temperature')?.value || 31.2);
    const humidity = parseFloat(document.getElementById('ew-humidity')?.value || 82);
    const windSpeed = parseFloat(document.getElementById('ew-wind')?.value || 8.5);
    const waterloggingIndex = parseFloat(document.getElementById('ew-waterlog')?.value || 72) / 100;
    const populationDensity = parseFloat(document.getElementById('ew-popdensity')?.value || 3200);
    const historicalCases = parseFloat(document.getElementById('ew-histcases')?.value || 120);
    const mosquitoDensity = parseFloat(document.getElementById('ew-mosquitodensity')?.value || 88);
    const hospitalAdmissions = parseFloat(document.getElementById('ew-hospital')?.value || 45);
    const googleSearchTrends = parseFloat(document.getElementById('ew-gsearch')?.value || 78);
    const citizenComplaints = parseFloat(document.getElementById('ew-citizen')?.value || 64);
    const socialMediaSignals = parseFloat(document.getElementById('ew-social')?.value || 71);
    const satelliteNDVI = parseFloat(document.getElementById('ew-ndvi')?.value || 65) / 100;
    const landUseType = document.getElementById('ew-landuse')?.value || 'Urban High-Density';
    const urbanizationRate = parseFloat(document.getElementById('ew-urbanization')?.value || 84);

    const payload = {
      district,
      rainfall,
      temperature,
      humidity,
      windSpeed,
      waterloggingIndex,
      populationDensity,
      historicalCases,
      mosquitoDensity,
      hospitalAdmissions,
      googleSearchTrends,
      citizenComplaints,
      socialMediaSignals,
      satelliteNDVI,
      landUseType,
      urbanizationRate,
      forecastWeeks: this.forecastWeeks
    };

    try {
      const res = await fetch('/api/v1/early-warning/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === 'success') {
        this.renderForecastResults(json.prediction);
      }
    } catch (err) {
      console.error('Early Warning Forecast Error:', err);
    }
  }

  renderForecastResults(data) {
    const container = document.getElementById('early-warning-results-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background:rgba(5,13,26,0.95); border:1px solid rgba(0,212,255,0.3); border-radius:14px; padding:20px; box-shadow:0 12px 40px rgba(0,0,0,0.5);">
        
        <!-- Header Alert Banner -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
          <div>
            <div style="font-size:11px; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.8px;">
              ⏱️ ${data.forecastHorizonWeeks}-WEEK OUTBREAK FORECAST (${data.district})
            </div>
            <div style="font-size:22px; font-weight:900; color:#fff; font-family:'Rajdhani',sans-serif;">
              Target Outbreak Peak: <span style="color:#ffd666;">${data.projectedPeakDate}</span>
            </div>
          </div>
          <div style="background:${data.badgeColor}22; border:1px solid ${data.badgeColor}; color:${data.badgeColor}; font-size:14px; font-weight:900; padding:8px 16px; border-radius:20px;">
            ${data.alertLevel} (${data.outbreakProbability}% Probability)
          </div>
        </div>

        <!-- Metrics Grid -->
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:20px;">
          <div style="background:rgba(255,255,255,0.03); padding:14px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700;">BASELINE WEEKLY CASES</div>
            <div style="font-size:24px; font-weight:800; color:#8b9cc8;">${data.baselineCases}</div>
          </div>

          <div style="background:rgba(255,59,92,0.1); padding:14px; border-radius:10px; border:1px solid #ff3b5c; text-align:center;">
            <div style="font-size:10px; color:#ff3b5c; font-weight:800;">PROJECTED WEEKLY SURGE</div>
            <div style="font-size:24px; font-weight:900; color:#ff3b5c;">${data.projectedWeeklyCases}</div>
            <div style="font-size:10px; color:#ff3b5c; font-weight:700;">+${data.caseSurgeIncreasePercent}% Outbreak Surge</div>
          </div>

          <div style="background:rgba(0,212,255,0.08); padding:14px; border-radius:10px; border:1px solid #00d4ff; text-align:center;">
            <div style="font-size:10px; color:#00d4ff; font-weight:800;">EARLY WARNING LEAD TIME</div>
            <div style="font-size:24px; font-weight:900; color:#00d4ff;">${data.forecastHorizonWeeks} Weeks</div>
            <div style="font-size:10px; color:#00d4ff;">(${data.forecastHorizonWeeks * 7} Days Advance Notice)</div>
          </div>
        </div>

        <!-- 16 Signal Feature Influence Breakdown -->
        <div style="margin-bottom:20px;">
          <div style="font-size:12px; font-weight:800; color:var(--accent-cyan); margin-bottom:10px;">
            📊 16-Signal AI Feature Influence Breakdown:
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            ${data.signalContributions.map(s => `
              <div style="background:rgba(255,255,255,0.02); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:11px; font-weight:700; color:#fff;">${s.name}</div>
                  <div style="font-size:10px; color:var(--text-muted);">Measured Telemetry: <strong style="color:#00d4ff;">${s.value}</strong></div>
                </div>
                <span style="font-size:11px; font-weight:800; color:#ffd666;">+${s.weight}%</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Municipal Outbreak Emergency Directives -->
        <div>
          <div style="font-size:12px; font-weight:800; color:#ff3b5c; margin-bottom:10px;">
            🚨 Municipal Early Warning Directives (${data.district} District):
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${data.municipalActionPlan.map(act => `
              <div style="background:rgba(255,59,92,0.08); padding:10px 14px; border-radius:8px; border:1px solid rgba(255,59,92,0.25); font-size:11px; font-weight:700; color:#fff;">
                ${act}
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }
}

window.earlyWarningPredictor = new EarlyWarningPredictorUI();
