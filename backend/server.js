/**
 * MosqAware — Backend API Server
 * Node.js + Express
 * Serving Dengue Outbreak Predictions, 51k Village Repository, and AI Assistant API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // allow loading Leaflet maps and external CDN scripts
}));
app.use(morgan('dev'));
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname, './')));

// Mock / In-Memory Dataset (Derived from Odisha Health Dept + NCVBDC)
const DATA = {
  summary: {
    stateRiskLevel: 'WATCH',
    cases2026Provisional: 3300,
    khordhaCases2026: 1154,
    tpr2026: 0.98,
    activeOutbreakDistricts: 3,
    lastUpdated: new Date().toISOString(),
  },

  yearlyCases: [
    { year: 2018, cases: 4210, deaths: 6, tpr: 3.21 },
    { year: 2019, cases: 5830, deaths: 8, tpr: 4.10 },
    { year: 2020, cases: 3920, deaths: 5, tpr: 2.95 },
    { year: 2021, cases: 7548, deaths: 0, tpr: null },
    { year: 2022, cases: 7063, deaths: 0, tpr: null },
    { year: 2023, cases: 12845, deaths: 1, tpr: 9.34 },
    { year: 2024, cases: 9892, deaths: 0, tpr: 5.61 },
    { year: 2025, cases: 2635, deaths: 0, tpr: 1.83 },
    { year: 2026, cases: 3300, deaths: 0, tpr: 0.98, provisional: true },
    { year: 2027, cases: 12500, deaths: null, tpr: null, projected: true },
  ],

  districts: [
    { id: 'KHO', name: 'Khordha', cases2024: 1782, cases2025: 475, cases2026est: 1154, riskScore: 88, tpr: 6.2, riskLevel: 'CRITICAL', density: 461.2, villages: 1534, censusCode: 386 },
    { id: 'BAL', name: 'Balasore', cases2024: 1089, cases2025: 290, cases2026est: 380, riskScore: 74, tpr: 5.1, riskLevel: 'HIGH', density: 654.2, villages: 2932, censusCode: 377 },
    { id: 'CUT', name: 'Cuttack', cases2024: 692, cases2025: 185, cases2026est: 420, riskScore: 68, tpr: 4.8, riskLevel: 'HIGH', density: 520.5, villages: 1952, censusCode: 381 },
    { id: 'MAY', name: 'Mayurbhanj', cases2024: 582, cases2025: 155, cases2026est: 210, riskScore: 62, tpr: 4.2, riskLevel: 'MODERATE', density: 321.7, villages: 3950, censusCode: 376 },
    { id: 'SUN', name: 'Sundargarh', cases2024: 489, cases2025: 130, cases2026est: 190, riskScore: 58, tpr: 3.9, riskLevel: 'MODERATE', density: 192.8, villages: 1762, censusCode: 374 },
    { id: 'JAJ', name: 'Jajapur', cases2024: 412, cases2025: 110, cases2026est: 155, riskScore: 54, tpr: 3.6, riskLevel: 'MODERATE', density: 598.9, villages: 1783, censusCode: 382 },
    { id: 'GAN', name: 'Ganjam', cases2024: 412, cases2025: 110, cases2026est: 140, riskScore: 54, tpr: 3.5, riskLevel: 'MODERATE', density: 481.2, villages: 3195, censusCode: 388 },
    { id: 'PUR', name: 'Puri', cases2024: 356, cases2025: 95, cases2026est: 120, riskScore: 50, tpr: 3.2, riskLevel: 'MODERATE', density: 542.5, villages: 1707, censusCode: 387 },
  ],

  forecast2027: {
    model: 'SARIMA-XGBoost Hybrid',
    estimatedCasesLow: 10000,
    estimatedCasesMid: 12500,
    estimatedCasesHigh: 15000,
    peakMonths: ['July', 'August', 'September', 'October'],
    confidenceInterval: '95%',
    monthlyProjections: [
      { month: 'Jan', cases: 180, lower: 120, upper: 240 },
      { month: 'Feb', cases: 210, lower: 140, upper: 280 },
      { month: 'Mar', cases: 380, lower: 260, upper: 500 },
      { month: 'Apr', cases: 720, lower: 520, upper: 920 },
      { month: 'May', cases: 1100, lower: 820, upper: 1380 },
      { month: 'Jun', cases: 1650, lower: 1280, upper: 2020 },
      { month: 'Jul', cases: 2800, lower: 2200, upper: 3400 },
      { month: 'Aug', cases: 2950, lower: 2300, upper: 3600 },
      { month: 'Sep', cases: 2400, lower: 1850, upper: 2950 },
      { month: 'Oct', cases: 1200, lower: 900, upper: 1500 },
      { month: 'Nov', cases: 520, lower: 370, upper: 670 },
      { month: 'Dec', cases: 200, lower: 130, upper: 270 },
    ],
  },

  shapFeatures: [
    { feature: 'Temperature Lag (1-5 mo)', importance: 0.410, direction: 'positive' },
    { feature: 'Rainfall Lag (0-2 mo)', importance: 0.390, direction: 'positive' },
    { feature: 'Humidity Lag (1-4 mo)', importance: 0.200, direction: 'positive' },
    { feature: 'NDWI (Water Index)', importance: 0.185, direction: 'positive' },
    { feature: 'Historical Case Momentum', importance: 0.142, direction: 'positive' },
    { feature: 'Population Density', importance: 0.128, direction: 'positive' },
    { feature: 'Thatched Housing Ratio', importance: 0.115, direction: 'positive' },
    { feature: 'Occupational Commute', importance: 0.098, direction: 'positive' },
  ],

  villagesSample: [
    { rank: 1, name: 'Tora', district: 'Bargarh', population: 18399, households: 3958, areaHa: 1805, nearestTown: 'Bargarh', distKm: 7.0 },
    { rank: 2, name: 'Sartha', district: 'Baleshwar', population: 14844, households: 3237, areaHa: 1153, nearestTown: 'Baleshwar', distKm: 24.0 },
    { rank: 3, name: 'Tomka Forest Block', district: 'Jajapur', population: 13696, households: 2849, areaHa: 21912, nearestTown: 'Jajapur', distKm: 32.0 },
    { rank: 4, name: 'Bideipur', district: 'Bhadrak', population: 13428, households: 2556, areaHa: 4255, nearestTown: 'Basudebpur', distKm: 14.0 },
    { rank: 5, name: 'Gujidarada', district: 'Bhadrak', population: 11746, households: 2332, areaHa: 182, nearestTown: 'Bhadrak', distKm: 15.0 },
    { rank: 6, name: 'Parikhi', district: 'Baleshwar', population: 11489, households: 2582, areaHa: 2045, nearestTown: 'Baleshwar', distKm: 25.0 },
    { rank: 7, name: 'Tala Basta', district: 'Cuttack', population: 11361, households: 2695, areaHa: 3656, nearestTown: 'Banki', distKm: 12.0 },
    { rank: 8, name: 'Tohara', district: 'Nabarangapur', population: 10900, households: 2367, areaHa: 364, nearestTown: 'Umarkote', distKm: 25.0 },
    { rank: 9, name: 'Attabira', district: 'Bargarh', population: 10833, households: 2485, areaHa: 1027, nearestTown: 'Bargarh', distKm: 18.0 },
    { rank: 10, name: 'Jayapatna', district: 'Kalahandi', population: 10707, households: 2513, areaHa: 1033, nearestTown: 'Junagarh', distKm: 55.0 },
  ],
};

// ─── API ENDPOINTS ────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'MosqAware Backend API Server',
    version: 'v3.2',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Dashboard stats & summary
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    status: 'success',
    data: DATA.summary,
  });
});

// Districts endpoint
app.get('/api/districts', (req, res) => {
  const { sort, search } = req.query;
  let results = [...DATA.districts];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(d => d.name.toLowerCase().includes(q) || String(d.censusCode).includes(q));
  }

  if (sort === 'density') {
    results.sort((a, b) => b.density - a.density);
  } else if (sort === 'cases') {
    results.sort((a, b) => b.cases2025 - a.cases2025);
  } else if (sort === 'risk') {
    results.sort((a, b) => b.riskScore - a.riskScore);
  }

  res.json({
    status: 'success',
    count: results.length,
    data: results,
  });
});

// Single District by ID/Code
app.get('/api/districts/:id', (req, res) => {
  const dist = DATA.districts.find(d => d.id === req.params.id.toUpperCase() || d.name.toLowerCase() === req.params.id.toLowerCase());
  if (!dist) {
    return res.status(404).json({ status: 'error', message: 'District not found' });
  }
  res.json({ status: 'success', data: dist });
});

// 2027 Forecast API
app.get('/api/predict/2027', (req, res) => {
  res.json({
    status: 'success',
    forecast: DATA.forecast2027,
  });
});

// SHAP Feature Importance API
app.get('/api/predict/shap', (req, res) => {
  res.json({
    status: 'success',
    features: DATA.shapFeatures,
  });
});

// Village Directory Search API
app.get('/api/villages', (req, res) => {
  const { search, district, page = 1, limit = 10 } = req.query;
  let results = [...DATA.villagesSample];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(v => v.name.toLowerCase().includes(q) || v.district.toLowerCase().includes(q));
  }

  if (district) {
    results = results.filter(v => v.district.toLowerCase() === district.toLowerCase());
  }

  const p = parseInt(page);
  const l = parseInt(limit);
  const paginated = results.slice((p - 1) * l, p * l);

  res.json({
    status: 'success',
    totalRecords: 51313,
    sampleCount: results.length,
    page: p,
    limit: l,
    data: paginated,
  });
});

// AI Assistant Chatbot API Endpoint
app.post('/api/assistant/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ status: 'error', message: 'Message field is required' });
  }

  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("golden") || text.includes("rule") || text.includes("stay safe") || text.includes("prevention") || text.includes("protect") || text.includes("standing water")) {
    reply = `🛡️ **Golden Rules to Stay Safe**: 1. Remove standing water weekly (empty buckets, coolers, tyres). 2. Protect from bites (full sleeves, DEET/Picaridin repellent, nets). 3. Mosquito-proof home (screens, clean surroundings). 4. Aedes bite during daytime (6-9 AM & 3-6 PM). 5. Maintain community cleanliness.`;
  } else if (text.includes("2027") || text.includes("forecast") || text.includes("future")) {
    reply = `🔮 **2027 Outbreak Forecast**: 10,000–15,000 cases projected (SARIMA-XGBoost hybrid model) with peak outbreak in July–October 2027.`;
  } else if (text.includes("district") || text.includes("khordha") || text.includes("bhubaneswar")) {
    reply = `🔴 **Khordha (Bhubaneswar)** is at CRITICAL risk (30–35% state case share). Key micro-hotspots: Patia, Sikharchandi, Prasanti Vihar, Salia Sahi.`;
  } else if (text.includes("village") || text.includes("51k") || text.includes("block")) {
    reply = `🏡 Odisha has 51,313 villages across 311 CD blocks and 464 Tahasils. Largest village: Tora (Bargarh district, pop: 18,399).`;
  } else if (text.includes("model") || text.includes("accuracy") || text.includes("sarima")) {
    reply = `🤖 **AI Model Benchmark**: Bayesian SARIMA-XGBoost achieves 87.4% accuracy; Hybrid LSTM + Attention achieves 94.2% accuracy (F1 = 0.927).`;
  } else {
    reply = `🦟 **DENGUEl-AI Assistant**: Received "${message}". State 2026 status: 3,300+ provisional cases. Call 104 for emergency medical assistance.`;
  }

  res.json({
    status: 'success',
    query: message,
    reply,
    timestamp: new Date().toISOString(),
  });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 MosqAware Backend Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
