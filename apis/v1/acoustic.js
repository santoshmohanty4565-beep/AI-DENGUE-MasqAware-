/**
 * MosqAware — AI Bio-Acoustic Mosquito Vector API v1
 * Processes audio spectral peak data and provides vector reference wingbeat profiles.
 */

const express = require('express');
const router = express.Router();

// Reference Wingbeat Frequencies (Hz) for Dengue & Mosquito Vectors
const VECTOR_PROFILES = [
  {
    id: 'aedes_aegypti_female',
    name: 'Aedes aegypti (Female)',
    dengueRisk: 'CRITICAL',
    vectorRole: 'Primary Dengue / Zika / Chikungunya Vector',
    minFreqHz: 450,
    maxFreqHz: 610,
    peakFreqHz: 535,
    description: 'High-pitched rapid wingbeat signature. Active diurnal biter found in stagnant containers.',
    biteWarning: true,
  },
  {
    id: 'aedes_albopictus_female',
    name: 'Aedes albopictus (Female)',
    dengueRisk: 'HIGH',
    vectorRole: 'Secondary Dengue Vector (Asian Tiger Mosquito)',
    minFreqHz: 540,
    maxFreqHz: 720,
    peakFreqHz: 625,
    description: 'Aggressive outdoor daytime biter with distinctive white stripes.',
    biteWarning: true,
  },
  {
    id: 'culex_quinquefasciatus',
    name: 'Culex quinquefasciatus',
    dengueRisk: 'MODERATE',
    vectorRole: 'Lymphatic Filariasis & West Nile Vector',
    minFreqHz: 350,
    maxFreqHz: 490,
    peakFreqHz: 420,
    description: 'Nocturnal biter breeding in dirty organic polluted waters.',
    biteWarning: false,
  },
  {
    id: 'anopheles_stephensi',
    name: 'Anopheles stephensi',
    dengueRisk: 'LOW (Malaria Risk)',
    vectorRole: 'Urban Malaria Vector',
    minFreqHz: 280,
    maxFreqHz: 390,
    peakFreqHz: 330,
    description: 'Rests at 45-degree angle. Transmits Plasmodium falciparum.',
    biteWarning: false,
  }
];

// GET /api/v1/acoustic/profiles
router.get('/profiles', (req, res) => {
  res.json({
    status: 'success',
    count: VECTOR_PROFILES.length,
    profiles: VECTOR_PROFILES,
  });
});

// POST /api/v1/acoustic/classify
router.post('/classify', (req, res) => {
  const { peakFreqHz, harmonicRatio } = req.body || {};
  const freq = parseFloat(peakFreqHz);

  if (!freq || isNaN(freq)) {
    return res.status(400).json({ status: 'error', message: 'Valid peakFreqHz required' });
  }

  let matched = VECTOR_PROFILES.find(p => freq >= p.minFreqHz && freq <= p.maxFreqHz);

  if (!matched) {
    return res.json({
      status: 'success',
      freqHz: freq,
      classification: 'Ambient Environmental Noise / Non-Vector Insect',
      vectorRisk: 'SAFE',
      confidence: 0.88,
      recommendedAction: 'No immediate vector action needed. Keep monitoring.'
    });
  }

  const dist = Math.abs(freq - matched.peakFreqHz);
  const maxDiff = (matched.maxFreqHz - matched.minFreqHz) / 2;
  const confidence = Math.max(0.72, (1 - (dist / maxDiff) * 0.28)).toFixed(3);

  res.json({
    status: 'success',
    freqHz: freq,
    matchedProfile: matched,
    confidence: parseFloat(confidence),
    recommendedAction: matched.biteWarning
      ? 'CRITICAL ALERT: Apply larvicide to nearby standing water & use indoor repellent.'
      : 'MODERATE WARNING: Monitor standing water bodies.'
  });
});

module.exports = router;
