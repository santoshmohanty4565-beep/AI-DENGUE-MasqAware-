/**
 * MosqAware — AI Assistant Engine ("DENGUEl-AI")
 * Smart, short-form, common point-to-point response engine storing all project data.
 */

const DENGUEL_AI = {
  name: "DENGUEl-AI Assistant",
  version: "v3.4 (Short-Form Common Responses)",

  // Complete data repository stored in memory
  data: {
    stateCases2026: "3,300+ provisional",
    khordhaCases: 1154,
    khordhaR0: 2.85,
    khordhaHotspots: ["Patia", "Sikharchandi", "Salia Sahi", "Nayapalli", "Prasanti Vihar"],
    hospitals: [
      { name: "SCB Medical College Cuttack", beds: 2500, icu: 120, phone: "0671-2414080" },
      { name: "Capital Hospital Bhubaneswar", beds: 750, icu: 45, phone: "0674-2391983" },
      { name: "AIIMS Bhubaneswar", beds: 1000, icu: 80, phone: "0674-2476789" },
      { name: "MKCG Berhampur", beds: 1150, icu: 60, phone: "0680-2292746" },
      { name: "VIMSAR Burla", beds: 1050, icu: 50, phone: "0663-2430768" }
    ],
    fftSignatures: {
      aegypti: "450–610 Hz (Peak: 535 Hz)",
      albopictus: "540–720 Hz (Peak: 625 Hz)",
      culex: "420 Hz",
      anopheles: "330 Hz"
    },
    forecast2027: { low: 10000, high: 15000, peak: "July–October 2027", serotype: "DENV-2 (67%)" },
    models: { lstm: "94.2% accuracy", sarima: "87.4% accuracy", gnn: "7,420 spatial nodes" },
    villages: { total: 51313, blocks: 311, tahasils: 464, largest: "Tora (Bargarh, pop: 18,399)" },
    helplines: { health: "104", ambulance: "108", bmc: "0674-2392516" }
  },

  // Knowledge retrieval engine — returns commonly short, crisp answers
  query(input) {
    if (!input || !input.trim()) return "Ask a question (e.g. Khordha risk, 2027 forecast, hospitals, wingbeat Hz, or Golden Rules).";

    const text = input.toLowerCase().trim();

    // 1. Khordha & Bhubaneswar Hotspots
    if (text.includes("khordha") || text.includes("bhubaneswar") || text.includes("patia") || text.includes("hotspot")) {
      return `🔴 **Khordha (Bhubaneswar)**: 1,154 cases | Critical Watch (R₀ = 2.85).\n📍 *Hotspots*: Patia, Sikharchandi, Salia Sahi, Nayapalli.\n👉 <a href="index.html" style="color:var(--accent-cyan); font-weight:700;">View Map →</a>`;
    }

    // 2. Doctors, Hospitals & ICU Beds
    if (text.includes("hospital") || text.includes("icu") || text.includes("scb") || text.includes("capital hospital") || text.includes("aiims") || text.includes("doctor") || text.includes("bed") || text.includes("vimsar") || text.includes("mkcg")) {
      return `🏥 **Hospitals & Emergency ICU Beds**:
• **SCB Cuttack**: 120 ICU Beds (0671-2414080)
• **Capital Hospital BBSR**: 45 ICU Beds (0674-2391983)
• **AIIMS BBSR**: 80 ICU Beds (0674-2476789)
📞 *Helpline*: Call **104** (Health) or **108** (Ambulance).
👉 <a href="directory.html" style="color:var(--accent-cyan); font-weight:700;">Full Directory →</a>`;
    }

    // 3. Audio Acoustics & Wingbeat FFT Frequencies
    if (text.includes("acoustic") || text.includes("frequency") || text.includes("fft") || text.includes("wingbeat") || text.includes("hz") || text.includes("sound") || text.includes("audio") || text.includes("aegypti") || text.includes("albopictus")) {
      return `🎙️ **Mosquito FFT Spectrum**:
• **Aedes aegypti**: 535 Hz (450–610 Hz)
• **Aedes albopictus**: 625 Hz (540–720 Hz)
• **Culex**: 420 Hz | **Anopheles**: 330 Hz
⚡ *Confidence >85%* triggers automatic larvicide dispatch alert.
👉 <a href="index.html" style="color:var(--accent-cyan); font-weight:700;">Audio FFT Analyzer →</a>`;
    }

    // 4. 2027 Forecast & Outbreak Projections
    if (text.includes("2027") || text.includes("forecast") || text.includes("future") || text.includes("projection") || text.includes("rebound")) {
      return `🔮 **2027 Forecast Summary**:
• **Cases**: 10,000 – 15,000 projected cases (Peak: July–Oct 2027)
• **Serotype**: DENV-2 dominant (67% share, DHF risk)
👉 <a href="forecast2027.html" style="color:var(--accent-cyan); font-weight:700;">Forecast Page →</a>`;
    }

    // 5. Symptoms & DENV-2 Hemorrhagic Warning
    if (text.includes("symptom") || text.includes("fever") || text.includes("bleed") || text.includes("dhf") || text.includes("vomit") || text.includes("pain") || text.includes("rash")) {
      return `🩺 **Symptoms & Warning Signs**:
• **Common**: High fever, eye pain, joint pain & rash.
🚨 **DHF Alert**: Fever + Bleeding + Vomiting requires immediate hospital transport (**108 Ambulance**).
👉 <a href="awareness.html" style="color:var(--accent-cyan); font-weight:700;">Symptom Checker →</a>`;
    }

    // 6. Golden Rules to Stay Safe
    if (text.includes("golden") || text.includes("rule") || text.includes("stay safe") || text.includes("prevention") || text.includes("protect") || text.includes("standing water")) {
      return `🛡️ **5 Golden Rules**:
1. Clear standing water weekly.
2. Wear full sleeves & DEET repellent.
3. Use window mesh screens.
4. Aedes bite 6–9 AM & 3–6 PM.
5. Call 104 for stagnant water complaints.
👉 <a href="awareness.html" style="color:var(--accent-cyan); font-weight:700;">Prevention Guide →</a>`;
    }

    // 7. ML Models & Accuracy
    if (text.includes("model") || text.includes("machine learning") || text.includes("ai") || text.includes("sarima") || text.includes("xgboost") || text.includes("accuracy") || text.includes("lstm")) {
      return `🤖 **AI Model Benchmarks**:
• **LSTM + Attention**: 94.2% accuracy (F1 = 0.927)
• **Bayesian SARIMA-XGBoost**: 87.4% accuracy (2–8 wk lead time)
👉 <a href="prediction.html" style="color:var(--accent-cyan); font-weight:700;">Prediction Suite →</a>`;
    }

    // 8. 51,313 Villages & Administrative Database
    if (text.includes("village") || text.includes("51k") || text.includes("block") || text.includes("tora") || text.includes("administrative")) {
      return `🏡 **Administrative Data**:
• 51,313 Villages across 311 CD Blocks & 30 Districts.
• Largest Village: **Tora** (Bargarh, pop: 18,399).
👉 <a href="directory.html" style="color:var(--accent-cyan); font-weight:700;">Village Database →</a>`;
    }

    // 9. Emergency Helplines & Contacts
    if (text.includes("helpline") || text.includes("call") || text.includes("number") || text.includes("phone") || text.includes("contact") || text.includes("104") || text.includes("108")) {
      return `📞 **24x7 Helplines**:
• **State Health**: 104 (Toll-Free)
• **Ambulance**: 108
• **BMC Control**: 0674-2392516`;
    }

    // 10. Auth, OTP & Accounts
    if (text.includes("login") || text.includes("otp") || text.includes("gmail") || text.includes("password") || text.includes("auth") || text.includes("sign in")) {
      return `🔐 **OTP Sign In**: Enter your email/Gmail on <a href="login.html" style="color:var(--accent-cyan); font-weight:700;">login.html</a> to get a 6-digit Gmail OTP.`;
    }

    // Default Short Fallback
    return `🦟 **MosqAware AI**: Ask about **Khordha risk**, **2027 forecast**, **hospitals & ICU beds**, **wingbeat FFTs**, or **Golden Rules**.`;
  }
};

// ── UI Integration for Floating Assistant Widget ─────────────────────────────
function initAssistantWidget() {
  if (document.getElementById('denguel-assistant-container')) return;

  const html = `
    <div id="denguel-assistant-container" class="assistant-container">
      <!-- Toggle Floating Button -->
      <button id="assistant-toggle-btn" class="assistant-toggle" onclick="toggleAssistantWidget()">
        <span class="assistant-bot-icon">🤖</span>
        <span class="assistant-badge">AI Assistant</span>
      </button>

      <!-- Assistant Modal Window -->
      <div id="assistant-modal" class="assistant-modal">
        <div class="assistant-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#059669,#047857); display:flex; align-items:center; justify-content:center; font-size:18px; color:#fff;">🤖</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:var(--text-primary);">DENGUEl-AI Assistant</div>
              <div style="font-size:10px; color:var(--accent-green);">● Active • Short-Form AI Engine</div>
            </div>
          </div>
          <button style="background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer;" onclick="toggleAssistantWidget()">✕</button>
        </div>

        <!-- Quick Prompts Chips -->
        <div class="assistant-chips">
          <button class="chip-btn" onclick="sendAssistantPrompt('Golden Rules')">🛡️ Golden Rules</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('2027 Forecast')">🔮 2027 Forecast</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Khordha hotspots')">🔴 Khordha Hotspots</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Hospitals and ICU beds')">🏥 Hospitals & ICU</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Acoustic FFT Frequencies')">🎙️ Audio FFT</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('DENV-2 symptoms')">🧬 DENV-2 Symptoms</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('ML Model accuracy')">🤖 AI Models</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('51313 villages')">🏡 51k Villages</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Helpline numbers')">📞 Helplines</button>
        </div>

        <!-- Chat Output Messages -->
        <div id="assistant-chat-body" class="assistant-body">
          <div class="chat-msg bot">
            Hello! I am <strong>DENGUEl-AI Assistant</strong>. Ask me any question for quick, concise, short-form answers!
          </div>
        </div>

        <!-- Chat Input Footer -->
        <div class="assistant-footer">
          <input type="text" id="assistant-input" placeholder="Ask DENGUEl-AI anything..." onkeydown="if(event.key==='Enter') sendAssistantMessage()" />
          <button id="assistant-send-btn" onclick="sendAssistantMessage()"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function toggleAssistantWidget() {
  const modal = document.getElementById('assistant-modal');
  if (modal) {
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) {
      document.getElementById('assistant-input')?.focus();
    }
  }
}

function sendAssistantPrompt(text) {
  const input = document.getElementById('assistant-input');
  if (input) {
    input.value = text;
    sendAssistantMessage();
  }
}

function sendAssistantMessage() {
  const input = document.getElementById('assistant-input');
  const chatBody = document.getElementById('assistant-chat-body');
  if (!input || !chatBody) return;

  const userText = input.value.trim();
  if (!userText) return;

  // Add User message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-msg user';
  userMsgDiv.textContent = userText;
  chatBody.appendChild(userMsgDiv);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot response
  setTimeout(() => {
    const responseHtml = DENGUEL_AI.query(userText);
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chat-msg bot';
    botMsgDiv.innerHTML = responseHtml;
    chatBody.appendChild(botMsgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 300);
}

// Auto-initialize widget on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAssistantWidget);
} else {
  initAssistantWidget();
}
