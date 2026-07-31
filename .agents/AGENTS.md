# Workspace AGENTS.md — Future Dengue Protection & AI Protocols

This document defines future Dengue protection rules, AI surveillance guidelines, and behavioral requirements for the MosqAware codebase.

## 🛡️ Future Dengue Protection Rules (2026–2030 Protocol)

1. **AI Bio-Acoustic Early Warning Mandate**:
   - Audio FFT signatures matching *Aedes aegypti* (450–610 Hz) or *Aedes albopictus* (540–720 Hz) must automatically trigger a priority municipal larvicide dispatch alert.
   - FFT spectrum confidence scores exceeding 85% generate instant notifications in the reporter dashboard.

2. **Micro-Climate $R_0$ Outbreak Boundary Rule**:
   - Whenever ambient temperature exceeds 28°C, humidity > 70%, and NDWI water reflection index > 0.5, the basic reproduction number ($R_0$) threshold rule forces district status to **CRITICAL WATCH**.
   - Immediate drone spraying intervention (minimum 50% coverage) must be dynamically recommended when $R_0 > 2.0$.

3. **Serotype-2 (DENV-2) Hemorrhagic Risk Directive**:
   - Because DENV-2 accounts for >65% of cases in Odisha (associated with Dengue Hemorrhagic Fever), any community report citing symptoms `fever` + `bleeding` + `vomiting` must bypass standard triage and escalate directly to urgent emergency transport (Capital Hospital / SCB Medical).

4. **Community Incident Verification Standard**:
   - All crowd-sourced incident reports must be stored with immutable timestamps (`createdAt`), verified geographic district tags, severity ratings, and authenticated reporter IDs (`u_*`).
   - Reporting data files in `data/users.json` and `data/reports.json` must preserve strict schema validation.

5. **Localhost Server & Privacy Protection Rule**:
   - API endpoints (`/api/v1/map`, `/api/v1/risk`, `/api/v1/analytics`, `/api/v1/acoustic`, `/api/v1/simulation`) must enforce JSON output formats, security headers (Helmet/CORS), and zero plain-text credential leaks.
