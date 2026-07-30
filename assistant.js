/**
 * MosqAware — AI Assistant Engine ("DENGUEl-AI")
 * Intelligent conversational assistant powered by complete Odisha Dengue Data Repository
 */

const DENGUEL_AI = {
  name: "DENGUEl-AI Assistant",
  version: "v3.2",

  // Knowledge retrieval engine
  query(input) {
    if (!input || !input.trim()) return "Please ask a question about Odisha dengue data, predictions, districts, or symptoms.";

    const text = input.toLowerCase().trim();

    // 1. 2027 Forecast / Projections
    if (text.includes("2027") || text.includes("forecast") || text.includes("future") || text.includes("projection") || text.includes("rebound") || text.includes("next year")) {
      const f = ODISHA_DATA.forecast2027.summary;
      return `
🔮 **2027 Outbreak Forecast Summary**
• **Estimated Cases**: <strong style="color:var(--accent-coral);">${f.estimatedCasesLow.toLocaleString()} – ${f.estimatedCasesHigh.toLocaleString()}</strong> (Midpoint: 12,500)
• **Peak Outbreak Months**: <strong style="color:var(--accent-yellow);">${f.peakMonths.join(", ")} 2027</strong>
• **State Trajectory**: <span class="trend-pill trend-up-pill">📈 UPWARD REBOUND</span>
• **High-Risk Districts**: Khordha (30–35% share), Cuttack (15–20%), Balasore (10–15%), Sundargarh, Mayurbhanj.
• **Primary Drivers**: Immunity gap from 2025–26 low TPR (0.98%), DENV-2 serotype dominance (67%), and post-monsoon climate conditions.
• **Critical Action Window**: **January – June 2027** for pre-monsoon vector control.

👉 <a href="forecast2027.html" style="color:var(--accent-cyan); font-weight:600;">Open Full 2027 Forecast Page →</a>
      `;
    }

    // 2. Districts / Hotspots / Villages / Density
    if (text.includes("district") || text.includes("khordha") || text.includes("cuttack") || text.includes("balasore") || text.includes("bhubaneswar") || text.includes("patia") || text.includes("hotspot") || text.includes("village") || text.includes("density")) {
      const admin = ODISHA_DATA.administrativeData?.overviewStats;
      return `
🗺️ **District & Village Administrative Information**
• **Odisha Overview**: ${admin?.districts || 30} Districts · ${admin?.cdBlocks || 311} CD Blocks · ${admin?.tahasils || 464} Tahasils · <strong style="color:var(--accent-cyan);">${admin?.totalVillages.toLocaleString() || "51,313"} Villages</strong>
• **Top Risk Districts (2026-2027)**:
  1. 🔴 **Khordha (Bhubaneswar)** — Census Code 386 · Pop Density 461 pop/km² · Projected 4,375 cases (30–35% share)
     *Micro-Hotspots*: Patia, Sikharchandi, Prasanti Vihar, Salia Sahi, Nayapalli.
  2. 🟠 **Cuttack** — Density 521 pop/km² · Hotspots: Choudwar, Jagatpur Industrial Zone.
  3. 🟠 **Balasore** — Density 654 pop/km² (Highest density).
• **Largest Village**: *Tora* (Bargarh district, pop: 18,399, 3,958 households).

👉 <a href="directory.html" style="color:var(--accent-cyan); font-weight:600;">Explore 51,313 Village Repository →</a>
      `;
    }

    // 3. Symptoms / Clinical / Diagnostic / MKCG Study
    if (text.includes("symptom") || text.includes("fever") || text.includes("pain") || text.includes("rash") || text.includes("bleed") || text.includes("mkcg") || text.includes("hospital") || text.includes("doctor") || text.includes("clinical") || text.includes("severe")) {
      const p = ODISHA_DATA.forecast2027?.pediatricOutcomes;
      return `
🩺 **Dengue Symptoms & Clinical Profile (MKCG Study)**
• **Key Symptoms**: High fever (>38°C), severe retro-orbital headache, breakbone joint/muscle pain, skin rash, nausea.
• **Warning Signs (Severe Dengue / DHF)**: Abdominal pain, persistent vomiting, mucosal bleeding, plasma leakage.
• **Clinical Outcomes (MKCG Medical College)**:
  - Non-Severe: 86.6% | **Severe Cases (DHF)**: <strong style="color:var(--accent-coral);">13.4%</strong>
  - Hepatomegaly (Enlarged Liver): **43.8%** | Thrombocytopenia (Low Platelets): **27.5%**
  - Pediatric CFR: **1.03%** | Avg Hospital Stay: **3.8 days**

👉 <a href="awareness.html" style="color:var(--accent-cyan); font-weight:600;">Launch Interactive Symptom Self-Checker →</a>
      `;
    }

    // 4. ML Models / AI / SARIMA / XGBoost / GNN / Repos / Blueprint
    if (text.includes("model") || text.includes("machine learning") || text.includes("ai") || text.includes("sarima") || text.includes("xgboost") || text.includes("lstm") || text.includes("gnn") || text.includes("repo") || text.includes("accuracy") || text.includes("github")) {
      return `
🤖 **AI Prediction Engine & Model Taxonomy**
• **Primary Model**: <strong style="color:var(--accent-cyan);">Bayesian SARIMA–XGBoost Hybrid</strong> (Lowest CRPS, highest coverage probability CVG).
• **Alternative Evaluated Models**:
  - **Hybrid LSTM + XGBoost + Attention**: <strong style="color:var(--accent-green);">94.2% Accuracy</strong>, F1-Score: **0.927**
  - **Ensemble Random Forest**: R² = 0.86, RMSE = 5.72
  - **Spatiotemporal GNN**: 7,420 spatial nodes, 23,066 contiguity edges
  - **Temporal Fusion Transformer (TFT)**: Municipality-level weekly forecasting
• **Performance Metrics**: Accuracy **87.4%**, Lead Time **2–5 months**, Sensitivity **0.885**.
• **Open-Source Repos**: \`DaytonThorpe/dengue-forecasting\`, \`eduardocorrearaujo/dengue-oracle\`, \`Siam183/dengue-risk-prediction\`.

👉 <a href="prediction.html" style="color:var(--accent-cyan); font-weight:600;">Open AI Prediction Engine & Model Benchmarks →</a>
      `;
    }

    // 5. Climate / Weather / Lags / NDWI / Satellite
    if (text.includes("weather") || text.includes("climate") || text.includes("temp") || text.includes("rain") || text.includes("humidity") || text.includes("satellite") || text.includes("ndwi") || text.includes("monsoon") || text.includes("lag")) {
      return `
🌡️ **Climate & Satellite Risk Factors**
• **Temperature (41% weight)**: $r = 0.28$ (Lag: 1–5 months). $>27^\circ\text{C}$ accelerates mosquito breeding and viral replication.
• **Rainfall (39% weight)**: $r = 0.37$ (Lag: 0–2 months). Strongest predictor. 50–150 mm/mo creates breeding pools; $>200\text{ mm}$ flushes larvae.
• **Humidity (20% weight)**: $r = 0.18$ (Lag: 1–4 months). 60–78% relative humidity is optimal for Aedes survival.
• **Landsat-8 Satellite Indices**:
  - **NDWI** (Water Index): 0.38 · Identifies waterlogging pools
  - **NDMI** (Moisture Index): 0.34 · Soil moisture retention
  - **NDVI** (Vegetation): 0.58 · Shade & micro-climate humidity
  - **LST** (Land Surface Temp): 28.1°C

👉 <a href="breeding.html" style="color:var(--accent-cyan); font-weight:600;">Open Satellite Breeding Index Tracker →</a>
      `;
    }

    // 6. Emergency Contacts & Helpline
    if (text.includes("helpline") || text.includes("call") || text.includes("number") || text.includes("emergency") || text.includes("phone") || text.includes("contact") || text.includes("104") || text.includes("108")) {
      return `
📞 **Emergency Dengue Helplines (24x7 Free)**
• **State Health Helpline**: <a href="tel:104" style="color:var(--accent-coral); font-weight:700; font-size:16px;">104</a>
• **Emergency Ambulance**: <a href="tel:108" style="color:var(--accent-coral); font-weight:700; font-size:16px;">108</a>
• **Bhubaneswar Municipal Corp (BMC)**: <a href="tel:06742392516" style="color:var(--accent-cyan);">0674-2392516</a>
• **National Health Mission**: <a href="tel:18003456977" style="color:var(--accent-cyan);">1800-345-6977</a>

👉 Free testing available at SCB Cuttack, Capital Hospital Bhubaneswar, and AIIMS Bhubaneswar.
      `;
    }

    // 7. General / Fallback Overview
    return `
🦟 **MosqAware Knowledge System**
I can help you with all information regarding dengue in Odisha:
• **2027 Outbreak Forecast**: 10,000–15,000 cases projected (SARIMA-XGBoost)
• **State Status**: 3,300+ provisional cases in 2026 (Khordha: 1,154 cases)
• **51,313 Village Repository**: Population density, census codes, district rankings
• **ML Models**: Hybrid SARIMA-XGBoost, LSTM+Attention (94.2% acc), GNN, SHAP
• **Symptom Checker & Helplines**: Call 104 or check symptoms interactively

Ask me a specific question (e.g. *"What is Khordha risk?"*, *"Tell me about 2027 forecast"*, *"How to test for dengue?"*)!
    `;
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
            <div style="width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,var(--accent-cyan),#0066ff); display:flex; align-items:center; justify-content:center; font-size:18px; color:#000;">🤖</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:var(--text-primary);">DENGUEl-AI Assistant</div>
              <div style="font-size:10px; color:var(--accent-green);">● Active • Odisha Dengue Knowledge Base</div>
            </div>
          </div>
          <button style="background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer;" onclick="toggleAssistantWidget()">✕</button>
        </div>

        <!-- Quick Prompts Chips -->
        <div class="assistant-chips">
          <button class="chip-btn" onclick="sendAssistantPrompt('2027 Forecast')">🔮 2027 Forecast</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Khordha & Bhubaneswar risk')">🔴 Khordha Hotspots</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('DENV-2 symptoms & severity')">🧬 DENV-2 Severity</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('ML Models and accuracy')">🤖 AI Models</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('51313 villages dataset')">🏡 51k Villages</button>
          <button class="chip-btn" onclick="sendAssistantPrompt('Helpline numbers')">📞 Helplines</button>
        </div>

        <!-- Chat Output Messages -->
        <div id="assistant-chat-body" class="assistant-body">
          <div class="chat-msg bot">
            Hello! I am <strong>DENGUEl-AI Assistant</strong>. Ask me anything about Odisha dengue data, 2027 outbreak forecasts, 51,313 village stats, ML model accuracy, or symptoms!
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
  }, 400);
}

// Auto-initialize widget on load
document.addEventListener('DOMContentLoaded', () => {
  initAssistantWidget();
});
