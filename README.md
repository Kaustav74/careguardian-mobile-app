# CareGuardian Mobile App

CareGuardian is a mobile-first healthcare orchestration app designed to reduce emergency response time, improve hospital coordination, and empower families with proactive care workflows.

## SDK compatibility fix

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

## Running on development servers

Install dependencies:

```bash
npm install
```

Start Metro dev server:

```bash
npm run start
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
