# CareGuardian Real Prototype (Emergency Coordination System)

CareGuardian is no longer framed as only a UI app. This repository now includes a **real prototype stack** with:

1. Mobile app (user front door)
2. Backend coordination engine (core brain)
3. Hospital dashboard (operations surface)
4. Event-driven logs/records model (foundation for compliance)

## Architecture (v1 pilot)

### Layer 1: Mobile App (`/`)
- Emergency trigger with 5-second cancel safety window
- Live hospital capacity pull from backend
- Emergency lifecycle state updates in-app

### Layer 2: Backend Core (`/backend`)
- Auth + role-based access control (user / guardian / hospital_admin)
- Emergency routing engine (nearest available hospital)
- Hospital availability engine (beds / ICU / ambulances)
- Real-time event bus via Socket.IO
- Admission request engine with hospital approval/rejection workflow

### Layer 3: Hospital Dashboard (`/dashboard`)
- Hospital admin login
- Live emergency queue
- Confirm emergency dispatch
- Update bed/ICU/ambulance availability

### Layer 4: Security & Data Model (prototype-level)
- JWT-protected APIs
- Role gates on privileged endpoints
- Evented emergency records with status transitions
- Ready for extending into encrypted persistence and audit logs

---

## Product direction

For the world-impact build direction and phased execution order, see `docs/CAREGUARDIAN_EXECUTION_PLAN.md`.

## Run the real prototype

### 1) Start backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:4000`.

### 2) Open hospital dashboard
Navigate to:

`http://localhost:4000/dashboard`

Demo hospital admin login:
- Phone: `9111111111`
- Password: `demo123`

### 3) Run mobile app (dev build workflow)
From repo root:

```bash
npm install
npm run android
# or
npm run ios
```

Then start Metro for dev client:

```bash
npm run start
```

---

## Emergency + admission flow implemented now

1. User taps SOS in mobile app
2. Backend creates `pending_cancel` emergency
3. 5-second cancel window is active
4. If not cancelled, backend routes to nearest available hospital
5. Hospital dashboard sees incoming queue
6. Hospital confirms dispatch
7. User emergency status transitions to `ambulance_dispatched` then `arrived_at_scene`
8. Guardians receive event notifications as status changes
9. User can submit digital pre-admission request and receive hospital decision updates

This is the beginning of a real emergency + admission coordination loop (not static UI).

---

## Immediate next milestones

- Persist to PostgreSQL (replace in-memory state)
- Add Redis for low-latency routing cache and pub/sub fanout
- Add encryption-at-rest for vault documents
- Add push gateway integration (FCM/APNs/SMS) for guardian notifications
- Add insurance API pre-verification with payer-side callbacks
- Add full audit timeline per emergency event

---

## Note on this environment

If dependency install fails in this environment due npm registry restrictions (`403 Forbidden`), run the same commands on your local machine/network where npm registry access is available.
