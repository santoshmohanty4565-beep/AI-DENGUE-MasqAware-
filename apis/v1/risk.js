/**
 * MosqAware — Risk & Analytics API Routes (v1)
 * Risk scoring, hotspot detection, and analytics endpoints
 */

const express = require('express');
const router = express.Router();

// ─── RISK ENDPOINTS ─────────────────────────────────────────────────────────

// GET /api/v1/risk/districts — Risk levels for all districts
router.get('/districts', (req, res) => {
  const districtRisks = [
    { code: 'KHO', name: 'Khordha', risk_level: 'CRITICAL', risk_score: 88, tpr: 6.2, cases_2026: 1154 },
    { code: 'BAL', name: 'Baleshwar', risk_level: 'HIGH', risk_score: 74, tpr: 5.1, cases_2026: 380 },
    { code: 'CUT', name: 'Cuttack', risk_level: 'HIGH', risk_score: 68, tpr: 4.8, cases_2026: 420 },
    { code: 'MAY', name: 'Mayurbhanj', risk_level: 'MODERATE', risk_score: 62, tpr: 4.2, cases_2026: 210 },
    { code: 'SUN', name: 'Sundargarh', risk_level: 'MODERATE', risk_score: 58, tpr: 3.9, cases_2026: 190 },
    { code: 'JAJ', name: 'Jajapur', risk_level: 'MODERATE', risk_score: 54, tpr: 3.6, cases_2026: 155 },
    { code: 'GAN', name: 'Ganjam', risk_level: 'MODERATE', risk_score: 54, tpr: 3.5, cases_2026: 140 },
    { code: 'PUR', name: 'Puri', risk_level: 'MODERATE', risk_score: 50, tpr: 3.2, cases_2026: 120 },
  ];

  res.json({ status: 'success', count: districtRisks.length, data: districtRisks });
});

// GET /api/v1/risk/blocks/:district_code — Block risk levels
router.get('/blocks/:district_code', (req, res) => {
  const dc = req.params.district_code.toUpperCase();
  if (dc === 'KHO') {
    return res.json({
      status: 'success',
      district: 'Khordha',
      data: [
        { code: 'KHO-SAR', name: 'Khordha Sadar', risk_level: 'CRITICAL', risk_score: 92, cases: 180 },
        { code: 'KHO-JTP', name: 'Jatni', risk_level: 'HIGH', risk_score: 74, cases: 62 },
        { code: 'KHO-BAL', name: 'Balianta', risk_level: 'HIGH', risk_score: 70, cases: 52 },
        { code: 'KHO-BLP', name: 'Balipatna', risk_level: 'HIGH', risk_score: 68, cases: 45 },
        { code: 'KHO-TNG', name: 'Tangi', risk_level: 'MODERATE', risk_score: 48, cases: 15 },
      ],
    });
  }
  res.json({ status: 'success', district: dc, data: [] });
});

// GET /api/v1/risk/hotspots — Current active hotspots
router.get('/hotspots', (req, res) => {
  res.json({
    status: 'success',
    hotspots: [
      { name: 'Patia', block: 'Khordha Sadar', district: 'Khordha', cases: 31, risk: 'CRITICAL', lat: 20.3543, lng: 85.8195 },
      { name: 'Chandrasekharpur', block: 'Khordha Sadar', district: 'Khordha', cases: 24, risk: 'CRITICAL', lat: 20.3290, lng: 85.8120 },
      { name: 'Sikharchandi', block: 'Khordha Sadar', district: 'Khordha', cases: 18, risk: 'HIGH', lat: 20.3380, lng: 85.8270 },
      { name: 'Prasanti Vihar', block: 'Khordha Sadar', district: 'Khordha', cases: 16, risk: 'HIGH', lat: 20.3450, lng: 85.8090 },
      { name: 'Nayapalli', block: 'Khordha Sadar', district: 'Khordha', cases: 14, risk: 'HIGH', lat: 20.2930, lng: 85.8040 },
    ],
    lastUpdated: new Date().toISOString(),
  });
});

module.exports = router;
