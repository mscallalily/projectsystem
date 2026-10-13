# PASS Mobile (React Native + Expo)

Native mobile app for **PASS – Parking Access and Space Management System** (Dr. Yanga's Colleges, Inc.).
It recreates the mobile experience from the original prototype (`frontend/src/pages/MobileApp.tsx`) with
React Native components. **No WebView and no web build** – every screen is native.

- Expo SDK 57 · React Native 0.86 · TypeScript
- Fonts: Inter (body) and Poppins (headings), as in the original
- Icons: `lucide-react-native` (same icon set the original used)
- Auth/registration talk to the existing **Laravel + Sanctum** backend (`/api/login`, `/api/me`, `/api/logout`, `/api/register`)
- Session token is kept in the device keychain/keystore (`expo-secure-store`); no secrets live in the app

## Run it

```bash
cd mobile
npm install
cp .env.example .env     # then edit EXPO_PUBLIC_API_URL (see below)
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS), or press `a` (Android emulator) / `i` (iOS simulator).
After changing `.env`, restart with `npx expo start -c`.

### Pointing the app at the API

| Where the app runs | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Android emulator, API on your PC | `http://10.0.2.2:8000` |
| iOS simulator, API on your Mac | `http://localhost:8000` |
| Physical phone (Expo Go) | `http://<your-PC-LAN-IP>:8000` – phone and PC must be on the same Wi‑Fi |

## Backend / database setup

The database is the existing MySQL database owned by the Laravel backend (`backend/` in the project zip / the
`feature/laravel-backend` branch). The mobile app never connects to MySQL directly.

```bash
cd backend
composer install
cp .env.example .env            # set DB_* for your MySQL server (default DB: pass_db)
php artisan key:generate
php artisan migrate --seed      # roles, departments, vehicle types
php artisan storage:link        # optional
php artisan serve --host=0.0.0.0 --port=8000   # 0.0.0.0 so a phone can reach it
```

Accounts:

- Registration from the app creates a **pending** account (plus uploaded school ID / license under private storage).
- An administrator must approve it before it can sign in: `php artisan pass:approve` (lists pending users) or
  `php artisan pass:approve user@email.edu`, or via the admin API (`PATCH /api/admin/users/{id}/approve`).
- First admin: `php artisan pass:create-admin`. Admin accounts use the web dashboard; the mobile app tells them so.
- Staff demo user: set `PASS_DEMO_SECURITY_PASSWORD` (12+ chars) in the backend `.env`, then run `php artisan db:seed --class=ParkingStaffDemoSeeder`.

Sign in with the **email or the institutional ID number** + password. Roles map like the web app:
`security` → Parking Staff; `student`, `faculty`, `employee` as-is.

## What is real and what is not (yet)

| Screen / feature | Status |
| --- | --- |
| Sign in, session restore, sign out | **Live API** (`/login`, `/me`, `/logout`) |
| Create account (5 steps, ID + license upload) | **Live API** (`/register`, multipart) |
| Continue as Guest | Local guest session (the API has no guest login) |
| Driver's license submission | Saved **on the device** per user – no API endpoint exists yet |
| Visitor parking request / demo QR | Saved on the device – no API endpoint exists yet |
| Notifications read-state | Saved on the device |
| Parking availability, history, today's stats, notifications list, QR pass | Same **sample data as the original prototype** – the API has no parking/history/notification endpoints yet |
| Edit Profile, My Vehicles, RFID Card, Settings, Vehicle Verify, Visitor QR, Access Records, Refresh QR | Buttons exist as in the original but show "not available yet" – they were non-functional in the original and need backend work |

Known backend gap: `routes/api.php` registers `POST /forgot-password` and `POST /reset-password`, but
`AuthController` has no `forgotPassword` / `resetPassword` methods, so those routes will error. The original mobile
UI has no password-recovery screen, so the app doesn't include one.

## Project layout

```
mobile/
  App.tsx                      root: fonts, auth gate, role-based bottom navigation
  app.json                     Expo config (name, icons, permissions)
  assets/branding/pass-logo.jpg  official PASS logo (unmodified)
  src/
    api/client.ts              fetch wrapper (Bearer token, Laravel error messages)
    config.ts                  API URL + brand constants
    theme.ts                   colours/fonts taken from the original Tailwind classes
    context/                   AuthContext (Sanctum token), LicenseContext
    components/                ui primitives, Brand logos, Select, RegistrationForm
    screens/                   AuthScreens, MainScreens, MoreScreens
    data/mock.ts               sample data used where the API has no endpoint yet
  __tests__/screens.test.tsx   Jest tests (render + behaviour of every screen)
```

## Tests

```bash
npm test
npx tsc --noEmit
```

## Notes

- Dates/times are typed as `YYYY-MM-DD` / `HH:MM` (the original used browser date pickers).
- Uploads accept JPG, PNG or PDF up to 5 MB (same rules as the web form and the API).
- Android/iOS permissions for camera and photo library are declared in `app.json`.
