/**
 * MosqAware — Map API Routes (v1)
 * Spatial data endpoints for interactive drill-down risk map
 * District → Block → Village GeoJSON serving
 */

const express = require('express');
const router = express.Router();

// In-memory GeoJSON data (replace with PostGIS queries in production)
const DISTRICT_GEOJSON = require('../../frontend/js/data.js') ? null : null;

// ─── MOCK BLOCK DATA (Khordha district sample) ─────────────────────────────
const KHORDHA_BLOCKS = [
  { block_code: 'KHO-SAR', name: 'Khordha Sadar', population: 350000, cases_2025: 180, tpr: 6.8, risk_level: 'CRITICAL', lat: 20.1826, lng: 85.8313 },
  { block_code: 'KHO-BLP', name: 'Balipatna', population: 80000, cases_2025: 45, tpr: 4.2, risk_level: 'HIGH', lat: 20.2310, lng: 85.9442 },
  { block_code: 'KHO-BOL', name: 'Bolagarh', population: 65000, cases_2025: 12, tpr: 2.1, risk_level: 'MODERATE', lat: 20.3211, lng: 85.6328 },
  { block_code: 'KHO-BAL', name: 'Balianta', population: 95000, cases_2025: 52, tpr: 4.8, risk_level: 'HIGH', lat: 20.3540, lng: 85.8690 },
  { block_code: 'KHO-NKP', name: 'Nirakarpur', population: 50000, cases_2025: 8, tpr: 1.2, risk_level: 'LOW', lat: 20.1342, lng: 85.6978 },
  { block_code: 'KHO-TNG', name: 'Tangi', population: 40000, cases_2025: 15, tpr: 2.5, risk_level: 'MODERATE', lat: 20.0980, lng: 85.7520 },
  { block_code: 'KHO-JTP', name: 'Jatni', population: 120000, cases_2025: 62, tpr: 5.1, risk_level: 'HIGH', lat: 20.1588, lng: 85.7120 },
  { block_code: 'KHO-BNP', name: 'Banapur', population: 55000, cases_2025: 6, tpr: 0.9, risk_level: 'LOW', lat: 19.7770, lng: 85.1690 },
  { block_code: 'KHO-CHT', name: 'Chilika', population: 45000, cases_2025: 4, tpr: 0.6, risk_level: 'LOW', lat: 19.7210, lng: 85.3210 },
  { block_code: 'KHO-BJP', name: 'Begunia', population: 42000, cases_2025: 3, tpr: 0.5, risk_level: 'LOW', lat: 20.2670, lng: 85.5120 },
];

// ─── MOCK VILLAGE DATA (Khordha Sadar block) ────────────────────────────────
const KHORDHA_SADAR_VILLAGES = [
  { village_code: 'V-PAT', name: 'Patia', population: 45000, cases_2025: 31, risk_level: 'CRITICAL', pin: '751024', lat: 20.3543, lng: 85.8195 },
  { village_code: 'V-SKC', name: 'Sikharchandi', population: 30000, cases_2025: 18, risk_level: 'HIGH', pin: '751024', lat: 20.3380, lng: 85.8270 },
  { village_code: 'V-CSP', name: 'Chandrasekharpur', population: 40000, cases_2025: 24, risk_level: 'CRITICAL', pin: '751016', lat: 20.3290, lng: 85.8120 },
  { village_code: 'V-NPL', name: 'Nayapalli', population: 35000, cases_2025: 14, risk_level: 'HIGH', pin: '751012', lat: 20.2930, lng: 85.8040 },
  { village_code: 'V-SAL', name: 'Salia Sahi', population: 25000, cases_2025: 9, risk_level: 'MODERATE', pin: '751024', lat: 20.3150, lng: 85.8350 },
  { village_code: 'V-PVR', name: 'Prasanti Vihar', population: 28000, cases_2025: 16, risk_level: 'HIGH', pin: '751024', lat: 20.3450, lng: 85.8090 },
  { village_code: 'V-NIL', name: 'Niladri Vihar', population: 22000, cases_2025: 11, risk_level: 'MODERATE', pin: '751021', lat: 20.3380, lng: 85.8480 },
  { village_code: 'V-DAM', name: 'Damana', population: 18000, cases_2025: 7, risk_level: 'MODERATE', pin: '751019', lat: 20.3620, lng: 85.8310 },
  { village_code: 'V-INF', name: 'Infocity Area', population: 15000, cases_2025: 5, risk_level: 'LOW', pin: '751024', lat: 20.3460, lng: 85.8560 },
  { village_code: 'V-SUR', name: 'Sundarpada', population: 20000, cases_2025: 8, risk_level: 'MODERATE', pin: '751002', lat: 20.2750, lng: 85.7890 },
];

// ─── ENDPOINTS ──────────────────────────────────────────────────────────────

// GET /api/v1/map/state — State boundary
router.get('/state', (req, res) => {
  res.json({
    status: 'success',
    level: 'state',
    name: 'Odisha',
    center: [20.2961, 83.8],
    zoom: 7,
    totalDistricts: 30,
    totalBlocks: 314,
    totalVillages: 51313,
  });
});

// GET /api/v1/map/districts — All district risk data
router.get('/districts', (req, res) => {
  // In production, query PostGIS for GeoJSON FeatureCollection
  res.json({
    status: 'success',
    level: 'district',
    count: 30,
    message: 'Use /api/districts for full district data with risk scores',
  });
});

// GET /api/v1/map/blocks/:district_code — Blocks within a district
router.get('/blocks/:district_code', (req, res) => {
  const dc = req.params.district_code.toUpperCase();

  if (dc === 'KHO') {
    const geojson = {
      type: 'FeatureCollection',
      features: KHORDHA_BLOCKS.map(b => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
        properties: {
          BLOCK_CODE: b.block_code,
          BLOCK_NAME: b.name,
          population: b.population,
          cases: b.cases_2025,
          tpr: b.tpr,
          risk_level: b.risk_level,
        },
      })),
    };
    return res.json({ status: 'success', level: 'block', district: 'Khordha', data: geojson });
  }

  res.json({
    status: 'success',
    level: 'block',
    district: dc,
    message: `Block-level GeoJSON for district ${dc} requires PostGIS connection.`,
    data: { type: 'FeatureCollection', features: [] },
  });
});

// GET /api/v1/map/villages/:block_code — Villages within a block
router.get('/villages/:block_code', (req, res) => {
  const bc = req.params.block_code.toUpperCase();

  if (bc === 'KHO-SAR') {
    const geojson = {
      type: 'FeatureCollection',
      features: KHORDHA_SADAR_VILLAGES.map(v => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
        properties: {
          VILLAGE_CODE: v.village_code,
          VILLAGE_NAME: v.name,
          population: v.population,
          cases: v.cases_2025,
          risk_level: v.risk_level,
          pin_code: v.pin,
        },
      })),
    };
    return res.json({ status: 'success', level: 'village', block: 'Khordha Sadar', data: geojson });
  }

  res.json({
    status: 'success',
    level: 'village',
    block: bc,
    message: `Village-level GeoJSON for block ${bc} requires PostGIS connection.`,
    data: { type: 'FeatureCollection', features: [] },
  });
});

module.exports = router;
