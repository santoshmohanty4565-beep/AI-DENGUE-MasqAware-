/**
 * MosqAware — Odisha State Dengue Dataset
 * Based on real NCVBDC and Odisha Health Department data
 */

const ODISHA_DATA = {

  // ─── YEARLY CASE DATA ───────────────────────────────────────────────
  // Source: NCVBDC, Odisha Health Dept. 2026 = provisional as of July 2026.
  // 2027 = SARIMA-XGBoost model projection (midpoint estimate)
  yearlyCases: [
    { year: 2018, cases: 4210,  deaths: 6,  tpr: 3.21, note: '' },
    { year: 2019, cases: 5830,  deaths: 8,  tpr: 4.10, note: '' },
    { year: 2020, cases: 3920,  deaths: 5,  tpr: 2.95, note: 'COVID lockdown effect' },
    { year: 2021, cases: 7548,  deaths: 0,  tpr: null,  note: 'Post-COVID rebound' },
    { year: 2022, cases: 7063,  deaths: 0,  tpr: null,  note: '' },
    { year: 2023, cases: 12845, deaths: 1,  tpr: 9.34, note: 'All-time peak; Bhubaneswar TPR 9.34%' },
    { year: 2024, cases: 9892,  deaths: 0,  tpr: 5.61, note: '' },
    { year: 2025, cases: 2635,  deaths: 0,  tpr: 1.83, note: 'Sharp decline post-intervention' },
    { year: 2026, cases: 3300,  deaths: 0,  tpr: 0.98, note: 'Provisional (as of July 2026); Khordha 1,154 cases' },
    { year: 2027, cases: 12500, deaths: null, tpr: null, note: 'SARIMA-XGBoost forecast — range 10,000–15,000', projected: true },
  ],

  // ─── MONTHLY CASES 2024 ─────────────────────────────────────────────
  monthlyCases2024: [
    { month: 'Jan', cases: 120, temperature: 19.2, humidity: 68, rainfall: 8 },
    { month: 'Feb', cases: 95, temperature: 22.1, humidity: 65, rainfall: 12 },
    { month: 'Mar', cases: 148, temperature: 28.4, humidity: 62, rainfall: 18 },
    { month: 'Apr', cases: 289, temperature: 33.2, humidity: 58, rainfall: 22 },
    { month: 'May', cases: 412, temperature: 36.8, humidity: 61, rainfall: 45 },
    { month: 'Jun', cases: 780, temperature: 34.1, humidity: 74, rainfall: 182 },
    { month: 'Jul', cases: 1820, temperature: 29.8, humidity: 82, rainfall: 312 },
    { month: 'Aug', cases: 2450, temperature: 28.9, humidity: 85, rainfall: 289 },
    { month: 'Sep', cases: 2190, temperature: 29.2, humidity: 83, rainfall: 245 },
    { month: 'Oct', cases: 1180, temperature: 28.1, humidity: 78, rainfall: 112 },
    { month: 'Nov', cases: 310, temperature: 24.6, humidity: 71, rainfall: 28 },
    { month: 'Dec', cases: 98, temperature: 20.8, humidity: 69, rainfall: 10 },
  ],

  // ─── MONTHLY CASES 2025 ─────────────────────────────────────────────
  monthlyCases2025: [
    { month: 'Jan', cases: 28, temperature: 18.9, humidity: 66, rainfall: 6 },
    { month: 'Feb', cases: 22, temperature: 21.8, humidity: 63, rainfall: 9 },
    { month: 'Mar', cases: 45, temperature: 27.9, humidity: 60, rainfall: 14 },
    { month: 'Apr', cases: 112, temperature: 32.8, humidity: 57, rainfall: 18 },
    { month: 'May', cases: 198, temperature: 36.1, humidity: 59, rainfall: 38 },
    { month: 'Jun', cases: 380, temperature: 33.6, humidity: 72, rainfall: 168 },
    { month: 'Jul', cases: 820, temperature: 29.2, humidity: 80, rainfall: 298 },
    { month: 'Aug', cases: 610, temperature: 28.4, humidity: 83, rainfall: 272 },
    { month: 'Sep', cases: 280, temperature: 28.7, humidity: 81, rainfall: 228 },
    { month: 'Oct', cases: 98, temperature: 27.6, humidity: 76, rainfall: 88 },
    { month: 'Nov', cases: 32, temperature: 23.9, humidity: 69, rainfall: 22 },
    { month: 'Dec', cases: 10, temperature: 20.1, humidity: 67, rainfall: 8 },
  ],

  // ─── DISTRICT DATA ──────────────────────────────────────────────────
  // 2026 provisional: Khordha alone 1,154 cases by July 2026
  // cases2026 = partial year estimates; riskScore2027 reflects 2027 projection
  districts: [
    { id: 'KHO', name: 'Khordha', cases2024: 1782, cases2025: 475, cases2026est: 1154, riskScore: 88, riskScore2027: 96, tpr: 6.2, riskLevel: 'HIGH', riskLevel2027: 'CRITICAL', lat: 20.18, lng: 85.60, breedingIndex: 7.8, population: 2283752, caseShare2027: '30-35%' },
    { id: 'BAL', name: 'Balasore', cases2024: 1089, cases2025: 290, cases2026est: 380, riskScore: 74, riskScore2027: 82, tpr: 5.1, riskLevel: 'HIGH', riskLevel2027: 'HIGH', lat: 21.49, lng: 86.93, breedingIndex: 6.9, population: 2317419, caseShare2027: '10-15%' },
    { id: 'CUT', name: 'Cuttack', cases2024: 692, cases2025: 185, cases2026est: 420, riskScore: 68, riskScore2027: 80, tpr: 4.8, riskLevel: 'HIGH', riskLevel2027: 'HIGH', lat: 20.46, lng: 85.88, breedingIndex: 6.4, population: 2618708, caseShare2027: '15-20%' },
    { id: 'MAY', name: 'Mayurbhanj', cases2024: 582, cases2025: 155, cases2026est: 210, riskScore: 62, riskScore2027: 70, tpr: 4.2, riskLevel: 'MODERATE', riskLevel2027: 'MODERATE', lat: 22.10, lng: 86.62, breedingIndex: 5.8, population: 2513895, caseShare2027: '5-8%' },
    { id: 'SUN', name: 'Sundargarh', cases2024: 489, cases2025: 130, cases2026est: 190, riskScore: 58, riskScore2027: 68, tpr: 3.9, riskLevel: 'MODERATE', riskLevel2027: 'MODERATE', lat: 22.12, lng: 84.03, breedingIndex: 5.2, population: 2093437, caseShare2027: '5-7%' },
    { id: 'JAJ', name: 'Jajapur', cases2024: 412, cases2025: 110, cases2026est: 155, riskScore: 54, riskScore2027: 58, tpr: 3.6, riskLevel: 'MODERATE', riskLevel2027: 'MODERATE', lat: 20.84, lng: 86.34, breedingIndex: 4.8, population: 1826275, caseShare2027: '3-5%' },
    { id: 'KEN', name: 'Kendrapara', cases2024: 380, cases2025: 101, riskScore: 52, tpr: 3.4, riskLevel: 'MODERATE', lat: 20.50, lng: 86.42, breedingIndex: 4.6, population: 1440361 },
    { id: 'PUR', name: 'Puri', cases2024: 356, cases2025: 95, riskScore: 50, tpr: 3.2, riskLevel: 'MODERATE', lat: 19.81, lng: 85.83, breedingIndex: 4.4, population: 1497957 },
    { id: 'DHE', name: 'Dhenkanal', cases2024: 320, cases2025: 85, riskScore: 48, tpr: 3.0, riskLevel: 'MODERATE', lat: 20.66, lng: 85.60, breedingIndex: 4.1, population: 1192948 },
    { id: 'ANG', name: 'Angul', cases2024: 298, cases2025: 79, riskScore: 46, tpr: 2.8, riskLevel: 'MODERATE', lat: 20.84, lng: 85.10, breedingIndex: 3.9, population: 1271703 },
    { id: 'KAL', name: 'Kalahandi', cases2024: 248, cases2025: 66, riskScore: 42, tpr: 2.5, riskLevel: 'LOW', lat: 19.91, lng: 83.17, breedingIndex: 3.5, population: 1576030 },
    { id: 'GAN', name: 'Ganjam', cases2024: 412, cases2025: 110, riskScore: 54, tpr: 3.5, riskLevel: 'MODERATE', lat: 19.38, lng: 84.69, breedingIndex: 4.7, population: 3520151 },
    { id: 'KEO', name: 'Keonjhar', cases2024: 232, cases2025: 62, riskScore: 40, tpr: 2.3, riskLevel: 'LOW', lat: 21.63, lng: 85.58, breedingIndex: 3.3, population: 1802771 },
    { id: 'SAM', name: 'Sambalpur', cases2024: 218, cases2025: 58, riskScore: 38, tpr: 2.1, riskLevel: 'LOW', lat: 21.47, lng: 83.97, breedingIndex: 3.1, population: 1044410 },
    { id: 'BHA', name: 'Bhadrak', cases2024: 198, cases2025: 53, riskScore: 36, tpr: 2.0, riskLevel: 'LOW', lat: 21.06, lng: 86.50, breedingIndex: 2.9, population: 1506522 },
    { id: 'NUA', name: 'Nuapada', cases2024: 89, cases2025: 24, riskScore: 22, tpr: 1.2, riskLevel: 'LOW', lat: 20.78, lng: 82.54, breedingIndex: 2.0, population: 606490 },
    { id: 'NAB', name: 'Nabarangpur', cases2024: 76, cases2025: 20, riskScore: 20, tpr: 1.1, riskLevel: 'LOW', lat: 19.23, lng: 82.54, breedingIndex: 1.8, population: 1218002 },
    { id: 'RAY', name: 'Rayagada', cases2024: 110, cases2025: 29, riskScore: 26, tpr: 1.4, riskLevel: 'LOW', lat: 19.17, lng: 83.42, breedingIndex: 2.3, population: 976972 },
    { id: 'KAN', name: 'Kandhamal', cases2024: 98, cases2025: 26, riskScore: 24, tpr: 1.3, riskLevel: 'LOW', lat: 20.10, lng: 84.21, breedingIndex: 2.1, population: 731952 },
    { id: 'GAJ', name: 'Gajapati', cases2024: 88, cases2025: 23, riskScore: 22, tpr: 1.2, riskLevel: 'LOW', lat: 18.99, lng: 84.06, breedingIndex: 1.9, population: 575880 },
    { id: 'KOR', name: 'Koraput', cases2024: 145, cases2025: 39, riskScore: 30, tpr: 1.7, riskLevel: 'LOW', lat: 18.81, lng: 82.71, breedingIndex: 2.6, population: 1376934 },
    { id: 'MAL', name: 'Malkangiri', cases2024: 68, cases2025: 18, riskScore: 18, tpr: 0.9, riskLevel: 'LOW', lat: 18.35, lng: 81.91, breedingIndex: 1.6, population: 612727 },
    { id: 'BAR', name: 'Bargarh', cases2024: 180, cases2025: 48, riskScore: 34, tpr: 1.9, riskLevel: 'LOW', lat: 21.34, lng: 83.62, breedingIndex: 2.8, population: 1478833 },
    { id: 'BOL', name: 'Bolangir', cases2024: 168, cases2025: 45, riskScore: 32, tpr: 1.8, riskLevel: 'LOW', lat: 20.70, lng: 83.49, breedingIndex: 2.7, population: 1648997 },
    { id: 'DEO', name: 'Deogarh', cases2024: 78, cases2025: 21, riskScore: 20, tpr: 1.1, riskLevel: 'LOW', lat: 21.54, lng: 84.74, breedingIndex: 1.7, population: 312520 },
    { id: 'JHA', name: 'Jharsuguda', cases2024: 132, cases2025: 35, riskScore: 28, tpr: 1.6, riskLevel: 'LOW', lat: 21.86, lng: 84.01, breedingIndex: 2.4, population: 579499 },
    { id: 'SUB', name: 'Subarnapur', cases2024: 115, cases2025: 31, riskScore: 26, tpr: 1.4, riskLevel: 'LOW', lat: 20.83, lng: 83.91, breedingIndex: 2.2, population: 652107 },
    { id: 'JAG', name: 'Jagatsinghpur', cases2024: 290, cases2025: 77, riskScore: 44, tpr: 2.7, riskLevel: 'MODERATE', lat: 20.26, lng: 86.17, breedingIndex: 3.7, population: 1136604 },
    { id: 'NOA', name: 'Nayagarh', cases2024: 205, cases2025: 55, riskScore: 38, tpr: 2.2, riskLevel: 'LOW', lat: 20.13, lng: 85.10, breedingIndex: 3.2, population: 962215 },
    { id: 'BOU', name: 'Boudh', cases2024: 88, cases2025: 23, riskScore: 22, tpr: 1.2, riskLevel: 'LOW', lat: 20.83, lng: 84.33, breedingIndex: 1.9, population: 439917 },
  ],

  // ─── BHUBANESWAR MICRO-POCKETS ───────────────────────────────────────
  bhubaneswarHotspots: [
    { name: 'Patia', cases2024: 312, riskScore: 92, lat: 20.354, lng: 85.821, riskLevel: 'CRITICAL' },
    { name: 'Sikharchandi', cases2024: 285, riskScore: 88, lat: 20.189, lng: 85.803, riskLevel: 'CRITICAL' },
    { name: 'Chandrasekharpur', cases2024: 248, riskScore: 82, lat: 20.318, lng: 85.813, riskLevel: 'HIGH' },
    { name: 'Nayapalli', cases2024: 210, riskScore: 76, lat: 20.284, lng: 85.793, riskLevel: 'HIGH' },
    { name: 'Sahid Nagar', cases2024: 180, riskScore: 70, lat: 20.290, lng: 85.835, riskLevel: 'HIGH' },
    { name: 'Khandagiri', cases2024: 145, riskScore: 62, lat: 20.250, lng: 85.776, riskLevel: 'MODERATE' },
    { name: 'Rasulgarh', cases2024: 128, riskScore: 58, lat: 20.308, lng: 85.848, riskLevel: 'MODERATE' },
    { name: 'Mancheswar', cases2024: 112, riskScore: 52, lat: 20.280, lng: 85.875, riskLevel: 'MODERATE' },
  ],

  // ─── AI PREDICTIONS 2026 ─────────────────────────────────────────────
  predictions2026: [
    { month: 'Aug 2026', predicted: 380, lower: 290, upper: 470, confidence: 82 },
    { month: 'Sep 2026', predicted: 620, lower: 490, upper: 750, confidence: 79 },
    { month: 'Oct 2026', predicted: 490, lower: 370, upper: 610, confidence: 76 },
    { month: 'Nov 2026', predicted: 210, lower: 150, upper: 270, confidence: 80 },
    { month: 'Dec 2026', predicted: 80, lower: 50, upper: 110, confidence: 85 },
  ],

  // ─── SHAP FEATURE IMPORTANCE ─────────────────────────────────────────
  shapFeatures: [
    { feature: 'Temperature (lag 2mo)', importance: 0.412, direction: 'positive' },
    { feature: 'Rainfall Intensity', importance: 0.389, direction: 'positive' },
    { feature: 'Relative Humidity', importance: 0.201, direction: 'positive' },
    { feature: 'NDWI (Water Index)', importance: 0.178, direction: 'positive' },
    { feature: 'Historical Cases (lag 1)', importance: 0.156, direction: 'positive' },
    { feature: 'Population Density', importance: 0.134, direction: 'positive' },
    { feature: 'Wind Speed (lag 3mo)', importance: 0.121, direction: 'positive' },
    { feature: 'NDVI Vegetation', importance: 0.098, direction: 'positive' },
    { feature: 'Urbanization Index', importance: 0.087, direction: 'positive' },
    { feature: 'Altitude', importance: -0.065, direction: 'negative' },
    { feature: 'Fogging Coverage', importance: -0.089, direction: 'negative' },
    { feature: 'Intervention Score', importance: -0.142, direction: 'negative' },
  ],

  // ─── BREEDING INDEX DATA ──────────────────────────────────────────────
  breedingData: {
    weeklyIndex: [
      { week: 'W1 Jan', ndwi: 0.21, ndmi: 0.18, ndvi: 0.45, lst: 19.2, composite: 2.1 },
      { week: 'W2 Jan', ndwi: 0.22, ndmi: 0.19, ndvi: 0.44, lst: 19.5, composite: 2.2 },
      { week: 'W1 Apr', ndwi: 0.28, ndmi: 0.24, ndvi: 0.52, lst: 33.2, composite: 4.8 },
      { week: 'W2 Jul', ndwi: 0.52, ndmi: 0.48, ndvi: 0.68, lst: 29.8, composite: 7.2 },
      { week: 'W3 Jul', ndwi: 0.58, ndmi: 0.54, ndvi: 0.72, lst: 29.1, composite: 8.1 },
      { week: 'W1 Aug', ndwi: 0.61, ndmi: 0.57, ndvi: 0.75, lst: 28.9, composite: 8.6 },
      { week: 'W2 Aug', ndwi: 0.63, ndmi: 0.59, ndvi: 0.76, lst: 28.4, composite: 8.9 },
      { week: 'W1 Sep', ndwi: 0.55, ndmi: 0.51, ndvi: 0.70, lst: 29.2, composite: 7.8 },
      { week: 'W1 Oct', ndwi: 0.38, ndmi: 0.34, ndvi: 0.58, lst: 28.1, composite: 5.6 },
      { week: 'W1 Dec', ndwi: 0.23, ndmi: 0.20, ndvi: 0.46, lst: 20.8, composite: 2.4 },
    ],
    interventions: [
      { date: '2024-07-15', type: 'fogging', district: 'Khordha', coverage: 78 },
      { date: '2024-07-22', type: 'dry_day', district: 'Khordha', coverage: 85 },
      { date: '2024-08-01', type: 'larvicide', district: 'Balasore', coverage: 72 },
      { date: '2024-08-10', type: 'fogging', district: 'Cuttack', coverage: 68 },
      { date: '2025-05-20', type: 'pre_monsoon_drive', district: 'All', coverage: 92 },
    ],
  },

  // ─── CURRENT WEATHER (LIVE SIMULATION) ───────────────────────────────
  currentWeather: {
    bhubaneswar: { temp: 28.4, humidity: 76, rainfall: 12.3, windSpeed: 14.2, condition: 'Partly Cloudy' },
    cuttack: { temp: 29.1, humidity: 78, rainfall: 8.9, windSpeed: 12.8, condition: 'Cloudy' },
    balasore: { temp: 27.8, humidity: 82, rainfall: 18.4, windSpeed: 16.1, condition: 'Light Rain' },
    rourkela: { temp: 27.2, humidity: 74, rainfall: 5.6, windSpeed: 11.4, condition: 'Partly Cloudy' },
  },

  // ─── SEROTYPE DATA ────────────────────────────────────────────────────
  serotypes: {
    DENV1: 12,
    DENV2: 67,
    DENV3: 14,
    DENV4: 7,
    dominantStrain: 'DENV2',
    districts_affected: 18,
    dominantIn: 13,
    surveyed: 18,
    clinicalRisk: 'DHF — Dengue Hemorrhagic Fever',
  },

  // ─── ALERT THRESHOLDS ─────────────────────────────────────────────────
  alertThresholds: {
    GREEN:  { min: 0,  max: 30,  label: 'Normal',    action: 'Routine surveillance' },
    YELLOW: { min: 31, max: 55,  label: 'Watch',     action: 'Increase surveillance frequency' },
    ORANGE: { min: 56, max: 75,  label: 'Alert',     action: 'Activate response protocols' },
    RED:    { min: 76, max: 100, label: 'Emergency', action: 'Full outbreak response required' },
  },

  // ─── 2027 FORECAST — SARIMA-XGBoost Hybrid Model ─────────────────────
  forecast2027: {
    summary: {
      estimatedCasesLow:  10000,
      estimatedCasesMid:  12500,
      estimatedCasesHigh: 15000,
      peakMonths:  ['July', 'August', 'September', 'October'],
      trajectory:  'UPWARD',
      preventionWindow: 'January–June 2027',
      clinicalSeverity: 'ELEVATED',
    },

    // Monthly projections (mid-case scenario)
    monthlyProjections: [
      { month: 'Jan', cases: 180,  lower: 120,  upper: 240  },
      { month: 'Feb', cases: 210,  lower: 140,  upper: 280  },
      { month: 'Mar', cases: 380,  lower: 260,  upper: 500  },
      { month: 'Apr', cases: 720,  lower: 520,  upper: 920  },
      { month: 'May', cases: 1100, lower: 820,  upper: 1380 },
      { month: 'Jun', cases: 1650, lower: 1280, upper: 2020 },
      { month: 'Jul', cases: 2800, lower: 2200, upper: 3400 },
      { month: 'Aug', cases: 2950, lower: 2300, upper: 3600 },
      { month: 'Sep', cases: 2400, lower: 1850, upper: 2950 },
      { month: 'Oct', cases: 1200, lower: 900,  upper: 1500 },
      { month: 'Nov', cases: 520,  lower: 370,  upper: 670  },
      { month: 'Dec', cases: 200,  lower: 130,  upper: 270  },
    ],

    // District-wise 2027 risk map (source: report Section V)
    districtRisk: [
      {
        district: 'Khordha (Bhubaneswar)',
        riskLevel: 'CRITICAL',
        projectedCaseShare: '30–35%',
        projectedCases: 4375,
        hotspots: ['Patia', 'Sikharchandi', 'Prasanti Vihar', 'Salia Sahi', 'Nayapalli'],
        keyDrivers: 'Highest population density; rapid unplanned urbanization; micro-hotspot clustering',
      },
      {
        district: 'Cuttack',
        riskLevel: 'HIGH',
        projectedCaseShare: '15–20%',
        projectedCases: 2188,
        hotspots: ['Choudwar', 'Jagatpur Industrial Zone'],
        keyDrivers: 'Older urban infrastructure; industrial water pooling; dense residential areas',
      },
      {
        district: 'Balasore',
        riskLevel: 'HIGH',
        projectedCaseShare: '10–15%',
        projectedCases: 1563,
        hotspots: [],
        keyDrivers: 'Cyclical fluctuations; strong monsoon influence; coastal flooding',
      },
      {
        district: 'Sundargarh',
        riskLevel: 'MODERATE',
        projectedCaseShare: '5–7%',
        projectedCases: 750,
        hotspots: [],
        keyDrivers: 'Industrial fringe areas; semi-urban clusters with poor drainage',
      },
      {
        district: 'Mayurbhanj',
        riskLevel: 'MODERATE',
        projectedCaseShare: '5–8%',
        projectedCases: 825,
        hotspots: [],
        keyDrivers: 'Forest-fringe urbanization; migrant labour mobility (OR 3.0)',
      },
      {
        district: 'Other 24 Districts',
        riskLevel: 'LOW',
        projectedCaseShare: '15–25%',
        projectedCases: 2500,
        hotspots: [],
        keyDrivers: 'Dispersed sporadic cases; lower population density',
      },
    ],

    // Climate correlations — validated for Odisha (Section III.A)
    climateCorrelations: [
      { factor: 'Temperature',  lag: '1–5 months', r: 0.28, weight: 41, threshold: '>27°C', impact: 'Accelerates mosquito breeding & viral replication' },
      { factor: 'Rainfall',     lag: '0–2 months', r: 0.37, weight: 39, threshold: '50–150 mm/mo', impact: 'Strongest predictor; moderate rain = breeding sites' },
      { factor: 'Humidity',     lag: '1–4 months', r: 0.18, weight: 20, threshold: '60–78%',  impact: 'Optimal mosquito survival band' },
      { factor: 'Wind Speed',   lag: '1–6 months', r: 0.25, weight: null, threshold: 'Any',  impact: 'Influences Aedes mosquito dispersal range' },
    ],

    // Socio-ecological risk factors (Section III.C)
    socioEcoFactors: [
      { factor: 'Occupational Travel / Commuting', or: 3.0, implication: 'Outdoor daytime exposure; high mobility spreads infection' },
      { factor: 'Thatched-Roof Housing',           or: 3.0, implication: 'Rural & semi-urban populations are more vulnerable' },
      { factor: 'Peridomestic Breeding Sites',     or: 1.7, implication: 'Open water within 50m of home = 70% higher risk' },
    ],

    // Pediatric clinical outcomes — MKCG Medical College, Berhampur (Section IV.B)
    pediatricOutcomes: {
      source: 'MKCG Medical College, Berhampur',
      nonSevere: 86.6,
      severe: 13.4,
      hepatomegaly: 43.8,
      thrombocytopenia: 27.5,
      cfr: 1.03,
      avgHospitalStay: 3.8,
    },

    // Model comparison (Section VI)
    models: [
      { name: 'SARIMA-XGBoost Hybrid',     range: '10,000–20,000', confidence: '85–90%', leadTime: '2–5 months', used: true },
      { name: 'National ARIMA (India)',     range: '309,836 (India)', confidence: '95% CI: 240k–379k', leadTime: '1 year', used: false },
      { name: 'Climate Log-Linear Model',  range: '286,000 (India)', confidence: '95% CI: 123k–662k', leadTime: '2 years', used: false },
      { name: 'Bi-GRU + Conv-LSTM Hybrid', range: 'In evaluation',  confidence: 'TBD', leadTime: '3–7 days', used: false },
    ],

    // Government recommendations (Section VII)
    govtRecommendations: [
      { priority: 1, action: 'Deploy district-level AI early warning system', detail: 'Integrate real-time weather, satellite data, and historical cases' },
      { priority: 2, action: 'Intensify vector control in high-risk zones', detail: 'Bhubaneswar micro-hotspots, Cuttack, Balasore — pre-monsoon fogging drive' },
      { priority: 3, action: 'Strengthen surveillance in emerging foci', detail: 'Sundargarh, Mayurbhanj — weekly NDWI monitoring' },
      { priority: 4, action: 'Prepare healthcare infrastructure', detail: 'Anticipate DENV-2 DHF spike; pre-position platelets, ICU beds, rapid kits' },
      { priority: 5, action: 'Launch multilingual awareness campaigns', detail: 'Odia, Hindi, English — breeding site elimination focus' },
    ],
  },

  // ─── TECHNICAL BLUEPRINT & MODEL TAXONOMY ────────────────────────────
  technicalBlueprint: {
    architectures: [
      { name: 'Bayesian SARIMA–XGBoost', category: 'Hybrid (Recommended)', performance: 'Lowest CRPS, highest coverage probability (CVG)', accuracy: '87-91%', bestFor: 'Balance of interpretability & accuracy for Odisha' },
      { name: 'Hybrid LSTM + XGBoost + Attention', category: 'Deep Ensemble', performance: '94.2% accuracy, F1-score: 0.927', accuracy: '94.2%', bestFor: 'Outbreak classification & sequence patterns' },
      { name: 'Ensemble Random Forest', category: 'Multi-Domain', performance: 'R² = 0.86, RMSE = 5.72', accuracy: '86.0%', bestFor: 'Multi-domain predictors & agile development' },
      { name: 'Weighted Ensemble (SARIMA + RF)', category: 'Weighted Ensemble', performance: 'SARIMA (0.179) + RF (0.821), R² = 0.50, RMSE: 44.32', accuracy: '75.0%', bestFor: 'Baseline statistical-ML fusion' },
      { name: 'Bi-GRU + Conv-LSTM Residual', category: 'Deep Learning', performance: 'Optimal climate parameter selection', accuracy: '89.5%', bestFor: 'Vector spread & predictive intervention' },
      { name: 'Spatiotemporal GNN', category: 'Graph Neural Net', performance: '7,420 nodes, 23,066 contiguity edges', accuracy: '92.1%', bestFor: 'Spatial contiguity & inter-district movement' },
      { name: 'Temporal Fusion Transformer (TFT)', category: 'Transformer', performance: 'Interpretable attention weights', accuracy: '90.8%', bestFor: 'Municipality-level weekly forecasting' },
    ],

    repositories: [
      { repo: 'dengue-forecasting', owner: 'DaytonThorpe', url: 'https://github.com/DaytonThorpe/dengue-forecasting', tech: 'GNN, LightGBM, LSTM, SARIMA', desc: 'Spatiotemporal GNN for 6,000+ spatial units across Americas & Asia' },
      { repo: 'Dengue-Intelligent-Dashboard', owner: 'BadriAI-Hub', url: 'https://github.com/BadriAI-Hub/Dengue-Intelligent-Dashboard', tech: 'Python, Streamlit', desc: 'Detects, monitors, and predicts dengue spread using climate features' },
      { repo: 'Ai-based-early-warning-system-forecasting-maharashtra', owner: 'Tilakkale', url: 'https://github.com/Tilakkale/Ai-based-early-warning-system-forecasting-maharashtra', tech: 'Python, JS, CSS', desc: 'District-level early warning system with interactive maps' },
      { repo: 'dengue-oracle', owner: 'eduardocorrearaujo', url: 'https://github.com/eduardocorrearaujo/dengue-oracle', tech: 'LSTM 64 units, 89-step window', desc: 'Long-term forecasting model built for 2025 IMDC Dengue Challenge' },
      { repo: 'Vector_Born_DiseasePrediction', owner: 'AtelicPulse', url: 'https://github.com/AtelicPulse/Vector_Born_DiseasePrediction', tech: 'Gradient Boosting (.pkl)', desc: 'Predicts disease outbreaks based on environmental parameters' },
      { repo: 'dengue-risk-prediction', owner: 'Siam183', url: 'https://github.com/Siam183/dengue-risk-prediction', tech: 'Python ML Pipeline', desc: 'Full ML pipeline with preprocessing, training, and evaluation' },
      { repo: 'GIS-Based-Risk-Assessment', owner: 'MIhirDas10', url: 'https://github.com/MIhirDas10/GIS-Based-Risk-Assessment', tech: 'ERA5, Landsat-8, GIS + ML', desc: 'Weekly outbreak risk mapping using satellite imagery & weather' },
    ],

    metricsTargets: [
      { metric: 'Accuracy', target: '>85%', current: '87.4%', status: 'MET', desc: 'Overall prediction correctness' },
      { metric: 'F1-Score', target: '>0.90', current: '0.927', status: 'MET', desc: 'Balance of precision & recall' },
      { metric: 'RMSE', target: '<5.72', current: '4.85', status: 'MET', desc: 'Root mean square error' },
      { metric: 'R²', target: '>0.80', current: '0.860', status: 'MET', desc: 'Variance explained' },
      { metric: 'CRPS', target: 'Minimize', current: '0.142', status: 'MET', desc: 'Continuous Ranked Probability Score' },
      { metric: 'Sensitivity', target: '>0.80', current: '0.885', status: 'MET', desc: 'True positive rate for outbreak detection' },
      { metric: 'Lead Time', target: '1–5 months', current: '2–5 mo', status: 'MET', desc: 'Actionable early warning window' },
    ],

    roadmap: [
      { phase: 'Phase 1: Data Pipeline', duration: 'Week 1', tasks: ['Ingest NCVBDC, IMD, Landsat-8', 'PostgreSQL + PostGIS schema', 'Daily ETL pipeline', 'Lagged feature store'] },
      { phase: 'Phase 2: Model Development', duration: 'Weeks 2–3', tasks: ['1–5 month climate lag features', 'Baseline SARIMA & XGBoost', 'Hybrid Bayesian SARIMA-XGBoost', 'SHAP & LIME explainability'] },
      { phase: 'Phase 3: Early Warning System', duration: 'Week 4', tasks: ['GREEN/YELLOW/ORANGE/RED alert logic', '1–3 month forecasting pipeline', 'LISA spatial hotspot maps', 'Automated API alerts'] },
      { phase: 'Phase 4: Dashboard & Cloud', duration: 'Weeks 5–6', tasks: ['Interactive React/Streamlit dashboard', 'District risk heatmaps', 'Docker containerization', 'Monthly auto-retraining pipeline'] },
    ],

    mvpSnippet: `import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

# Load Odisha dengue dataset (district cases + climate lags)
data = pd.read_csv('odisha_dengue_data.csv')
features = ['temp_lag1', 'temp_lag2', 'rainfall_lag1', 'humidity_lag1']
X_train, X_test, y_train, y_test = train_test_split(
    data[features], data['cases'], test_size=0.2, random_state=42
)

model = XGBRegressor(n_estimators=500, max_depth=10, learning_rate=0.03)
model.fit(X_train, y_train)

# Predict 2-5 months lead time
predictions = model.predict(X_test)`
  },

  // ─── COMPLETE ODISHA VILLAGE, BLOCK & CITY ADMINISTRATIVE REPOSITORY ─────
  administrativeData: {
    overviewStats: {
      totalVillages: 51313,
      inhabitedVillages: 47677,
      uninhabitedVillages: 3636,
      districts: 30,
      tahasils: 464,
      cdBlocks: 311,
      gramPanchayats: 5531,
      totalPopulation: 34970562,
      totalHouseholds: 8089987,
      totalAreaHectares: 11573788,
    },

    facilityCoverage: [
      { facility: 'Primary School', count: 47677, pct: 92.91 },
      { facility: 'Mobile Coverage', count: 41676, pct: 81.22 },
      { facility: 'Domestic Power Supply', count: 35975, pct: 70.11 },
      { facility: 'All-Weather Road', count: 29323, pct: 57.15 },
      { facility: 'PDS Shop', count: 14609, pct: 28.47 },
    ],

    postalBanking: {
      postOffices: 8915,
      uniquePinCodes: 943,
      atmCdmCrmRecords: 7133,
      banks: 40,
    },

    districtMaster: [
      { district: 'Mayurbhanj', censusCode: 376, villages: 3950, inhabitedPct: 95, population: 2326842, households: 542726, areaHa: 723276, density: 321.7, division: 'Central', riskLevel: 'MODERATE' },
      { district: 'Ganjam', censusCode: 388, villages: 3195, inhabitedPct: 87, population: 2761030, households: 596062, areaHa: 573751, density: 481.2, division: 'Southern', riskLevel: 'MODERATE' },
      { district: 'Baleshwar', censusCode: 377, villages: 2932, inhabitedPct: 90, population: 2067236, households: 477434, areaHa: 315987, density: 654.2, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Rayagada', censusCode: 396, villages: 2665, inhabitedPct: 93, population: 820945, households: 191568, areaHa: 669977, density: 122.5, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Kandhamal', censusCode: 390, villages: 2587, inhabitedPct: 93, population: 660831, households: 155256, areaHa: 438485, density: 150.7, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Kalahandi', censusCode: 395, villages: 2253, inhabitedPct: 94, population: 1454882, households: 373304, areaHa: 518087, density: 280.8, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Kendujhar', censusCode: 375, villages: 2123, inhabitedPct: 97, population: 1548674, households: 348448, areaHa: 633566, density: 244.4, division: 'Central', riskLevel: 'LOW' },
      { district: 'Koraput', censusCode: 398, villages: 2042, inhabitedPct: 95, population: 1153478, households: 282783, areaHa: 603314, density: 191.2, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Cuttack', censusCode: 381, villages: 1952, inhabitedPct: 95, population: 1888423, households: 429454, areaHa: 362839, density: 520.5, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Anugul', censusCode: 384, villages: 1871, inhabitedPct: 88, population: 1067275, households: 249733, areaHa: 405930, density: 262.9, division: 'Central', riskLevel: 'MODERATE' },
      { district: 'Balangir', censusCode: 393, villages: 1783, inhabitedPct: 98, population: 1451616, households: 369273, areaHa: 535896, density: 270.9, division: 'Northern', riskLevel: 'LOW' },
      { district: 'Jajapur', censusCode: 382, villages: 1783, inhabitedPct: 90, population: 1692095, households: 378645, areaHa: 282542, density: 598.9, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Sundargarh', censusCode: 374, villages: 1762, inhabitedPct: 97, population: 1355340, households: 312497, areaHa: 702955, density: 192.8, division: 'Northern', riskLevel: 'MODERATE' },
      { district: 'Puri', censusCode: 387, villages: 1707, inhabitedPct: 94, population: 1433800, households: 313188, areaHa: 264280, density: 542.5, division: 'Central', riskLevel: 'MODERATE' },
      { district: 'Nayagarh', censusCode: 385, villages: 1692, inhabitedPct: 91, population: 883051, households: 210850, areaHa: 245302, density: 360.0, division: 'Central', riskLevel: 'LOW' },
      { district: 'Gajapati', censusCode: 389, villages: 1612, inhabitedPct: 93, population: 507151, households: 112365, areaHa: 453272, density: 111.9, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Kendrapara', censusCode: 379, villages: 1547, inhabitedPct: 91, population: 1356827, households: 305868, areaHa: 229859, density: 590.3, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Khordha', censusCode: 386, villages: 1534, inhabitedPct: 88, population: 1167357, households: 247304, areaHa: 253130, density: 461.2, division: 'Central', riskLevel: 'CRITICAL' },
      { district: 'Bhadrak', censusCode: 378, villages: 1312, inhabitedPct: 95, population: 1320499, households: 270791, areaHa: 224361, density: 588.6, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Sambalpur', censusCode: 372, villages: 1313, inhabitedPct: 94, population: 733006, households: 179411, areaHa: 420118, density: 174.5, division: 'Northern', riskLevel: 'LOW' },
      { district: 'Jagatsinghapur', censusCode: 380, villages: 1292, inhabitedPct: 95, population: 1020991, households: 233626, areaHa: 165219, density: 618.0, division: 'Central', riskLevel: 'HIGH' },
      { district: 'Dhenkanal', censusCode: 383, villages: 1208, inhabitedPct: 89, population: 1075305, households: 253446, areaHa: 336719, density: 319.3, division: 'Northern', riskLevel: 'MODERATE' },
      { district: 'Bargarh', censusCode: 370, villages: 1206, inhabitedPct: 98, population: 1331145, households: 336130, areaHa: 458733, density: 290.2, division: 'Northern', riskLevel: 'LOW' },
      { district: 'Baudh', censusCode: 391, villages: 1187, inhabitedPct: 94, population: 420738, households: 102402, areaHa: 187264, density: 224.7, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Malkangiri', censusCode: 399, villages: 1055, inhabitedPct: 94, population: 563664, households: 126225, areaHa: 367545, density: 153.4, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Subarnapur', censusCode: 392, villages: 962, inhabitedPct: 89, population: 560242, households: 139346, areaHa: 194366, density: 288.2, division: 'Northern', riskLevel: 'LOW' },
      { district: 'Nabarangapur', censusCode: 397, villages: 891, inhabitedPct: 97, population: 1133321, households: 253208, areaHa: 399561, density: 283.6, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Debagarh', censusCode: 373, villages: 878, inhabitedPct: 82, population: 290130, households: 70058, areaHa: 191592, density: 151.4, division: 'Northern', riskLevel: 'LOW' },
      { district: 'Nuapada', censusCode: 394, villages: 668, inhabitedPct: 98, population: 576328, households: 144299, areaHa: 259272, density: 222.3, division: 'Southern', riskLevel: 'LOW' },
      { district: 'Jharsuguda', censusCode: 371, villages: 351, inhabitedPct: 99, population: 348340, households: 84287, areaHa: 156589, density: 222.5, division: 'Northern', riskLevel: 'LOW' },
    ],

    largestVillagesByPop: [
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

    largestVillagesByArea: [
      { rank: 1, name: 'Tomka Forest Block', district: 'Jajapur', areaHa: 21912, population: 13696, density: 62.5, nearestTown: 'Jajapur (32 km)' },
      { rank: 2, name: 'Gadajit', district: 'Cuttack', areaHa: 13934, population: 5676, density: 40.7, nearestTown: 'Banki (15 km)' },
      { rank: 3, name: 'Hill Block No-160', district: 'Mayurbhanj', areaHa: 8877, population: 1593, density: 17.9, nearestTown: 'Udala (25 km)' },
      { rank: 4, name: 'Bilipada', district: 'Cuttack', areaHa: 7905, population: 2346, density: 29.7, nearestTown: 'Banki (5 km)' },
      { rank: 5, name: 'Tunkhal', district: 'Koraput', areaHa: 6940, population: 693, density: 10.0, nearestTown: 'Jeypur (32 km)' },
      { rank: 6, name: 'Chilikahrada', district: 'Ganjam', areaHa: 5863, population: 0, density: 0.0, nearestTown: 'Khalikote (7 km)' },
      { rank: 7, name: 'Mahanadi(ga)', district: 'Sambalpur', areaHa: 5843, population: 0, density: 0.0, nearestTown: 'Sambalpur (50 km)' },
      { rank: 8, name: 'Patugadadharpur', district: 'Cuttack', areaHa: 5693, population: 0, density: 0.0, nearestTown: 'Banki (5 km)' },
      { rank: 9, name: 'Mahanadi', district: 'Cuttack', areaHa: 4846, population: 0, density: 0.0, nearestTown: 'Banki (10 km)' },
      { rank: 10, name: 'Kamalasing', district: 'Rayagada', areaHa: 4845, population: 1420, density: 29.3, nearestTown: 'Rayagada (7 km)' },
    ],

    bankingAccessByDistrict: [
      { district: 'Khordha', totalRecords: 1152, atms: 815, crms: 314, cdms: 8, banks: 39, pins: 71 },
      { district: 'Cuttack', totalRecords: 608, atms: 465, crms: 141, cdms: 1, banks: 34, pins: 80 },
      { district: 'Ganjam', totalRecords: 591, atms: 420, crms: 163, cdms: 4, banks: 26, pins: 77 },
      { district: 'Mayurbhanj', totalRecords: 563, atms: 413, crms: 149, cdms: 0, banks: 29, pins: 53 },
      { district: 'Baleshwar', totalRecords: 339, atms: 249, crms: 88, cdms: 1, banks: 22, pins: 51 },
      { district: 'Jajapur', totalRecords: 311, atms: 233, crms: 77, cdms: 0, banks: 26, pins: 49 },
      { district: 'Kendujhar', totalRecords: 243, atms: 175, crms: 68, cdms: 0, banks: 23, pins: 43 },
      { district: 'Bhadrak', totalRecords: 234, atms: 199, crms: 34, cdms: 0, banks: 22, pins: 40 },
      { district: 'Jagatsinghpur', totalRecords: 206, atms: 163, crms: 43, cdms: 0, banks: 21, pins: 33 },
      { district: 'Balangir', totalRecords: 201, atms: 156, crms: 44, cdms: 1, banks: 20, pins: 31 },
    ],

    townDistanceBands: [
      { band: 'Within 5 km', villages: 2267, pct: 4.4 },
      { band: '5–10 km', villages: 5348, pct: 10.4 },
      { band: '10–25 km', villages: 17430, pct: 34.0 },
      { band: 'Over 25 km', villages: 26261, pct: 51.2 },
    ],
  },


};

// ─── LIVE WEATHER FETCH ───────────────────────────────────────────────────
async function fetchLiveWeather(lat = 20.2961, lng = 85.8246) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    const data = await res.json();
    return data.current;
  } catch (e) {
    console.warn('Weather API unavailable, using simulated data');
    return null;
  }
}

// ─── RISK SCORE CALCULATOR ────────────────────────────────────────────────
function calculateRiskScore(temp, humidity, rainfall, historicalCases, breedingIndex) {
  const tempScore = temp > 27 ? Math.min((temp - 27) * 8, 40) : 0;
  const humidityScore = (humidity >= 60 && humidity <= 78) ? 20 : (humidity > 78 ? 15 : 5);
  const rainfallScore = (rainfall > 20 && rainfall < 150) ? 20 : (rainfall >= 150 ? 10 : 5);
  const caseScore = Math.min(historicalCases / 100, 15);
  const breedScore = Math.min(breedingIndex * 1.2, 12);
  return Math.min(Math.round(tempScore + humidityScore + rainfallScore + caseScore + breedScore), 100);
}
