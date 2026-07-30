-- =============================================================================
-- AI DENGUEl — PostgreSQL + PostGIS Database Schema
-- Odisha Dengue Early Warning System
-- =============================================================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── ADMINISTRATIVE TABLES ──────────────────────────────────────────────────

-- Districts (30 Districts of Odisha)
CREATE TABLE IF NOT EXISTS districts (
  id              SERIAL PRIMARY KEY,
  district_code   VARCHAR(10) UNIQUE NOT NULL,
  census_code     INTEGER UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  division        VARCHAR(50),        -- Central / Northern / Southern
  area_ha         INTEGER,
  population      INTEGER,
  households      INTEGER,
  density         DECIMAL(8,2),       -- pop per sq km
  villages_count  INTEGER DEFAULT 0,
  inhabited_pct   DECIMAL(5,2),
  risk_level      VARCHAR(20) DEFAULT 'LOW',
  geometry        GEOMETRY(MultiPolygon, 4326),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_districts_code ON districts(district_code);
CREATE INDEX idx_districts_geom ON districts USING GIST(geometry);

-- CD Blocks (311 Blocks)
CREATE TABLE IF NOT EXISTS blocks (
  id              SERIAL PRIMARY KEY,
  block_code      VARCHAR(20) UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  population      INTEGER,
  households      INTEGER,
  area_ha         INTEGER,
  risk_level      VARCHAR(20) DEFAULT 'LOW',
  geometry        GEOMETRY(MultiPolygon, 4326),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blocks_district ON blocks(district_code);
CREATE INDEX idx_blocks_geom ON blocks USING GIST(geometry);

-- Gram Panchayats (5,531 GPs)
CREATE TABLE IF NOT EXISTS gram_panchayats (
  id              SERIAL PRIMARY KEY,
  gp_code         VARCHAR(20) UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  block_code      VARCHAR(20) REFERENCES blocks(block_code),
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  population      INTEGER,
  villages_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gp_block ON gram_panchayats(block_code);

-- Villages (51,313 Villages)
CREATE TABLE IF NOT EXISTS villages (
  id              SERIAL PRIMARY KEY,
  village_code    VARCHAR(20) UNIQUE NOT NULL,
  census_code     VARCHAR(20),
  name            VARCHAR(150) NOT NULL,
  block_code      VARCHAR(20) REFERENCES blocks(block_code),
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  gp_code         VARCHAR(20),
  tahasil         VARCHAR(100),
  population      INTEGER DEFAULT 0,
  households      INTEGER DEFAULT 0,
  area_ha         DECIMAL(12,2),
  is_inhabited    BOOLEAN DEFAULT TRUE,
  pin_code        VARCHAR(10),
  nearest_town    VARCHAR(100),
  nearest_town_km DECIMAL(6,2),
  latitude        DECIMAL(10,7),
  longitude       DECIMAL(10,7),
  geometry        GEOMETRY(Point, 4326),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villages_block ON villages(block_code);
CREATE INDEX idx_villages_district ON villages(district_code);
CREATE INDEX idx_villages_geom ON villages USING GIST(geometry);
CREATE INDEX idx_villages_name ON villages(name);

-- ─── DENGUE CASE DATA ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dengue_cases (
  id              SERIAL PRIMARY KEY,
  year            INTEGER NOT NULL,
  month           INTEGER,           -- 1-12
  week            INTEGER,           -- 1-52
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  block_code      VARCHAR(20),
  village_code    VARCHAR(20),
  confirmed_cases INTEGER DEFAULT 0,
  suspected_cases INTEGER DEFAULT 0,
  deaths          INTEGER DEFAULT 0,
  tests_conducted INTEGER DEFAULT 0,
  tpr             DECIMAL(5,2),      -- Test Positivity Rate
  serotype        VARCHAR(10),       -- DENV-1, DENV-2, DENV-3, DENV-4
  source          VARCHAR(50),       -- NCVBDC, State Health Dept
  reported_at     DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_year ON dengue_cases(year);
CREATE INDEX idx_cases_district ON dengue_cases(district_code);
CREATE INDEX idx_cases_block ON dengue_cases(block_code);

-- ─── CLIMATE & WEATHER DATA ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS climate_data (
  id              SERIAL PRIMARY KEY,
  date            DATE NOT NULL,
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  station         VARCHAR(100),
  temperature_max DECIMAL(5,2),
  temperature_min DECIMAL(5,2),
  temperature_avg DECIMAL(5,2),
  rainfall_mm     DECIMAL(8,2),
  humidity_pct    DECIMAL(5,2),
  wind_speed_kmh  DECIMAL(6,2),
  sunshine_hours  DECIMAL(4,2),
  source          VARCHAR(50) DEFAULT 'IMD',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_climate_date ON climate_data(date);
CREATE INDEX idx_climate_district ON climate_data(district_code);

-- ─── SATELLITE INDICES ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS satellite_indices (
  id              SERIAL PRIMARY KEY,
  date            DATE NOT NULL,
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  block_code      VARCHAR(20),
  ndwi            DECIMAL(6,4),       -- Normalized Difference Water Index
  ndmi            DECIMAL(6,4),       -- Normalized Difference Moisture Index
  ndvi            DECIMAL(6,4),       -- Normalized Difference Vegetation Index
  lst_celsius     DECIMAL(5,2),       -- Land Surface Temperature
  source          VARCHAR(50) DEFAULT 'Landsat-8',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_satellite_date ON satellite_indices(date);
CREATE INDEX idx_satellite_district ON satellite_indices(district_code);

-- ─── AI MODEL PREDICTIONS ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS predictions (
  id              SERIAL PRIMARY KEY,
  model_name      VARCHAR(100) NOT NULL,
  model_version   VARCHAR(20),
  prediction_date DATE NOT NULL,
  target_date     DATE NOT NULL,      -- date being predicted
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  block_code      VARCHAR(20),
  predicted_cases INTEGER,
  lower_bound     INTEGER,
  upper_bound     INTEGER,
  confidence      DECIMAL(5,2),
  risk_level      VARCHAR(20),
  shap_top_feature VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_target ON predictions(target_date);
CREATE INDEX idx_predictions_district ON predictions(district_code);

-- ─── ALERTS & WARNINGS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS alerts (
  id              SERIAL PRIMARY KEY,
  alert_level     VARCHAR(20) NOT NULL,  -- GREEN, YELLOW, ORANGE, RED
  district_code   VARCHAR(10) REFERENCES districts(district_code),
  block_code      VARCHAR(20),
  village_code    VARCHAR(20),
  title           VARCHAR(200),
  description     TEXT,
  trigger_metric  VARCHAR(50),        -- TPR, case_count, risk_score
  trigger_value   DECIMAL(10,2),
  is_active       BOOLEAN DEFAULT TRUE,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_alerts_district ON alerts(district_code);

-- ─── FACILITY & INFRASTRUCTURE ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS facilities (
  id              SERIAL PRIMARY KEY,
  village_code    VARCHAR(20),
  district_code   VARCHAR(10),
  has_primary_school BOOLEAN DEFAULT FALSE,
  has_power       BOOLEAN DEFAULT FALSE,
  has_road        BOOLEAN DEFAULT FALSE,
  has_mobile      BOOLEAN DEFAULT FALSE,
  has_pds_shop    BOOLEAN DEFAULT FALSE,
  post_office     BOOLEAN DEFAULT FALSE,
  nearest_hospital_km DECIMAL(6,2),
  atm_count       INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VIEWS ──────────────────────────────────────────────────────────────────

-- District risk summary view
CREATE OR REPLACE VIEW district_risk_summary AS
SELECT
  d.district_code,
  d.name,
  d.population,
  d.density,
  d.villages_count,
  COALESCE(SUM(dc.confirmed_cases), 0) AS total_cases_2026,
  COALESCE(AVG(dc.tpr), 0) AS avg_tpr,
  CASE
    WHEN AVG(dc.tpr) > 9 THEN 'CRITICAL'
    WHEN AVG(dc.tpr) > 5 THEN 'HIGH'
    WHEN AVG(dc.tpr) > 2 THEN 'MODERATE'
    ELSE 'LOW'
  END AS computed_risk
FROM districts d
LEFT JOIN dengue_cases dc ON d.district_code = dc.district_code AND dc.year = 2026
GROUP BY d.district_code, d.name, d.population, d.density, d.villages_count;
