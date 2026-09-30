# DESIGN.md

## Architecture

PadosiPro is a small full-stack product:

- **Mobile client** (`app/`): Expo Router screens for auth, OTP, profile, and daily task selection. Auth/user snapshots sit in an in-memory cache; today’s selected tasks persist with SecureStore and are keyed by local calendar date.
- **API** (`backend/`): Express routes under `/api/auth` for register, login, resend/verify OTP, and `me`. Passwords are bcrypt-hashed; sessions are JWTs.
- **Data stores**: Postgres holds users; Redis stores hashed OTPs, attempt counts, and send cooldowns. SMTP (real mail) delivers OTP codes.

Flow: register → email OTP → verify → confirm profile details → choose tasks for the day → home list. Unverified login returns `needsVerification` and routes back to OTP instead of issuing a token.

## Main trade-offs

- **In-memory user cache vs always hitting `/me`**: faster profile UI after login/register, but cache dies on app restart and must be refreshed when TTL expires.
- **SecureStore for tasks instead of AsyncStorage**: works in Expo Go without a custom native rebuild; fine for small task-id lists, not a general KV store.
- **OTP hashed in Redis, not plaintext**: safer if Redis is exposed, at the cost of not being able to recover the original code server-side.
- **Dockerized API + local Expo client**: simple backend parity, but physical devices need ngrok/LAN wiring for HTTPS/HTTP reachability.
- **Pure auth/OTP rule module for tests**: unit-tests the risky decisions without standing up Redis/Postgres for every case.

## Left out

- Persisting profile fields (name/mobile/address) back to Postgres
- Push notifications / reminders for tasks
- Multi-device sync for the daily task list
- Refresh-token rotation and remote logout
- Production hardening (rate limits beyond OTP cooldown, structured logging, CI)

## If we had another week

1. Persist profile updates through an authenticated API and keep the client cache in sync.
2. Add E2E smoke tests (Detox/Maestro) for register → OTP → tasks.
3. Move daily tasks to the backend so midnight reset is server-authoritative across devices.
4. Add CI for `npm test`, lint, and an EAS preview APK on main.
5. Ship a short screen recording of the full happy path for reviewers.
