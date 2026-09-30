# PadosiPro

Neighborhood task helper: Expo (React Native) mobile app + Express API, Postgres, and Redis.

## Prerequisites

- Node.js 22+
- npm
- Docker + Docker Compose
- Expo Go **or** Xcode / Android Studio for simulators
- [ngrok](https://ngrok.com/) CLI (for testing the API from a physical device)
- Gmail App Password (or other SMTP) for OTP email

## Startup

Use **3 terminals** from the repo root.

### 1. Backend stack (Postgres, Redis, API)

```bash
cp backend/.env.example backend/.env
# fill SMTP_* values in backend/.env

docker compose up --build
```

API: `http://localhost:3003`

### 2. ngrok (physical device / Expo Go)

```bash
ngrok http 3003
```

Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok-free.dev`).

Simulator on the same machine can often use `http://localhost:3003` or your LAN IP instead.

### 3. Mobile app

```bash
cp app/.env.example app/.env
# set EXPO_PUBLIC_API_URL to the ngrok HTTPS URL (or local API URL)

cd app
npm install
npx expo start
```

Then open iOS Simulator (`i`), Android emulator (`a`), or scan the QR code with Expo Go.

### Happy path

Register → enter OTP from email → confirm profile → choose daily tasks → home.

## Environment variables

**Never commit secrets.**

### `backend/.env`

| Variable | Purpose |
| --- | --- |
| `SMTP_USER` / `SMTP_PASS` | SMTP auth |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP connection |
| `SMTP_MAIL_FROM` | From address for OTPs |
| `DATABASE_URL` | Postgres (overridden by Compose) |
| `REDIS_URL` | Redis (overridden by Compose) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth tokens |
| `BCRYPT_SALT_ROUNDS` | Password hashing |
| `PORT` | API port (default `3003`) |

### `app/.env`

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | API base URL (ngrok HTTPS or local) |

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
- `docker-compose.yml` — Postgres, Redis, API
