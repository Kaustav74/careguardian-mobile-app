# CareGuardian Mobile App

CareGuardian is a mobile-first healthcare orchestration app designed to reduce emergency response time, improve hospital coordination, and empower families with proactive care workflows.

## Runtime mode: no Expo Go

This project is now configured to run with a **development build (expo-dev-client)** by default.

- `npm run start` launches Metro in **dev-client mode**.
- `npm run android` / `npm run ios` build and run native apps locally.
- Expo Go is optional and no longer the default workflow.

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

## Suggested next steps

- Integrate secure auth (OIDC + MFA)
- Add encrypted local vault storage + key management
- Connect real hospital APIs via a gateway
- Add real-time location streaming for ambulance tracking
- Introduce background notification workflows and offline caching
