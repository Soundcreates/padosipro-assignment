# PadosiPro

Neighborhood task helper: Expo (React Native) mobile app + Express API, Postgres, and Redis.

## Prerequisites

- Node.js 22+
- npm
- Docker + Docker Compose
- Expo Go (device) **or** Xcode / Android Studio for simulators
- Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for OTP email (or another SMTP provider)

## Environment variables

Copy the example file and fill in real values locally. **Never commit secrets.**

```bash
cp backend/.env.example backend/.env
```

| Variable | Purpose |
| --- | --- |
| `SMTP_USER` / `SMTP_PASS` | SMTP auth (e.g. Gmail + app password) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP connection |
| `SMTP_MAIL_FROM` | From address for OTP emails |
| `DATABASE_URL` | Postgres connection (set automatically in Docker) |
| `REDIS_URL` | Redis connection (set automatically in Docker) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth token signing |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost |
| `PORT` | API port (default `3003`) |

For the mobile app, set the API base URL in `app/src/api/auth.ts` (use your machine LAN IP, or an ngrok HTTPS URL when testing on a physical device).

## Backend setup

From the repo root:

```bash
# start Postgres, Redis, and API
docker compose up --build

# optional: wipe DB volumes and start clean
docker compose down -v && docker compose up --build
```

The API listens on `http://localhost:3003`. Migrations run on startup.

Run backend tests:

```bash
cd backend
npm test
```

## Mobile app setup

```bash
cd app
npm install
npx expo start
```

Then open in Expo Go, or press `i` / `a` for simulators.

If you use a tunnel for the API:

```bash
ngrok http 3003
```

Update `API_URL` in `app/src/api/auth.ts` to the ngrok HTTPS URL.

## How to run (full stack)

1. Copy `backend/.env.example` → `backend/.env` and set SMTP credentials.
2. `docker compose up --build` from the repo root.
3. `cd app && npm install && npx expo start`.
4. Point the app `API_URL` at the running API.
5. Register → verify OTP from email → confirm profile → pick daily tasks.

## Build an Android APK

From `app/`:

```bash
npm install
npx eas-cli login          # first time only
npx eas build -p android --profile preview
```

If you do not use EAS yet, create a minimal `eas.json` with a `preview` profile that produces an APK, then run the command above. Download the APK from the EAS build page when it finishes.

Local alternative (requires Android SDK):

```bash
cd app
npx expo prebuild -p android
npx expo run:android --variant release
```

## Project layout

- `app/` — Expo Router mobile client
- `backend/` — Express API, auth, OTP, migrations
- `docker-compose.yml` — Postgres, Redis, API
