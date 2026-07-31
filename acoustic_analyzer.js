/**
 * MosqAware — AI Bio-Acoustic Mosquito Wingbeat Spectrograph & Species Classifier
 * Uses Web Audio API Real-time FFT spectrum analysis + Synthetic Wingbeat Generator for offline testing.
 */

class AcousticWingbeatAI {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.microphoneStream = null;
    this.animFrameId = null;
    this.synthOsc = null;
    this.isListening = false;
    this.canvas = null;
    this.ctx = null;
    this.sampleRate = 44100;
    this.fftSize = 2048;

    this.vectorDB = [
      { name: 'Aedes aegypti (Female)', minHz: 450, maxHz: 610, peakHz: 535, risk: 'CRITICAL', icon: '🦟', color: '#ff3b5c' },
      { name: 'Aedes albopictus (Female)', minHz: 540, maxHz: 720, peakHz: 625, risk: 'HIGH', icon: '🦟', color: '#ff8c00' },
      { name: 'Culex quinquefasciatus', minHz: 350, maxHz: 490, peakHz: 420, risk: 'MODERATE', icon: '🦟', color: '#ffcc00' },
      { name: 'Anopheles stephensi', minHz: 280, maxHz: 390, peakHz: 330, risk: 'LOW (Malaria)', icon: '🦟', color: '#00d4ff' }
    ];
  }

  initUI() {
    this.canvas = document.getElementById('acoustic-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.drawIdleSpectrum();
    }
  }

  async startListening() {
    if (this.isListening) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.8;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.microphoneStream = this.audioCtx.createMediaStreamSource(stream);
      this.microphoneStream.connect(this.analyser);

      this.isListening = true;
      this.renderLoop();
      this.updateStatus('🎙️ Listening live microphone audio... Wingbeat FFT active.', 'active');
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      this.updateStatus('⚠️ Microphone unavailable. Click a Synthetic Vector Tone preset below to test!', 'warning');
    }
  }

  stopListening() {
    if (this.microphoneStream) {
      this.microphoneStream.disconnect();
      this.microphoneStream = null;
    }
    if (this.synthOsc) {
      this.synthOsc.stop();
      this.synthOsc.disconnect();
      this.synthOsc = null;
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.isListening = false;
    this.drawIdleSpectrum();
    this.updateStatus('⏸️ Acoustic Spectrograph Standby', 'idle');
  }

  // Play synthetic tone preset for instant demonstration without live mosquito nearby
  playSynthPreset(freqHz, profileName) {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.analyser) {
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = this.fftSize;
    }

    if (this.synthOsc) {
      this.synthOsc.stop();
      this.synthOsc.disconnect();
    }

    // Create synthetic wingbeat tone with slight vibrato modulation
    const osc = this.audioCtx.createOscillator();
    const lfo = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = freqHz;

    lfo.type = 'sine';
    lfo.frequency.value = 12; // 12Hz wing wobble
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 15;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.value = 0.12;

    osc.connect(gain);
    gain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    osc.start();
    lfo.start();
    this.synthOsc = osc;

    this.isListening = true;
    this.renderLoop();
    this.updateStatus(`🔊 Injecting Synthetic ${profileName} Wingbeat (${freqHz} Hz)...`, 'active');

    // Auto stop tone after 5 seconds
    setTimeout(() => {
      if (this.synthOsc === osc) {
        osc.stop();
        this.stopListening();
      }
    }, 5000);
  }

  renderLoop() {
    if (!this.isListening || !this.analyser || !this.canvas || !this.ctx) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.fillStyle = '#050d1a';
    this.ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Find peak frequency in mosquito range (200Hz - 1000Hz)
    const nyquist = (this.audioCtx ? this.audioCtx.sampleRate : 44100) / 2;
    let maxVal = 0;
    let peakBin = 0;

    const minBin = Math.floor((200 / nyquist) * bufferLength);
    const maxBin = Math.floor((1000 / nyquist) * bufferLength);

    const barWidth = width / (maxBin - minBin);

    for (let i = minBin; i < maxBin; i++) {
      const val = dataArray[i];
      if (val > maxVal) {
        maxVal = val;
        peakBin = i;
      }

      const x = (i - minBin) * barWidth;
      const barHeight = (val / 255) * (height - 20);

      // Dynamic color gradient based on frequency
      const binFreq = (i / bufferLength) * nyquist;
      const isAedes = binFreq >= 450 && binFreq <= 720;
      
      const grad = this.ctx.createLinearGradient(0, height, 0, 0);
      if (isAedes && val > 100) {
        grad.addColorStop(0, '#ff3b5c');
        grad.addColorStop(1, '#ff8c00');
      } else {
        grad.addColorStop(0, '#00e5a0');
        grad.addColorStop(1, '#00d4ff');
      }

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
    }

    // Process detected peak
    const detectedHz = Math.round((peakBin / bufferLength) * nyquist);
    if (maxVal > 80 && detectedHz >= 200 && detectedHz <= 950) {
      this.classifyWingbeat(detectedHz, maxVal);
    } else {
      this.updateResultCard(null, 0, maxVal);
    }

    this.animFrameId = requestAnimationFrame(() => this.renderLoop());
  }

  classifyWingbeat(freqHz, magnitude) {
    const match = this.vectorDB.find(v => freqHz >= v.minHz && freqHz <= v.maxHz);
    this.updateResultCard(match, freqHz, magnitude);
  }

  updateResultCard(vector, freqHz, magnitude) {
    const el = id => document.getElementById(id);
    if (!el('acoustic-result-title')) return;

    if (!vector || magnitude < 70) {
      el('acoustic-result-title').textContent = 'Listening for Wingbeat Frequencies...';
      el('acoustic-result-freq').textContent = freqHz > 0 ? `${freqHz} Hz` : '-- Hz';
      el('acoustic-result-risk').textContent = 'NO VECTOR DETECTED';
      el('acoustic-result-risk').className = 'acoustic-badge safe';
      el('acoustic-result-desc').textContent = 'Ambient room sound detected. Bring phone microphone closer to mosquito or click a demo tone.';
      return;
    }

    el('acoustic-result-title').textContent = `${vector.icon} ${vector.name}`;
    el('acoustic-result-freq').textContent = `${freqHz} Hz (Peak Match: ${vector.peakHz} Hz)`;
    el('acoustic-result-risk').textContent = `RISK: ${vector.risk}`;
    el('acoustic-result-risk').className = `acoustic-badge ${vector.risk.toLowerCase().split(' ')[0]}`;
    el('acoustic-result-desc').innerHTML = `
      <strong>Matched Profile:</strong> ${vector.name}<br>
      <strong>Vector Danger:</strong> ${vector.risk === 'CRITICAL' ? '⚠️ High transmission probability for Dengue Virus (DENV-1 to 4).' : 'Monitored vector species.'}<br>
      <strong>Recommended Action:</strong> Apply larvicide, eliminate stagnant containers, and use protective screens.
    `;
  }

  drawIdleSpectrum() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.fillStyle = '#050d1a';
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
    this.ctx.font = '14px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🎙️ Click "Start Acoustic AI Scanner" or select a Synthetic Vector Preset to initialize FFT spectrum', w / 2, h / 2);
  }

  updateStatus(msg, type) {
    const st = document.getElementById('acoustic-status');
    if (st) {
      st.textContent = msg;
      st.className = `acoustic-status-bar ${type}`;
    }
  }
}

// Global instance
window.acousticAI = new AcousticWingbeatAI();
