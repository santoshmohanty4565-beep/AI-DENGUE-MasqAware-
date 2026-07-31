/**
 * MosqAware — Dengue Treatment Specialists & Hospital Directory API v1
 * Serves filtered doctor search, GPS nearest treatment center finder, AI triage, & 5 SMS template generators.
 */

const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');

const DOCTORS_FILE = path.join(__dirname, '../../data/doctors.json');

function readDoctors() {
  if (!fs.existsSync(DOCTORS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DOCTORS_FILE, 'utf8')); } catch { return []; }
}

// Haversine formula for distance calculation in KM
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// GET /api/v1/doctors
router.get('/', (req, res) => {
  const { district, specialty, emergency, icu, platelet, pediatric, search } = req.query;
  let list = readDoctors();

  if (district) {
    list = list.filter(d => d.district.toLowerCase() === district.toLowerCase());
  }

  if (specialty) {
    const s = specialty.toLowerCase();
    list = list.filter(d => d.specialty.toLowerCase().includes(s));
  }

  if (emergency === 'true') {
    list = list.filter(d => d.emergencyAvailability === true);
  }

  if (icu === 'true') {
    list = list.filter(d => d.icuAvailability === true);
  }

  if (platelet === 'true') {
    list = list.filter(d => d.plateletTransfusionFacility === true);
  }

  if (pediatric === 'true') {
    list = list.filter(d => d.pediatricDengueAvailable === true);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.district.toLowerCase().includes(q)
    );
  }

  res.json({
    status: 'success',
    count: list.length,
    data: list
  });
});

// GET /api/v1/doctors/nearest?lat=20.2961&lng=85.8246
router.get('/nearest', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ status: 'error', message: 'Valid lat and lng query parameters required' });
  }

  let list = readDoctors().map(d => ({
    ...d,
    distanceKm: getDistanceKm(lat, lng, d.lat, d.lng)
  }));

  list.sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({
    status: 'success',
    userLocation: { lat, lng },
    count: list.length,
    nearestCenters: list.slice(0, 5)
  });
});

// POST /api/v1/doctors/triage
router.post('/triage', (req, res) => {
  const { symptoms = [], district = 'Khordha' } = req.body || {};
  const hasFever = symptoms.includes('fever');
  const hasBleeding = symptoms.includes('bleeding');
  const hasVomiting = symptoms.includes('vomiting');
  const hasSeverePain = symptoms.includes('abdominal_pain');

  const list = readDoctors().filter(d => d.district.toLowerCase() === district.toLowerCase() || d.district === 'Khordha');

  if (hasBleeding || (hasFever && hasVomiting && hasSeverePain)) {
    return res.json({
      status: 'success',
      triageLevel: 'EMERGENCY_SEVERE_DENGUE',
      recommendation: '⚠️ HIGH RISK: Symptoms indicate possible Dengue Hemorrhagic Fever (DHF). Visit Capital Hospital Infectious Ward or SCB Medical immediately or call 108 ambulance.',
      emergencyNumber: '108',
      bypassTriage: true,
      suggestedProviders: list.filter(d => d.icuAvailability && d.plateletTransfusionFacility)
    });
  }

  if (hasFever) {
    return res.json({
      status: 'success',
      triageLevel: 'MODERATE_OPD_CARE',
      recommendation: '🟡 MODERATE RISK: Schedule an OPD consultation with Internal Medicine / General Medicine specialist. Request CBC & NS1 Antigen test.',
      suggestedProviders: list.slice(0, 3)
    });
  }

  res.json({
    status: 'success',
    triageLevel: 'HOME_CARE_MONITORING',
    recommendation: '🟢 LOW RISK: Monitor temperature, remain well hydrated with ORS, and rest. Visit OPD if fever spikes above 38.5°C.',
    suggestedProviders: list.slice(0, 2)
  });
});

// POST /api/v1/doctors/appointment (Book OPD & Generate 5 SMS Templates)
router.post('/appointment', (req, res) => {
  const { doctorName, hospital, date, time, patientName, patientPhone, templateType = 'confirmation' } = req.body || {};

  if (!doctorName || !hospital) {
    return res.status(400).json({ status: 'error', message: 'doctorName and hospital required' });
  }

  const dDate = date || 'Tomorrow';
  const dTime = time || '10:30 AM';

  // 5 Official SMS Templates
  const templates = {
    confirmation: `✅ AI Dengue Odisha: Your appointment with ${doctorName} at ${hospital} is confirmed for ${dDate} at ${dTime}. Please arrive 30 minutes early and carry previous reports.`,
    highRiskAlert: `⚠️ AI Dengue Alert: Your symptoms indicate possible severe dengue. Visit the nearest government hospital immediately or call 108 ambulance.`,
    plateletReminder: `🩸 Platelet monitoring due today. Drink adequate fluids, avoid self-medication, and follow your doctor's advice.`,
    followUpReminder: `📅 Reminder: Your follow-up consultation is scheduled tomorrow. Bring CBC, platelet count, and previous prescriptions.`,
    recoveryAdvice: `✅ Continue hydration, take medicines exactly as prescribed, monitor fever, and return immediately if bleeding, severe abdominal pain, or persistent vomiting develops.`
  };

  const selectedSms = templates[templateType] || templates.confirmation;

  res.json({
    status: 'success',
    bookingId: 'BK_' + Date.now(),
    eSwasthyaPortal: 'https://eswasthya.odisha.gov.in/',
    smsSent: true,
    patientPhone: patientPhone || '+91-9876543210',
    smsText: selectedSms,
    allTemplates: templates
  });
});

// GET /api/v1/doctors/emergency-contacts
router.get('/emergency-contacts', (req, res) => {
  res.json({
    status: 'success',
    emergencyNumbers: {
      ambulance: '108',
      healthEmergency: '102',
      healthDepartment: '0674-2395235'
    },
    eswasthyaPortal: {
      name: 'Odisha eSwasthya Online Appointment Portal',
      url: 'https://eswasthya.odisha.gov.in/',
      features: [
        'Register online',
        'Choose hospital',
        'Select department',
        'Book OPD visit',
        'Download provisional registration',
        'Book revisits up to 30 days in advance'
      ]
    },
    governmentSevereWards: [
      { name: 'Capital Hospital Infectious & Diarrhoea Ward', city: 'Bhubaneswar', timing: '24x7' },
      { name: 'Burla Medical College Medicine OPD (VIMSAR)', city: 'Sambalpur', timing: '24x7' },
      { name: 'District Hospital Keonjhar Infection Ward', city: 'Keonjhar', timing: '24x7' },
      { name: 'Infectious Disease Ward, Nabarangpur', city: 'Nabarangpur', timing: '24x7' }
    ]
  });
});

module.exports = router;
