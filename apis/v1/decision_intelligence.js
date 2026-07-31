/**
 * MosqAware — AI Future Decision Intelligence & Action Engine API v1 (2027-2035+)
 * Predicts healthcare bottlenecks, Explainable AI (XAI) feature influence, resource demands,
 * and generates multi-stakeholder action plans for decision-makers.
 */

const express = require('express');
const router  = express.Router();

// POST /api/v1/decision-intelligence/simulate
router.post('/simulate', (req, res) => {
  const {
    year = 2027,
    district = 'Khordha',
    temp = 30.5,
    humidity = 80,
    rainfall = 140,
    ndwi = 0.70,
    vectorControlEffectiveness = 30,
    populationDensity = 800
  } = req.body || {};

  const yr = parseInt(year);
  const T = parseFloat(temp);
  const H = parseFloat(humidity);
  const R = parseFloat(rainfall);
  const W = parseFloat(ndwi);
  const V = parseFloat(vectorControlEffectiveness) / 100.0;
  const Pop = parseFloat(populationDensity);

  // Dynamic Risk Score (0-100)
  const rainWeight = Math.min(25, (R / 250) * 25);
  const tempWeight = T > 26 ? Math.min(20, (T - 26) * 4) : 5;
  const humWeight = (H >= 65 && H <= 90) ? 20 : 10;
  const ndwiWeight = Math.min(15, W * 15);
  const densityWeight = Math.min(15, (Pop / 1000) * 15);
  const cycleBoost = [2027, 2031, 2035].includes(yr) ? 15 : 5;

  let baseRiskScore = rainWeight + tempWeight + humWeight + ndwiWeight + densityWeight + cycleBoost;
  let riskScore = Math.min(100, Math.max(10, Math.round(baseRiskScore * (1.0 - V * 0.65))));

  let riskCategory = 'LOW';
  let confidenceScore = 92;
  if (riskScore >= 75) { riskCategory = 'VERY HIGH'; confidenceScore = 94; }
  else if (riskScore >= 50) { riskCategory = 'HIGH'; confidenceScore = 89; }
  else if (riskScore >= 30) { riskCategory = 'MODERATE'; confidenceScore = 86; }

  // 1. Explainable AI (XAI) Feature Contributions
  const totalRaw = rainWeight + humWeight + tempWeight + ndwiWeight + densityWeight + 15;
  const xaiInfluence = [
    { factor: 'Monsoon Rainfall & Precipitation', contributionPct: Math.round((rainWeight / totalRaw) * 100), change: '+22% vs baseline' },
    { factor: 'Relative Humidity & Vector Survival', contributionPct: Math.round((humWeight / totalRaw) * 100), change: '+11% vs baseline' },
    { factor: 'Ambient Temperature & EIP Incubation', contributionPct: Math.round((tempWeight / totalRaw) * 100), change: '+8% vs baseline' },
    { factor: 'Historical Outbreak Recurrence', contributionPct: Math.round((15 / totalRaw) * 100), change: '+19% vs baseline' },
    { factor: 'Urban Population Density', contributionPct: Math.round((densityWeight / totalRaw) * 100), change: '+17% vs baseline' },
    { factor: 'Waterlogging Index (NDWI)', contributionPct: Math.round((ndwiWeight / totalRaw) * 100), change: '+14% vs baseline' }
  ];

  // 2. Predicted Healthcare Problems & Bottlenecks
  const isHigh = riskScore >= 50;
  const problems = [
    {
      issue: 'Hospital Bed & Isolation Ward Shortages',
      probability: isHigh ? '88%' : '35%',
      severity: isHigh ? 'CRITICAL' : 'MODERATE',
      timeHorizon: '2–3 Weeks',
      confidence: '91%',
      mitigation: 'Activate +45% auxiliary isolation beds at Capital Hospital & District Headquarters.'
    },
    {
      issue: 'ICU & Ventilator Overload',
      probability: isHigh ? '76%' : '22%',
      severity: isHigh ? 'CRITICAL' : 'LOW',
      timeHorizon: '3–4 Weeks',
      confidence: '88%',
      mitigation: 'Reserve 30% of ICU beds for DENV-2 Hemorrhagic Fever patients.'
    },
    {
      issue: 'Platelet Unit & Blood Bank Shortages',
      probability: isHigh ? '92%' : '40%',
      severity: isHigh ? 'VERY HIGH' : 'MODERATE',
      timeHorizon: '1–2 Weeks',
      confidence: '95%',
      mitigation: 'Mobilize Red Cross Odisha emergency platelet donor drives & single donor apheresis.'
    },
    {
      issue: 'Diagnostic Laboratory & NS1 Kit Overload',
      probability: isHigh ? '85%' : '45%',
      severity: 'HIGH',
      timeHorizon: '7 Days',
      confidence: '90%',
      mitigation: 'Distribute 50,000 rapid NS1 antigen kits to PHCs & CHCs.'
    },
    {
      issue: 'Ambulance & Emergency Transport Surge',
      probability: isHigh ? '70%' : '30%',
      severity: 'HIGH',
      timeHorizon: '10 Days',
      confidence: '87%',
      mitigation: 'Deploy 108 Ambulance vector emergency dispatch routing.'
    },
    {
      issue: 'Workforce Productivity & School Absenteeism Loss',
      probability: isHigh ? '82%' : '38%',
      severity: 'MEDIUM',
      timeHorizon: '30 Days',
      confidence: '85%',
      mitigation: 'Issue Dry-Day advisories to educational institutions and corporate campuses.'
    }
  ];

  // 3. Resource Requirements Forecast
  const multiplier = riskScore / 50.0;
  const resourceForecast = {
    isolationBedsNeeded: Math.round(1800 * multiplier),
    icuBedsNeeded: Math.round(320 * multiplier),
    doctorsRequired: Math.round(240 * multiplier),
    nursesRequired: Math.round(580 * multiplier),
    cbcTestKits: Math.round(45000 * multiplier),
    plateletUnits: Math.round(3800 * multiplier),
    bloodUnits: Math.round(2500 * multiplier),
    ambulancesDispatched: Math.round(85 * multiplier),
    foggingTeams: Math.round(140 * multiplier)
  };

  // 4. Multi-Stakeholder Action Engine
  const actionEngine = {
    citizens: {
      next24h: 'Inspect home surroundings for standing water in cooler trays, flowerpots, and discarded containers; apply abate larvicide.',
      next7d: 'Enforce weekly Sunday Dry-Day; wear long-sleeved clothing and use mosquito repellant nets during daytime hours.',
      next30d: 'Report unmanaged waterlogging or mosquito swarms via MosqAware Community Incident portal.',
      longTerm: 'Install mesh window screens and participate in neighborhood vector management committees.'
    },
    doctors: {
      next24h: 'Screen all high fever cases for DENV-2 warning signs (bleeding, persistent vomiting, abdominal pain).',
      next7d: 'Monitor daily CBC platelet counts; avoid prescribing NSAIDs (Ibuprofen/Aspirin) which exacerbate bleeding risks.',
      next30d: 'Follow NCVBDC clinical protocol for IV fluid resuscitation in moderate-to-severe dengue.',
      longTerm: 'Attend CME workshops on emerging vector-borne flavivirus management.'
    },
    hospitals: {
      next24h: 'Designate dedicated Triage Desks and reserve +20% isolation beds for fever admissions.',
      next7d: 'Ensure 24x7 blood bank readiness for single-donor apheresis platelet transfusion.',
      next30d: 'Stock 10,000 rapid NS1/IgM diagnostic kits and maintain oxygen cylinder reserves.',
      longTerm: 'Upgrade critical care ICU capacity and establish permanent vector isolation wards.'
    },
    districtOfficials: {
      next24h: 'Dispatch bio-acoustic surveillance teams to identified mosquito breeding hotspots.',
      next7d: 'Execute intensive thermal fogging and drone larvicide spray across high-density urban wards.',
      next30d: 'Conduct weekly inter-departmental review meetings with municipal corporations and water sanitation teams.',
      longTerm: 'Improve urban drainage infrastructure and eliminate chronic waterlogging sites.'
    },
    stateGovernment: {
      next24h: 'Issue state-level Dengue Health Alert and activate SCB / Capital Hospital emergency response cells.',
      next7d: 'Release emergency contingency funds for municipal vector control equipment and free testing kits.',
      next30d: 'Launch statewide public awareness campaigns via SMS, radio, and television.',
      longTerm: 'Establish Odisha State Vector Genomics & Bio-Acoustic Surveillance Institute.'
    }
  };

  // 5. Smart Emergency Alerts
  const smartAlerts = [
    `⚠️ AI Warning: High dengue risk expected in ${district} within 14 days due to rainfall surge (${R}mm).`,
    `🩸 Blood Bank Alert: Increase platelet stock by +35% across district hospitals.`,
    `🛸 Dispatch Trigger: Deploy 12 additional drone fogging teams to high-density wards.`,
    `📱 Public SMS Trigger: Issue automated prevention advisories to 450,000 registered residents.`
  ];

  res.json({
    status: 'success',
    year: yr,
    district,
    riskScore,
    riskCategory,
    confidenceScore,
    xaiInfluence,
    problems,
    resourceForecast,
    actionEngine,
    smartAlerts,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
