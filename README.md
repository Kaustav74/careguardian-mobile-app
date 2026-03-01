# CareGuardian Mobile App

CareGuardian is a mobile-first healthcare orchestration app designed to reduce emergency response time, improve hospital coordination, and empower families with proactive care workflows.

## SDK compatibility fix

This project is configured for **Expo SDK 54** and includes explicit Expo config (`app.json`) so Expo Go/dev client picks up a stable app identity and runtime metadata.

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

## Running on development servers

Install dependencies:

```bash
npm install
```

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

## Suggested next steps

- Integrate secure auth (OIDC + MFA)
- Add encrypted local vault storage + key management
- Connect real hospital APIs via a gateway
- Add real-time location streaming for ambulance tracking
- Introduce background notification workflows and offline caching
