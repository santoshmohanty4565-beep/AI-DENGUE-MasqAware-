/**
 * MosqAware — Dengue Outbreak Predictor API v1 (Present & Future Engine)
 * Processes present live weather/vector telemetry vs future decadal climate scenarios.
 */

const express = require('express');
const router = express.Router();

// POST /api/v1/outbreak-predictor/calculate
router.post('/calculate', (req, res) => {
  const {
    mode = 'present',
    district = 'Khordha',
    year = 2026,
    month = 'August',
    temp = 29.5,
    humidity = 78,
    rainfall = 120,
    ndwi = 0.65,
    foggingCoverage = 20
  } = req.body || {};

  const T = parseFloat(temp);
  const H = parseFloat(humidity);
  const R = parseFloat(rainfall);
  const W = parseFloat(ndwi);
  const F = parseFloat(foggingCoverage) / 100.0;

  // Temperature-dependent biting rate
  const bitingRate = (T > 13.2 && T < 39.6) ? (0.00014 * T * (T - 13.2) * Math.sqrt(39.6 - T)) : 0.25;
  const eip = Math.max(4.0, Math.exp(4.7 - 0.09 * T));
  const vectorLifespan = (H / 100.0) * 28.0;
  const breedingIndex = Math.pow(W, 1.2) * (R > 50 ? 2.5 : 1.2);

  // Basic Reproduction Number (R0)
  let r0 = (bitingRate * bitingRate * vectorLifespan * breedingIndex) / (eip * 0.4);
  r0 = parseFloat(Math.max(0.2, r0 * (1.0 - F * 0.75)).toFixed(2));

  // Risk Score (0-100%)
  const tempScore = T > 27 ? Math.min((T - 27) * 8, 35) : 0;
  const humScore = (H >= 60 && H <= 85) ? 25 : 10;
  const rainScore = Math.min((R / 200) * 25, 25);
  const ndwiScore = Math.min(W * 15, 15);
  
  let riskScore = Math.min(100, Math.round(tempScore + humScore + rainScore + ndwiScore));
  
  if (mode === 'future') {
    const yrInt = parseInt(year);
    const cycle = Math.sin((yrInt - 2023) * (2 * Math.PI / 4.0));
    if (cycle > 0.5) riskScore = Math.min(100, Math.round(riskScore * 1.25));
  }

  let riskCategory = 'NORMAL';
  let alertBadge = 'safe';
  let hospitalSurge = 'Standard Bed Capacity';
  let actionPlan = 'Routine municipal vector monitoring & public awareness.';

  if (riskScore >= 75 || r0 >= 2.5) {
    riskCategory = 'CRITICAL OUTBREAK EMERGENCY';
    alertBadge = 'critical';
    hospitalSurge = 'CRITICAL SURGE: Activate +45% Isolation Beds & SCB Blood Reserves';
    actionPlan = 'Immediate 24h thermal fogging, drone larvicide spray in hotspots, and emergency medical transport standby.';
  } else if (riskScore >= 50 || r0 >= 1.5) {
    riskCategory = 'HIGH OUTBREAK SURVEILLANCE';
    alertBadge = 'warning';
    hospitalSurge = 'MODERATE SURGE: Prepare +20% Dedicated Fever Wards';
    actionPlan = 'Targeted larvicide application to standing water containers & community Dry-Day enforcement.';
  } else if (riskScore >= 30) {
    riskCategory = 'MODERATE WATCH';
    alertBadge = 'moderate';
  }

  res.json({
    status: 'success',
    mode,
    district,
    year,
    month,
    metrics: {
      riskScore,
      r0,
      eipDays: parseFloat(eip.toFixed(1)),
      bitingRate: parseFloat(bitingRate.toFixed(3)),
      riskCategory,
      alertBadge,
      hospitalSurge,
      actionPlan
    },
    telemetry: {
      temperature: T,
      humidity: H,
      rainfall: R,
      ndwi: W,
      foggingCoverage: parseFloat(foggingCoverage)
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
