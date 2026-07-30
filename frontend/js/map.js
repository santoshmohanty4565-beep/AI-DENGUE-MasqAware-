/**
 * MosqAware — Odisha Spatial Risk Map
 * Multi-layer choropleth & vector map for Districts, Cities, CD Blocks & Villages
 * Leaflet.js interactive visualization with live search & multi-level drill down
 */

let dengueMap = null;
let districtMarkers = [];
let cityMarkers = [];
let blockMarkers = [];
let villageMarkers = [];
let hotspotMarkers = [];

let activeMapLayer = 'all'; // 'all' | 'district' | 'city' | 'block' | 'village' | 'hotspot'
let selectedDistrictFilter = '';
let searchHighlightMarker = null;

// Risk color mapping
function getRiskColor(riskScore) {
  if (riskScore >= 76) return '#ff4444';
  if (riskScore >= 56) return '#ff9f43';
  if (riskScore >= 31) return '#ffd666';
  return '#00e5a0';
}

function getRiskGlowColor(riskScore) {
  if (riskScore >= 76) return 'rgba(255,68,68,0.4)';
  if (riskScore >= 56) return 'rgba(255,159,67,0.4)';
  if (riskScore >= 31) return 'rgba(255,214,102,0.4)';
  return 'rgba(0,229,160,0.4)';
}

function getRiskLabel(riskScore) {
  if (riskScore >= 76) return 'CRITICAL';
  if (riskScore >= 56) return 'HIGH';
  if (riskScore >= 31) return 'MODERATE';
  return 'LOW';
}

// Initialize Leaflet Map
function initMap(containerId = 'odisha-map') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (dengueMap) {
    dengueMap.remove();
    dengueMap = null;
  }

  dengueMap = L.map(containerId, {
    center: [20.45, 84.50],
    zoom: 7,
    zoomControl: false,
    attributionControl: false,
  });

  // OpenStreetMap dark/standard layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    className: 'map-tiles',
  }).addTo(dengueMap);

  L.control.zoom({ position: 'topleft' }).addTo(dengueMap);

  L.control.attribution({
    position: 'bottomleft',
    prefix: '<span style="color:#4a5580;font-size:10px">OSM | MosqAware State Surveillance</span>'
  }).addTo(dengueMap);

  // Render initial map layers
  renderMapLayers();

  // Populate District Jump dropdown if element exists
  populateDistrictDropdown();

  return dengueMap;
}

// Clear all markers from map
function clearMapMarkers() {
  districtMarkers.forEach(m => m.remove());
  cityMarkers.forEach(m => m.remove());
  blockMarkers.forEach(m => m.remove());
  villageMarkers.forEach(m => m.remove());
  hotspotMarkers.forEach(m => m.remove());

  districtMarkers = [];
  cityMarkers = [];
  blockMarkers = [];
  villageMarkers = [];
  hotspotMarkers = [];
}

// Master Layer Renderer
function renderMapLayers() {
  if (!dengueMap) return;
  clearMapMarkers();

  const showAll = activeMapLayer === 'all';

  if (showAll || activeMapLayer === 'district') {
    renderDistrictMarkers();
  }

  if (showAll || activeMapLayer === 'city') {
    renderCityMarkers();
  }

  if (showAll || activeMapLayer === 'block') {
    renderBlockMarkers();
  }

  if (showAll || activeMapLayer === 'village') {
    renderVillageMarkers();
  }

  if (showAll || activeMapLayer === 'hotspot') {
    renderHotspotMarkers();
  }

  updateMapStatsBar();
}

// ─── 1. DISTRICT MARKERS ──────────────────────────────────────────────────
function renderDistrictMarkers() {
  if (typeof ODISHA_DATA === 'undefined' || !ODISHA_DATA.districts) return;

  ODISHA_DATA.districts.forEach(district => {
    if (selectedDistrictFilter && district.name.toLowerCase() !== selectedDistrictFilter.toLowerCase()) {
      return;
    }

    const color = getRiskColor(district.riskScore);
    const glowColor = getRiskGlowColor(district.riskScore);
    const size = Math.max(30, Math.min(54, district.riskScore * 0.5 + 14));

    const iconHtml = `
      <div class="map-marker-badge district-pin" style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        font-size: ${Math.max(9, size * 0.28)}px;
        font-weight: 800;
        color: #050d1a;
        box-shadow: 0 0 ${size * 0.6}px ${glowColor}, 0 4px 14px rgba(0,0,0,0.6);
        cursor: pointer;
        transition: transform 0.2s ease;
        ${district.riskScore >= 76 ? 'animation: markerPulse 2s infinite;' : ''}
      ">
        <span>${district.cases2025 || district.cases2024}</span>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([district.lat, district.lng], { icon: customIcon }).addTo(dengueMap);
    marker.bindPopup(createDistrictPopup(district), { maxWidth: 320, className: 'denguel-popup' });
    districtMarkers.push(marker);
  });
}

function createDistrictPopup(district) {
  const riskLabel = getRiskLabel(district.riskScore);
  const riskColor = getRiskColor(district.riskScore);

  return `
    <div style="font-family: Inter, sans-serif; min-width: 250px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <div>
          <div style="font-size: 16px; font-weight: 800; color: #f0f4ff; letter-spacing:0.5px;">📍 ${district.name} District</div>
          <div style="font-size: 11px; color: #8b9cc8; margin-top: 2px;">
            Population: <strong style="color:#00d4ff;">${(district.population / 100000).toFixed(1)} Lakhs</strong>
          </div>
        </div>
        <div style="padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800;
          background: ${riskColor}25; color: ${riskColor}; border: 1px solid ${riskColor}50;">
          ${riskLabel} (${district.riskScore}/100)
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 18px; font-weight: 800; color: #00d4ff; font-family: Rajdhani, sans-serif;">${(district.cases2025 || district.cases2024).toLocaleString()}</div>
          <div style="font-size: 10px; color: #8b9cc8;">Recent Cases</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 18px; font-weight: 800; color: #ffd666; font-family: Rajdhani, sans-serif;">${district.tpr}%</div>
          <div style="font-size: 10px; color: #8b9cc8;">TPR Rate</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8b9cc8; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding:6px 8px; border-radius:6px;">
        <span>Breeding Index: <b style="color: #00e5a0;">${district.breedingIndex || 'N/A'}/10</b></span>
        <span>2027 Risk: <b style="color: #ff6b6b;">${district.riskLevel2027 || 'HIGH'}</b></span>
      </div>

      <button onclick="focusDistrict('${district.name}')" style="width: 100%; padding: 7px; background: linear-gradient(135deg, #00d4ff, #0077ff); border: none; border-radius: 6px; color: #000; font-weight: 700; font-size: 11px; cursor: pointer;">
        🔍 Zoom & View District Blocks
      </button>
    </div>
  `;
}

// ─── 2. CITY MARKERS (Municipal Corporations, Municipalities, NACs) ────────
function renderCityMarkers() {
  if (typeof ODISHA_MAP_DATA === 'undefined' || !ODISHA_MAP_DATA.cities) return;

  ODISHA_MAP_DATA.cities.forEach(city => {
    if (selectedDistrictFilter && city.district.toLowerCase() !== selectedDistrictFilter.toLowerCase() && city.distCode !== selectedDistrictFilter) {
      return;
    }

    const color = getRiskColor(city.riskScore);
    const size = city.type.includes('Corporation') ? 34 : (city.type.includes('Municipality') ? 28 : 24);

    const iconHtml = `
      <div class="city-pin" style="
        width: ${size}px; height: ${size}px;
        background: #050d1a;
        border: 2px solid ${color};
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 12px ${color}80, 0 2px 8px rgba(0,0,0,0.7);
        font-size: ${size * 0.45}px;
        color: ${color};
        cursor: pointer;
        transition: all 0.2s ease;
      " title="${city.name} (${city.type})">
        🏢
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([city.lat, city.lng], { icon }).addTo(dengueMap);
    marker.bindPopup(createCityPopup(city), { maxWidth: 300, className: 'denguel-popup' });
    cityMarkers.push(marker);
  });
}

function createCityPopup(city) {
  const riskColor = getRiskColor(city.riskScore);

  return `
    <div style="font-family: Inter, sans-serif; min-width: 230px;">
      <div style="font-size: 15px; font-weight: 800; color: #f0f4ff; margin-bottom: 2px;">🏢 ${city.name}</div>
      <div style="font-size: 10px; color: #00d4ff; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">
        ${city.type} · ${city.district} District
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        <div style="background: rgba(255,255,255,0.04); padding: 6px; border-radius: 6px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: ${riskColor}; font-family: Rajdhani, sans-serif;">${city.cases2025}</div>
          <div style="font-size: 9px; color: #8b9cc8;">2025 Cases</div>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 6px; border-radius: 6px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: #f0f4ff; font-family: Rajdhani, sans-serif;">${(city.population / 1000).toFixed(0)}k</div>
          <div style="font-size: 9px; color: #8b9cc8;">Population</div>
        </div>
      </div>

      <div style="font-size: 11px; color: #8b9cc8; display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span>Risk Score: <b style="color: ${riskColor};">${city.riskScore}/100 (${city.dengueRisk})</b></span>
      </div>
      <div style="font-size: 11px; color: #8b9cc8; display: flex; justify-content: space-between;">
        <span>TPR: <b style="color: #f0f4ff;">${city.tpr || 'N/A'}%</b></span>
        <span>Breeding: <b style="color: #ffd666;">${city.breedingIndex || 'N/A'}/10</b></span>
      </div>
    </div>
  `;
}

// ─── 3. CD BLOCK MARKERS (314 Blocks across 30 Districts) ─────────────────
function renderBlockMarkers() {
  if (typeof ODISHA_MAP_DATA === 'undefined' || !ODISHA_MAP_DATA.blocks) return;

  Object.keys(ODISHA_MAP_DATA.blocks).forEach(distCode => {
    if (selectedDistrictFilter && distCode.toLowerCase() !== selectedDistrictFilter.toLowerCase()) {
      // also check if selectedDistrictFilter matches district name
      const distMatch = ODISHA_DATA.districts?.find(d => d.id === distCode || d.name.toLowerCase() === selectedDistrictFilter.toLowerCase());
      if (selectedDistrictFilter && (!distMatch || (distMatch.id !== distCode && distMatch.name.toLowerCase() !== selectedDistrictFilter.toLowerCase()))) {
        return;
      }
    }

    const blocksList = ODISHA_MAP_DATA.blocks[distCode];
    blocksList.forEach(block => {
      const color = getRiskColor(block.riskScore);
      const iconHtml = `
        <div class="block-pin" style="
          width: 22px; height: 22px;
          background: ${color};
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 900; color: #000;
          box-shadow: 0 0 8px ${color};
          cursor: pointer;
        " title="CD Block: ${block.name}">
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([block.lat, block.lng], { icon }).addTo(dengueMap);
      marker.bindPopup(createBlockPopup(block, distCode), { maxWidth: 280, className: 'denguel-popup' });
      blockMarkers.push(marker);
    });
  });
}

function createBlockPopup(block, distCode) {
  const riskColor = getRiskColor(block.riskScore);
  const dist = ODISHA_DATA.districts?.find(d => d.id === distCode)?.name || distCode;

  return `
    <div style="font-family: Inter, sans-serif; min-width: 220px;">
      <div style="font-size: 14px; font-weight: 800; color: #f0f4ff;">🏛️ ${block.name} Block</div>
      <div style="font-size: 10px; color: #8b9cc8; margin-bottom: 8px;">Code: <strong style="color:#00d4ff;">${block.code}</strong> · ${dist} District</div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        <div style="background: rgba(255,255,255,0.04); padding: 6px; border-radius: 6px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: #00d4ff; font-family: Rajdhani, sans-serif;">${block.cases2025}</div>
          <div style="font-size: 9px; color: #8b9cc8;">2025 Cases</div>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 6px; border-radius: 6px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: ${riskColor}; font-family: Rajdhani, sans-serif;">${block.riskScore}</div>
          <div style="font-size: 9px; color: #8b9cc8;">Risk Score</div>
        </div>
      </div>

      <div style="font-size: 11px; color: #8b9cc8; display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Population: <b style="color:#f0f4ff;">${(block.population / 1000).toFixed(0)}k</b></span>
        <span>Households: <b style="color:#f0f4ff;">${(block.households || 0).toLocaleString()}</b></span>
      </div>
      <div style="font-size: 11px; color: #8b9cc8; display: flex; justify-content: space-between;">
        <span>TPR: <b style="color:#ffd666;">${block.tpr}%</b></span>
        <span>Breeding Index: <b style="color:#00e5a0;">${block.breedingIndex}/10</b></span>
      </div>
    </div>
  `;
}

// ─── 4. VILLAGE & WARD MARKERS ────────────────────────────────────────────
function renderVillageMarkers() {
  if (typeof ODISHA_MAP_DATA === 'undefined' || !ODISHA_MAP_DATA.villages) return;

  Object.keys(ODISHA_MAP_DATA.villages).forEach(blockCode => {
    const villages = ODISHA_MAP_DATA.villages[blockCode];
    villages.forEach(v => {
      const color = getRiskColor(v.riskScore);
      const iconHtml = `
        <div class="village-pin" style="
          width: 14px; height: 14px;
          background: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 8px ${color};
          cursor: pointer;
        " title="Village/Ward: ${v.name}">
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([v.lat, v.lng], { icon }).addTo(dengueMap);
      marker.bindPopup(createVillagePopup(v, blockCode), { maxWidth: 260, className: 'denguel-popup' });
      villageMarkers.push(marker);
    });
  });
}

function createVillagePopup(v, blockCode) {
  const riskColor = getRiskColor(v.riskScore);

  return `
    <div style="font-family: Inter, sans-serif; min-width: 200px;">
      <div style="font-size: 14px; font-weight: 800; color: #f0f4ff;">🏡 ${v.name}</div>
      <div style="font-size: 10px; color: #00d4ff; margin-bottom: 6px;">${v.type || 'Village'} · Block Code: ${blockCode}</div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8b9cc8; margin-bottom: 4px;">
        <span>Population: <b style="color:#f0f4ff;">${v.population.toLocaleString()}</b></span>
        <span>Cases: <b style="color:${riskColor}; font-weight:700;">${v.cases2025}</b></span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8b9cc8;">
        <span>Risk Score:</span>
        <span style="font-weight: 800; color: ${riskColor};">${v.riskScore}/100</span>
      </div>
    </div>
  `;
}

// ─── 5. BHUBANESWAR HOTSPOTS ──────────────────────────────────────────────
function renderHotspotMarkers() {
  if (typeof ODISHA_DATA === 'undefined' || !ODISHA_DATA.bhubaneswarHotspots) return;

  ODISHA_DATA.bhubaneswarHotspots.forEach(spot => {
    const color = getRiskColor(spot.riskScore);
    const iconHtml = `
      <div style="
        width: 16px; height: 16px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.9);
        border-radius: 50%;
        box-shadow: 0 0 12px ${color}, 0 0 20px ${color}80;
        cursor: pointer;
        animation: markerPulse 1.5s infinite;
      "></div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-div-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(dengueMap);
    marker.bindPopup(`
      <div style="font-family: Inter, sans-serif; min-width: 200px;">
        <div style="font-size: 14px; font-weight: 800; color: #ff6b6b;">🔥 Hotspot: ${spot.name}</div>
        <div style="font-size: 11px; color: #8b9cc8; margin-top:2px;">Bhubaneswar Micro-Pocket</div>
        <div style="margin-top: 8px; display: flex; justify-content: space-between; font-size: 11px; color: #8b9cc8;">
          <span>2024 Cases: <b style="color: #00d4ff;">${spot.cases2024}</b></span>
          <span>Risk: <b style="color: ${color}; font-weight: 700;">${spot.riskLevel}</b></span>
        </div>
      </div>
    `, { maxWidth: 240 });
    hotspotMarkers.push(marker);
  });
}

// ─── CONTROLS & FILTERS ───────────────────────────────────────────────────
function setMapLayer(layerName) {
  activeMapLayer = layerName;

  // Update active state on layer buttons
  document.querySelectorAll('.map-layer-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layer === layerName);
  });

  renderMapLayers();
}

function focusDistrict(districtName) {
  selectedDistrictFilter = districtName;
  const select = document.getElementById('district-jump');
  if (select) select.value = districtName;

  const district = ODISHA_DATA.districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  if (district && dengueMap) {
    dengueMap.flyTo([district.lat, district.lng], 9.5, { animate: true, duration: 1.2 });
  }

  renderMapLayers();
}

function populateDistrictDropdown() {
  const select = document.getElementById('district-jump');
  if (!select || !ODISHA_DATA.districts) return;

  select.innerHTML = `<option value="">— Jump to District —</option>`;
  ODISHA_DATA.districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name;
    opt.textContent = `${d.name} (${d.riskLevel} Risk)`;
    select.appendChild(opt);
  });
}

function searchMapLocation(query) {
  if (!query || !query.trim() || !dengueMap) return;
  const q = query.trim().toLowerCase();

  // Search Cities
  const city = ODISHA_MAP_DATA.cities.find(c => c.name.toLowerCase().includes(q));
  if (city) {
    dengueMap.flyTo([city.lat, city.lng], 12, { animate: true, duration: 1 });
    return;
  }

  // Search Districts
  const district = ODISHA_DATA.districts.find(d => d.name.toLowerCase().includes(q));
  if (district) {
    focusDistrict(district.name);
    return;
  }

  // Search Blocks
  let foundBlock = null;
  Object.values(ODISHA_MAP_DATA.blocks).forEach(blocks => {
    const b = blocks.find(blk => blk.name.toLowerCase().includes(q));
    if (b) foundBlock = b;
  });
  if (foundBlock) {
    dengueMap.flyTo([foundBlock.lat, foundBlock.lng], 11, { animate: true, duration: 1 });
    return;
  }

  // Search Villages
  let foundVillage = null;
  Object.values(ODISHA_MAP_DATA.villages).forEach(vils => {
    const v = vils.find(vil => vil.name.toLowerCase().includes(q));
    if (v) foundVillage = v;
  });
  if (foundVillage) {
    dengueMap.flyTo([foundVillage.lat, foundVillage.lng], 13, { animate: true, duration: 1 });
    return;
  }
}

function resetMapView() {
  selectedDistrictFilter = '';
  const select = document.getElementById('district-jump');
  if (select) select.value = '';

  const searchInput = document.getElementById('map-search');
  if (searchInput) searchInput.value = '';

  if (dengueMap) {
    dengueMap.flyTo([20.45, 84.50], 7, { animate: true, duration: 1 });
  }

  renderMapLayers();
}

function updateMapStatsBar() {
  const statsEl = document.getElementById('map-stats-bar');
  if (!statsEl) return;

  const totalDistricts = districtMarkers.length;
  const totalCities = cityMarkers.length;
  const totalBlocks = blockMarkers.length;
  const totalVillages = villageMarkers.length;

  statsEl.innerHTML = `
    <span>Showing: </span>
    <b style="color:#00d4ff;">${totalDistricts}</b> Districts · 
    <b style="color:#ffd666;">${totalCities}</b> Cities · 
    <b style="color:#ff9f43;">${totalBlocks}</b> Blocks · 
    <b style="color:#00e5a0;">${totalVillages}</b> Villages/Wards
  `;
}

// Inject keyframe animation for map pulse
const markerStyle = document.createElement('style');
markerStyle.textContent = `
  @keyframes markerPulse {
    0%, 100% { box-shadow: 0 0 14px rgba(255,68,68,0.6), 0 4px 12px rgba(0,0,0,0.6); }
    50% { box-shadow: 0 0 28px rgba(255,68,68,0.9), 0 4px 14px rgba(0,0,0,0.8); }
  }
`;
document.head.appendChild(markerStyle);
