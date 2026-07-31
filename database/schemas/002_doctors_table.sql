-- =============================================================================
-- MosqAware — Odisha Dengue Specialists & Treatment Hospitals Schema
-- Database Schema for Healthcare Providers, Emergency Wards, and OPD Schedules
-- =============================================================================

CREATE TABLE IF NOT EXISTS dengue_healthcare_providers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    opd_days VARCHAR(100) DEFAULT 'Mon-Sat',
    opd_time VARCHAR(100) DEFAULT '09:00 AM - 05:00 PM',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    emergency_availability BOOLEAN DEFAULT TRUE,
    appointment_link TEXT DEFAULT 'https://eswasthya.odisha.gov.in/',
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    languages_spoken TEXT[],
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    icu_availability BOOLEAN DEFAULT TRUE,
    pediatric_dengue_available BOOLEAN DEFAULT TRUE,
    platelet_transfusion_facility BOOLEAN DEFAULT TRUE,
    blood_bank_available BOOLEAN DEFAULT TRUE,
    ambulance_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 4.8,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider_type VARCHAR(100) DEFAULT 'Specialist Doctor'
);

-- Indexing for high-speed spatial & filter queries
CREATE INDEX IF NOT EXISTS idx_doctors_district ON dengue_healthcare_providers(district);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON dengue_healthcare_providers(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_emergency ON dengue_healthcare_providers(emergency_availability);
CREATE INDEX IF NOT EXISTS idx_doctors_platelet ON dengue_healthcare_providers(platelet_transfusion_facility);
