/**
 * MosqAware — Swarm Cellular Automata Micro-Climate Epidemic Simulator
 * Models temperature-dependent biting rates, Extrinsic Incubation Period (EIP), $R_0$, and vector control interventions.
 */

class EpidemicSwarmSimulator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.gridWidth = 40;
    this.gridHeight = 25;
    this.particles = [];
    this.isRunning = false;

    // Simulation Parameters
    this.params = {
      temp: 29.5,         // °C (Optimal Aedes biting 28-32°C)
      humidity: 78,      // % (High humidity extends vector lifespan)
      ndwi: 0.65,        // Water reflection index (0-1)
      droneFogging: 20,  // Larvicide/Thermal Fogging Coverage %
      population: 1500   // Human & mosquito host density
    };

    this.metrics = {
      r0: 2.8,
      vectorDensity: 'HIGH',
      eipDays: 8.4,
      predictedCases14d: 420
    };
  }

  initUI() {
    this.canvas = document.getElementById('sim-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resetSimulation();
      this.bindControls();
    }
  }

  bindControls() {
    const bindSlider = (id, paramKey, unit = '') => {
      const slider = document.getElementById(id);
      const valDisp = document.getElementById(`${id}-val`);
      if (slider && valDisp) {
        slider.addEventListener('input', (e) => {
          this.params[paramKey] = parseFloat(e.target.value);
          valDisp.textContent = `${e.target.value}${unit}`;
          this.recalculateEpidemiology();
        });
      }
    };

    bindSlider('sim-temp', 'temp', '°C');
    bindSlider('sim-humidity', 'humidity', '%');
    bindSlider('sim-ndwi', 'ndwi', '');
    bindSlider('sim-fogging', 'droneFogging', '%');
  }

  recalculateEpidemiology() {
    const T = this.params.temp;
    const H = this.params.humidity;
    const W = this.params.ndwi;
    const F = this.params.droneFogging / 100;

    // Temperature-dependent biting rate equation: b = 0.00014 * T * (T - 13.2) * sqrt(39.6 - T)
    let bitingRate = 0.25;
    if (T > 13.2 && T < 39.6) {
      bitingRate = 0.00014 * T * (T - 13.2) * Math.sqrt(39.6 - T);
    }

    // Extrinsic Incubation Period (EIP days): EIP(T) = exp(4.7 - 0.09 * T)
    const eip = Math.max(4.0, Math.exp(4.7 - 0.09 * T));

    // Vector longevity & water breeding factor
    const vectorLifespan = (H / 100) * 28;
    const breedingFactor = Math.pow(W, 1.2) * 2.5;

    // Basic Reproduction Number (R0)
    let r0 = (bitingRate * bitingRate * vectorLifespan * breedingFactor) / (eip * 0.4);
    r0 = r0 * (1 - F * 0.75); // Reduced by larvicide fogging

    this.metrics.r0 = parseFloat(Math.max(0.2, r0).toFixed(2));
    this.metrics.eipDays = parseFloat(eip.toFixed(1));

    // 14-day case velocity
    const baseCases = 150 * W * (T / 25);
    this.metrics.predictedCases14d = Math.round(baseCases * Math.pow(this.metrics.r0, 1.4));

    if (this.metrics.r0 > 3.0) this.metrics.vectorDensity = 'OUTBREAK CRITICAL';
    else if (this.metrics.r0 > 1.8) this.metrics.vectorDensity = 'HIGH SURVEILLANCE';
    else if (this.metrics.r0 > 1.0) this.metrics.vectorDensity = 'MODERATE WATCH';
    else this.metrics.vectorDensity = 'CONTROLLED (SAFE)';

    this.updateMetricsUI();
  }

  updateMetricsUI() {
    const el = id => document.getElementById(id);
    if (!el('sim-r0-val')) return;

    el('sim-r0-val').textContent = this.metrics.r0;
    el('sim-r0-val').style.color = this.metrics.r0 > 2.0 ? '#ff3b5c' : (this.metrics.r0 > 1.0 ? '#ff8c00' : '#00e5a0');
    
    el('sim-eip-val').textContent = `${this.metrics.eipDays} Days`;
    el('sim-cases-val').textContent = `~${this.metrics.predictedCases14d} Cases`;
    el('sim-status-val').textContent = this.metrics.vectorDensity;
    el('sim-status-val').style.color = this.metrics.r0 > 2.0 ? '#ff3b5c' : '#00d4ff';
  }

  resetSimulation() {
    this.particles = [];
    const count = 120;
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        isInfected: i < 15,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI
      });
    }
    this.recalculateEpidemiology();
    this.renderFrame();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  loop() {
    if (!this.isRunning) return;
    this.updateParticles();
    this.renderFrame();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  updateParticles() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const speedMult = (this.params.temp / 25) * (1 - (this.params.droneFogging / 100) * 0.5);

    for (let p of this.particles) {
      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult;
      p.pulse += 0.08;

      // Bounce off walls
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Infection diffusion upon collision
      if (p.isInfected) {
        for (let other of this.particles) {
          if (!other.isInfected) {
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 22 && Math.random() < (this.metrics.r0 * 0.08)) {
              other.isInfected = true;
            }
          }
        }
      }
    }
  }

  renderFrame() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark canvas background
    this.ctx.fillStyle = '#050d1a';
    this.ctx.fillRect(0, 0, w, h);

    // Draw stagnant water breeding spots based on NDWI index
    const waterSpotsCount = Math.round(this.params.ndwi * 8);
    for (let i = 0; i < waterSpotsCount; i++) {
      const wx = ((i * 137) % w);
      const wy = ((i * 219) % h);
      const rad = 30 + (i * 5);

      const grad = this.ctx.createRadialGradient(wx, wy, 0, wx, wy, rad);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.18)');
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(wx, wy, rad, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw Larvicide Fogging Protection Shield if active
    if (this.params.droneFogging > 0) {
      this.ctx.strokeStyle = `rgba(0, 229, 160, ${this.params.droneFogging / 150})`;
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([8, 8]);
      this.ctx.strokeRect(10, 10, w - 20, h - 20);
      this.ctx.setLineDash([]);
    }

    // Draw mosquito/human vector particles
    for (let p of this.particles) {
      this.ctx.beginPath();
      const r = p.radius + Math.sin(p.pulse) * 0.8;
      this.ctx.arc(p.x, p.y, Math.max(1, r), 0, Math.PI * 2);

      if (p.isInfected) {
        this.ctx.fillStyle = '#ff3b5c';
        this.ctx.shadowColor = '#ff3b5c';
        this.ctx.shadowBlur = 8;
      } else {
        this.ctx.fillStyle = '#00e5a0';
        this.ctx.shadowColor = '#00e5a0';
        this.ctx.shadowBlur = 4;
      }
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }
}

// Global instance
window.swarmSim = new EpidemicSwarmSimulator();
