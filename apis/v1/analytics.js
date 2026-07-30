/**
 * MosqAware — Analytics API Routes (v1)
 * Trend data, district/block/village analytics
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/analytics/district/:district_code
router.get('/district/:district_code', (req, res) => {
  const dc = req.params.district_code.toUpperCase();
  res.json({
    status: 'success',
    district: dc,
    analytics: {
      yearlyCases: [
        { year: 2018, cases: 890 }, { year: 2019, cases: 1240 },
        { year: 2020, cases: 680 }, { year: 2021, cases: 1580 },
        { year: 2022, cases: 1450 }, { year: 2023, cases: 3200 },
        { year: 2024, cases: 1782 }, { year: 2025, cases: 475 },
        { year: 2026, cases: 1154, provisional: true },
      ],
      monthlyCases2026: [
        { month: 'Jan', cases: 12 }, { month: 'Feb', cases: 18 },
        { month: 'Mar', cases: 35 }, { month: 'Apr', cases: 68 },
        { month: 'May', cases: 142 }, { month: 'Jun', cases: 285 },
        { month: 'Jul', cases: 594 },
      ],
      climateCorrelation: {
        temperature: { r: 0.28, lag_months: '1-5', weight: 0.41 },
        rainfall:    { r: 0.37, lag_months: '0-2', weight: 0.39 },
        humidity:    { r: 0.18, lag_months: '1-4', weight: 0.20 },
      },
      serotypeDist: { 'DENV-1': 14, 'DENV-2': 67, 'DENV-3': 12, 'DENV-4': 7 },
    },
  });
});

// GET /api/v1/analytics/trends/:level/:id
router.get('/trends/:level/:id', (req, res) => {
  const { level, id } = req.params;
  const { period = '2026' } = req.query;

  res.json({
    status: 'success',
    level,
    id,
    period,
    trendData: [
      { week: 1, cases: 3 }, { week: 5, cases: 8 }, { week: 9, cases: 15 },
      { week: 13, cases: 28 }, { week: 17, cases: 52 }, { week: 21, cases: 95 },
      { week: 25, cases: 180 }, { week: 29, cases: 320 },
    ],
  });
});

module.exports = router;
