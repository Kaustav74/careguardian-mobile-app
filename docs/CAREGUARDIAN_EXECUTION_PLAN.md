# CareGuardian Execution Plan (World-Impact Direction)

This is the product/build direction aligned to your instruction: CareGuardian is a **real-time emergency coordination and hospital access network**, not just an app UI.

## 0) Core mindset
- Mobile app is only the front door.
- Core value is backend orchestration + hospital operations integration.
- Success metric: emergency routing flow under ~10 seconds in pilot simulations.

## 1) Target architecture (4 layers)

1. **Mobile App (User + Guardian)**
   - SOS trigger
   - Appointment and pre-admission flows
   - Health vault access and controlled sharing

2. **Backend Core Brain**
   - Emergency routing engine
   - Hospital availability engine
   - Auth + RBAC + subscription logic
   - Notification/event pipeline

3. **Hospital Operations Dashboard**
   - Live bed/ICU/ambulance updates
   - Incoming emergency queue + acknowledgment
   - Admission request triage

4. **Data + Security Layer**
   - Encrypted storage for medical records
   - Audit/event logs
   - Compliance-ready access controls and traceability

## 2) Functional modules (real, not cosmetic)

### Emergency Coordination Engine
- Capture GPS + emergency type + profile snapshot on SOS.
- 5-second cancel window.
- Route to nearest hospital by distance + live capacity.
- Hospital confirms, then ambulance dispatch state streams to user + guardian.

### Smart Admission
- Hospital selection with real capacity.
- Digital pre-admission form + insurance upload.
- Admission request ID and status progression from hospital desk.

### Digital Health Vault (secure)
- Encrypt records in transit and at rest.
- Controlled sharing links/permissions.
- Access audit trail per document action.

### Guardian System
- Link dependents/parents.
- Emergency events notify guardians instantly.
- Guardian sees routing and status timeline.

## 3) Build order (strict)

### Phase 1 (Core pilot)
1. Authentication + RBAC
2. Emergency routing engine
3. Hospital dashboard queue + confirmation
4. Live capacity update loop
5. SOS end-to-end dispatch lifecycle

### Phase 2
- Guardian alerts
- Digital pre-admission flow
- Insurance pre-verification
- Basic treatment cost estimator

### Phase 3
- Predictive risk + symptom triage support
- Fleet optimization + rural dispatch extensions
- Hospital integration API standardization

## 4) Tech stack (scalable baseline)
- Mobile: React Native + Expo (dev build)
- Backend: Node.js + Express (or migrate to NestJS)
- Database: PostgreSQL (planned migration from in-memory prototype)
- Real-time: Socket.IO / WebSockets
- Cache/events: Redis (next phase)
- Cloud: AWS or GCP
- Security: JWT, HTTPS, RBAC, encryption at rest

## 5) Pilot strategy (execution reality)
- Start with **one hospital pilot** and one geography.
- Run controlled emergency simulations.
- Measure:
  - time-to-route
  - hospital acknowledgment latency
  - dispatch confirmation latency
- Iterate UI/ops workflow based on hospital staff friction.

## 6) Repo status against this plan
- ✅ Initial end-to-end prototype exists: mobile + backend + dashboard
- ✅ SOS 5-second cancel flow and hospital confirmation loop implemented
- ✅ Admission request engine + hospital decision workflow implemented
- ✅ Guardian notification feed + audit event timeline implemented
- ⚠️ Still in-memory persistence; PostgreSQL + Redis + encryption pending
- ⚠️ Production hardening (idempotency, retries, alerting) still pending
