# CareGuardian Web Platform

CareGuardian is an all-in-one healthcare web application with role-aware access for **patients**, **hospitals**, and **ambulance users**.

## What is implemented

- Session auth with Passport Local + `scrypt` password hashing.
- Protected routes that redirect unauthenticated users to `/auth`.
- Multi-page dashboard: health data, records, doctors, hospitals, appointments, AI first-aid.
- REST backend under `/api/*`.
- Neon Postgres integration using Drizzle ORM and Postgres-backed session store.
- OpenAI JSON-mode endpoints for symptom analysis and first-aid guidance.
- Tailwind + tokenized theme variables + Radix/shadcn-style UI primitives.
- Emergency SOS quick action (`tel:102`) in app layout.

## Stack

- Frontend: React + Vite + Wouter + TanStack Query + Tailwind + Radix
- Backend: Express + Passport + express-session + connect-pg-simple
- Database: Neon PostgreSQL + Drizzle ORM

## Environment

Copy `.env.example` to `.env` and set values:

- `DATABASE_URL` (required)
- `SESSION_SECRET` (required)
- `OPENAI_API_KEY` (required for AI endpoints)
- Stripe keys (optional for subscription module integration)

## Run (dev server on port 5000)

```bash
npm install
npm run db:push
npm run dev
```

Open: `http://localhost:5000`

The development server runs **frontend + backend together**. API routes are available at `http://localhost:5000/api/*`.

## Core API groups

- Auth: `/api/register`, `/api/login`, `/api/logout`, `/api/user`
- Health data: `/api/health-data`
- Records: `/api/medical-records`
- Directory: `/api/doctors`, `/api/hospitals`
- Appointments: `/api/appointments`
- Emergency: `/api/emergencies`, `/api/ambulance-bookings`
- AI: `/api/ai/symptom-analysis`, `/api/ai/first-aid`

## Notes

- This repository now includes a full web architecture foundation for the requested CareGuardian platform.
- Voice interaction and Stripe workflows are represented as integration-ready environment hooks and feature modules for expansion.
