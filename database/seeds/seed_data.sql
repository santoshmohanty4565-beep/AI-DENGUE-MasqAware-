-- =============================================================================
-- AI DENGUEl — Database Seed Data
-- 30 Districts + Sample Blocks, Villages, and Case Data
-- =============================================================================

-- ─── SEED DISTRICTS ─────────────────────────────────────────────────────────
INSERT INTO districts (district_code, census_code, name, division, area_ha, population, households, density, villages_count, inhabited_pct, risk_level) VALUES
('KHO', 386, 'Khordha',       'Central',  253130, 1167357, 247304, 461.2, 1534, 88.0, 'CRITICAL'),
('BAL', 377, 'Baleshwar',     'Central',  315987, 2067236, 477434, 654.2, 2932, 90.0, 'HIGH'),
('CUT', 381, 'Cuttack',       'Central',  362839, 1888423, 429454, 520.5, 1952, 95.0, 'HIGH'),
('MAY', 376, 'Mayurbhanj',    'Central',  723276, 2326842, 542726, 321.7, 3950, 95.0, 'MODERATE'),
('SUN', 374, 'Sundargarh',    'Northern', 702955, 1355340, 312497, 192.8, 1762, 97.0, 'MODERATE'),
('GAN', 388, 'Ganjam',        'Southern', 573751, 2761030, 596062, 481.2, 3195, 87.0, 'MODERATE'),
('JAJ', 382, 'Jajapur',       'Central',  282542, 1692095, 378645, 598.9, 1783, 90.0, 'HIGH'),
('PUR', 387, 'Puri',          'Central',  264280, 1433800, 313188, 542.5, 1707, 94.0, 'MODERATE'),
('BHD', 378, 'Bhadrak',       'Central',  224361, 1320499, 270791, 588.6, 1312, 95.0, 'HIGH'),
('KEN', 375, 'Kendujhar',     'Central',  633566, 1548674, 348448, 244.4, 2123, 97.0, 'LOW'),
('KDP', 379, 'Kendrapara',    'Central',  229859, 1356827, 305868, 590.3, 1547, 91.0, 'HIGH'),
('JGS', 380, 'Jagatsinghapur','Central',  165219, 1020991, 233626, 618.0, 1292, 95.0, 'HIGH'),
('ANG', 384, 'Anugul',        'Central',  405930, 1067275, 249733, 262.9, 1871, 88.0, 'MODERATE'),
('NAY', 385, 'Nayagarh',      'Central',  245302,  883051, 210850, 360.0, 1692, 91.0, 'LOW'),
('DHN', 383, 'Dhenkanal',     'Northern', 336719, 1075305, 253446, 319.3, 1208, 89.0, 'MODERATE'),
('SBP', 372, 'Sambalpur',     'Northern', 420118,  733006, 179411, 174.5, 1313, 94.0, 'LOW'),
('BRG', 370, 'Bargarh',       'Northern', 458733, 1331145, 336130, 290.2, 1206, 98.0, 'LOW'),
('BLG', 393, 'Balangir',      'Northern', 535896, 1451616, 369273, 270.9, 1783, 98.0, 'LOW'),
('KLH', 395, 'Kalahandi',     'Southern', 518087, 1454882, 373304, 280.8, 2253, 94.0, 'LOW'),
('RYG', 396, 'Rayagada',      'Southern', 669977,  820945, 191568, 122.5, 2665, 93.0, 'LOW'),
('KDM', 390, 'Kandhamal',     'Southern', 438485,  660831, 155256, 150.7, 2587, 93.0, 'LOW'),
('KRP', 398, 'Koraput',       'Southern', 603314, 1153478, 282783, 191.2, 2042, 95.0, 'LOW'),
('GAJ', 389, 'Gajapati',      'Southern', 453272,  507151, 112365, 111.9, 1612, 93.0, 'LOW'),
('NBG', 397, 'Nabarangapur',  'Southern', 399561, 1133321, 253208, 283.6,  891, 97.0, 'LOW'),
('MLK', 399, 'Malkangiri',    'Southern', 367545,  563664, 126225, 153.4, 1055, 94.0, 'LOW'),
('NUP', 394, 'Nuapada',       'Southern', 259272,  576328, 144299, 222.3,  668, 98.0, 'LOW'),
('BOD', 391, 'Baudh',         'Southern', 187264,  420738, 102402, 224.7, 1187, 94.0, 'LOW'),
('SBN', 392, 'Subarnapur',    'Northern', 194366,  560242, 139346, 288.2,  962, 89.0, 'LOW'),
('DBG', 373, 'Debagarh',      'Northern', 191592,  290130,  70058, 151.4,  878, 82.0, 'LOW'),
('JHS', 371, 'Jharsuguda',    'Northern', 156589,  348340,  84287, 222.5,  351, 99.0, 'LOW')
ON CONFLICT (district_code) DO NOTHING;

-- ─── SEED BLOCKS (Khordha District Sample) ──────────────────────────────────
INSERT INTO blocks (block_code, name, district_code, population, households, risk_level) VALUES
('KHO-SAR', 'Khordha Sadar',    'KHO', 350000, 72000, 'CRITICAL'),
('KHO-BLP', 'Balipatna',        'KHO',  80000, 18500, 'HIGH'),
('KHO-BOL', 'Bolagarh',         'KHO',  65000, 15200, 'MODERATE'),
('KHO-BAL', 'Balianta',         'KHO',  95000, 21000, 'HIGH'),
('KHO-NKP', 'Nirakarpur',       'KHO',  50000, 11800, 'LOW'),
('KHO-TNG', 'Tangi',            'KHO',  40000,  9500, 'MODERATE'),
('KHO-JTP', 'Jatni',            'KHO', 120000, 28000, 'HIGH'),
('KHO-BNP', 'Banapur',          'KHO',  55000, 13000, 'LOW'),
('KHO-CHT', 'Chilika',          'KHO',  45000, 10500, 'LOW'),
('KHO-BJP', 'Begunia',          'KHO',  42000,  9800, 'LOW')
ON CONFLICT (block_code) DO NOTHING;

-- ─── SEED YEARLY CASES ──────────────────────────────────────────────────────
INSERT INTO dengue_cases (year, month, district_code, confirmed_cases, deaths, tpr, serotype, source) VALUES
(2018, NULL, 'KHO', 890,  2, 4.20, 'DENV-2', 'NCVBDC'),
(2019, NULL, 'KHO', 1240, 3, 5.10, 'DENV-2', 'NCVBDC'),
(2020, NULL, 'KHO', 680,  1, 3.80, 'DENV-2', 'NCVBDC'),
(2021, NULL, 'KHO', 1580, 0, NULL, 'DENV-2', 'NCVBDC'),
(2022, NULL, 'KHO', 1450, 0, NULL, 'DENV-2', 'NCVBDC'),
(2023, NULL, 'KHO', 3200, 1, 9.80, 'DENV-2', 'NCVBDC'),
(2024, NULL, 'KHO', 1782, 0, 6.20, 'DENV-2', 'NCVBDC'),
(2025, NULL, 'KHO', 475,  0, 1.83, 'DENV-2', 'NCVBDC'),
(2026, NULL, 'KHO', 1154, 0, 0.98, 'DENV-2', 'State Health Dept')
ON CONFLICT DO NOTHING;
