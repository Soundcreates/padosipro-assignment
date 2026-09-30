# PadosiPro

Neighborhood task helper: Expo (React Native) mobile app + Express API, Postgres, and Redis.

The **backend is already hosted on Render** (`https://padosipro-api-m8f3.onrender.com`), so you do **not** need Docker, ngrok, or local API setup to try the app. Just run the React Native client.

## Prerequisites

- Node.js 22+
- npm
- Expo Go **or** Xcode / Android Studio for simulators

## Startup (app only)

```bash
cd app
npm install
npx expo start
```

Then open iOS Simulator (`i`), Android emulator (`a`), or scan the QR code with Expo Go.

The app talks to the Render API by default (`EXPO_PUBLIC_API_URL` / fallback in `src/api/auth.ts`).

### Happy path

Register → enter OTP from email → confirm profile → choose daily tasks → home.

> First request after idle may take ~30–60s while the free Render instance wakes up.

## Optional: run the API locally

Only needed if you want to develop the backend yourself.

```bash
cp backend/.env.example backend/.env
# fill SMTP_* and DB/Redis values

docker compose up --build
```

Then point the app at your local API:

```bash
cp app/.env.example app/.env
# set EXPO_PUBLIC_API_URL=http://localhost:3003
```

## Environment variables

**Never commit secrets.**

### Hosted backend (Render)

Already configured on the `padosipro-api` service (Postgres, Redis/Key Value, SMTP, JWT).

### `backend/.env` (local only)

| Variable | Purpose |
| --- | --- |
| `SMTP_USER` / `SMTP_PASS` | SMTP auth |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP connection |
| `SMTP_MAIL_FROM` | From address for OTPs |
| `DATABASE_URL` | Postgres |
| `REDIS_URL` | Redis |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth tokens |
| `BCRYPT_SALT_ROUNDS` | Password hashing |
| `PORT` | API port (default `3003`) |

### `app/.env` (optional)

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | API base URL (defaults to Render) |

## Backend tests

```bash
cd backend
npm test
```

## Build an Android APK

```bash
cd app
npm install
npx eas-cli login
npx eas build -p android --profile preview
```

Local alternative (Android SDK required):

```bash
cd app
npx expo prebuild -p android
npx expo run:android --variant release
```

## Project layout

- `app/` — Expo Router mobile client
- `backend/` — Express API, auth, OTP, migrations
- `docker-compose.yml` — optional local Postgres, Redis, API
