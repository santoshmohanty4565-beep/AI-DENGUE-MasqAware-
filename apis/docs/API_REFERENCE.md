# AI DENGUEl — API Documentation (v1)

## Base URL
```
http://localhost:3000
```

---

## Core APIs

### Health Check
```
GET /api/health
```
Returns system status, version, uptime.

### Dashboard Stats
```
GET /api/dashboard/stats
```
Returns state-level summary: risk level, provisional cases, TPR.

---

## District APIs

### List All Districts
```
GET /api/districts?sort=density|cases|risk&search=khordha
```

### Get Single District
```
GET /api/districts/:id
```
`id` can be district code (e.g. `KHO`) or name (e.g. `khordha`).

---

## Prediction APIs

### 2027 Forecast
```
GET /api/predict/2027
```
Returns SARIMA-XGBoost monthly projections with confidence intervals.

### SHAP Feature Importance
```
GET /api/predict/shap
```
Returns top features driving predictions with importance scores.

---

## Village Directory API

### Search Villages
```
GET /api/villages?search=tora&district=bargarh&page=1&limit=10
```

---

## AI Assistant API

### Chat
```
POST /api/assistant/chat
Content-Type: application/json

{
  "message": "What is the 2027 forecast for Odisha?"
}
```

---

## Map APIs (v1)

### State Overview
```
GET /api/v1/map/state
```

### Blocks in a District (GeoJSON)
```
GET /api/v1/map/blocks/:district_code
```
Example: `GET /api/v1/map/blocks/KHO` → Returns 10 Khordha blocks.

### Villages in a Block (GeoJSON)
```
GET /api/v1/map/villages/:block_code
```
Example: `GET /api/v1/map/villages/KHO-SAR` → Returns Khordha Sadar villages.

---

## Risk APIs (v1)

### District Risk Levels
```
GET /api/v1/risk/districts
```

### Block Risk Levels
```
GET /api/v1/risk/blocks/:district_code
```

### Active Hotspots
```
GET /api/v1/risk/hotspots
```

---

## Analytics APIs (v1)

### District Analytics
```
GET /api/v1/analytics/district/:district_code
```

### Trend Data
```
GET /api/v1/analytics/trends/:level/:id?period=2026
```
