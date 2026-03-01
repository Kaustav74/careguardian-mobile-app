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
- Admission pipeline entry points for dashboard confirmation

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

## Emergency flow implemented now

1. User taps SOS in mobile app
2. Backend creates `pending_cancel` emergency
3. 5-second cancel window is active
4. If not cancelled, backend routes to nearest available hospital
5. Hospital dashboard sees incoming queue
6. Hospital confirms dispatch
7. User emergency status transitions to `ambulance_dispatched` then `arrived_at_scene`

This is the beginning of a real emergency coordination loop (not static UI).

---

## Immediate next milestones

- Persist to PostgreSQL (replace in-memory state)
- Add Redis for low-latency routing cache and pub/sub fanout
- Add encryption-at-rest for vault documents
- Build guardian push notifications for emergency state changes
- Add admission request IDs + insurance pre-verification workflow
- Add full audit timeline per emergency event

---

## Note on this environment

If dependency install fails in this environment due npm registry restrictions (`403 Forbidden`), run the same commands on your local machine/network where npm registry access is available.
# CareGuardian Mobile App

CareGuardian is a mobile-first healthcare orchestration app designed to reduce emergency response time, improve hospital coordination, and empower families with proactive care workflows.

## Runtime mode: no Expo Go

This project is now configured to run with a **development build (expo-dev-client)** by default.

- `npm run start` launches Metro in **dev-client mode**.
- `npm run android` / `npm run ios` build and run native apps locally.
- Expo Go is optional and no longer the default workflow.
## SDK compatibility fix

This project is configured for **Expo SDK 54** and includes explicit Expo config (`app.json`) so Expo Go/dev client picks up a stable app identity and runtime metadata.
This project is now configured for **Expo SDK 54** to avoid the Expo Go mismatch error:

> Either upgrade this project to SDK 54 or install an older version of Expo Go that is compatible with your project.

## What this starter includes

This repository contains a **React Native (Expo + TypeScript)** starter implementation focused on:

- One-tap emergency activation with mock hospital/ambulance dispatch flow
- Live appointment slot browsing and booking simulation
- Bed and ICU visibility snapshot by hospital
- Digital Health Vault with profile and record sections
- Medicine reminders and preventive health alert cards
- Family guardian linking examples
- Subscription, insurance verification, and cost-estimator placeholders
- Teleconsultation and lab/home sample collection entry points
- AI symptom triage and risk analysis placeholders

## Product modules

1. **Emergency Command Center**
   - SOS activation
   - Dispatch timeline
   - Ambulance live tracking status
   - Auto-share medical profile
2. **Appointments & Hospital Capacity**
   - Doctor slots
   - Bed/ICU status
   - Priority routing for subscribers
3. **Digital Health Vault**
   - Prescriptions, reports, allergies, blood group, surgeries
   - Pre-admission forms
4. **Care Continuity**
   - Medicine reminders
   - Preventive checkup alerts
   - Family guardian profiles
5. **Smart Services**
   - Cashless insurance verification
   - Cost estimator
   - Lab tests + home sample scheduling
   - Government scheme guidance (Ayushman Bharat)
6. **Intelligence & Infrastructure**
   - AI symptom assessment (non-diagnostic guidance)
   - Predictive health risk scoring
   - Hospital on Wheels readiness
   - Hospital integration API network plan

## Running (development build workflow)
## Running on development servers

Install dependencies:

```bash
npm install
```

Build & run Android dev app (no Expo Go):

```bash
npm run android
```

Build & run iOS dev app (no Expo Go):

```bash
npm run ios
```

Start Metro for installed dev client:

```bash
npm run start
```

Alternative Metro modes:

```bash
npm run start:lan
npm run start:tunnel
```

Web server:
Start Metro dev server:

```bash
npm run start
```

Start Metro over LAN (best when testing on physical devices in same network):

```bash
npm run start:lan
```

Start Metro over tunnel (best when LAN/localhost networking fails):

```bash
npm run start:tunnel
```

Start development client server (for custom native modules/dev builds):

```bash
npm run dev
```

Start web development server:

```bash
npm run web
```

Other scripts:

- `npm run typecheck`
- `npm run start:metro` (plain Metro without dev-client flag)

## Troubleshooting

1. If your device cannot connect and you see localhost/127.0.0.1 host URI, use `npm run start:lan`.
2. If LAN is blocked, use `npm run start:tunnel`.
3. If you see `Cannot find module 'babel-preset-expo'`, run `npm install` and restart with `npx expo start -c`.
4. If web bundling fails with `Unable to resolve "fbjs/lib/invariant"`, ensure dependencies are installed from the latest `package.json` and run `npm run web` again.
- `npm run android` (local Android dev build)
- `npm run ios` (local iOS dev build)
- `npm run typecheck`

## Troubleshooting the manifest/host issue

If your manifest shows `hostUri` or `debuggerHost` as `127.0.0.1:8081`, a physical phone usually cannot connect to that address.

Try this sequence:

1. Run `npm run start:lan` and scan QR from a device on the same Wi-Fi.
2. If corporate Wi-Fi blocks local discovery, run `npm run start:tunnel`.
3. Keep Expo Go on a version that supports SDK 54.
4. If you use dev builds, use `npm run dev` and launch the installed dev client.
## Getting started

```bash
npm install
npm run start
```

Other scripts:

- `npm run typecheck`

## Suggested next steps

- Integrate secure auth (OIDC + MFA)
- Add encrypted local vault storage + key management
- Connect real hospital APIs via a gateway
- Add real-time location streaming for ambulance tracking
- Introduce background notification workflows and offline caching
