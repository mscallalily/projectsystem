# PASS Mobile — React Native + Expo

PASS Mobile is the native mobile companion to the supplied PASS (Parking Access & Security System) project. It is built with React Native and Expo; it does **not** embed the existing website in a WebView.

## Features in this mobile build

- Native sign-in screen with optional Laravel API authentication.
- Bottom-tab navigation and dashboard.
- Register, list, and delete vehicle records.
- Parking availability overview with zone/slot cards.
- Local parking history.
- Camera-based QR scanning and manual pass entry, with local event logging.
- Profile and sign-out.
- SQLite persistence on the device.

## Requirements

- Node.js LTS (npm included)
- Android Studio / Android emulator, or Expo Go on a compatible device
- For remote login: the existing Laravel backend running and reachable from the phone

## Run the app

From this directory:

```bash
npm install
npx expo start
```

Scan the terminal QR code with Expo Go, or press `a` to open an Android emulator. Use a development build if your selected native module/version is not supported by the installed Expo Go client.

## Database and data model

The app uses `expo-sqlite` and creates `pass-mobile.db` automatically. Tables:

- `vehicles`: plate, type, make, color, approval status, creation timestamp
- `parking_slots`: sample slot label, zone, occupancy status
- `visits`: plate/pass code, event type, timestamp, location

Vehicle CRUD and visit creation/listing persist across app restarts on the same device. The parking slots are seeded demonstration data. Local SQLite data does not automatically sync between phones.

## Connect the existing Laravel API

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the base API URL, including `/api`, for example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000/api
```

Use your computer's LAN IP when testing on a physical phone; `localhost` on the phone points to the phone itself. Ensure the phone and computer share a network and the Laravel server is bound to a reachable interface. Do not put passwords, signing keys, or privileged API secrets in this file. Expo public variables are bundled into the client and are not secret.

The mobile app uses `POST /login` (with the backend-required `identifier` and `password` fields) and `POST /logout` from the supplied Laravel API and stores the returned bearer token using SecureStore. Confirm the backend's response shape and Sanctum token configuration match `src/services/auth.ts` before relying on remote authentication.

### Important backend integration boundary

The supplied `routes/api.php` currently exposes registration, login, password recovery, `/me`, logout, and admin user management. It does not currently expose mobile API endpoints for vehicle CRUD, live parking-slot occupancy, gate transactions, QR-pass validation, or history. These features therefore use local SQLite demo data until matching authenticated Laravel endpoints are implemented. The mobile app intentionally does not pretend that local events are official gate transactions or that sample parking availability is live.

## Project structure

```text
App.tsx
src/
  components/UI.tsx
  screens/
    AuthScreen.tsx
    DashboardScreen.tsx
    VehiclesScreen.tsx
    ParkingScreen.tsx
    HistoryScreen.tsx
    ScanScreen.tsx
    ProfileScreen.tsx
  services/
    api.ts
    auth.ts
    database.ts
  theme.ts
  types.ts
app.json
.env.example
```

## Type checking

```bash
npm install
npm run check
```

A full device build and API integration test require a local Android/iOS development environment and a running backend. Camera access is requested only when the scanner screen is opened.
