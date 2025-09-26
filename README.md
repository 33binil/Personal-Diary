# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Personal-Diary

## Deploying to Render

This repository contains a React + Vite frontend and an Express + Mongoose backend (in the `server/` folder). Below are step-by-step instructions to deploy both parts to Render.com.

### 1) Create two services on Render

- Frontend: Static Site
	- Connect your GitHub repo and select the root of this repository.
	- Build Command: `npm run build`
	- Publish Directory: `dist`
	- Branch: e.g. `main`

- Backend: Web Service
	- Connect your GitHub repo and select the `server/` folder as the Root Directory.
	- Start Command: `node src/index.js` (or your server entry point)
	- Branch: e.g. `main`
	- Instance Type: choose as appropriate (starter or standard)

### 2) Environment variables (Backend)

Add the following environment variables to the backend service in Render (Environment -> Environment Variables). Replace placeholder values with your actual credentials.

- `MONGODB_URI` — MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<pass>@cluster.../dbname`)
- `JWT_SECRET` — a random secret used to sign any server-side tokens (if used)
- `FIREBASE_CLIENT_EMAIL` — Firebase service account client_email (if server uses admin SDK)
- `FIREBASE_PRIVATE_KEY` — Firebase service account private key (must be properly escaped/newlines preserved)
- `FIREBASE_PROJECT_ID` — Firebase project id

If your server uses any other environment variables (e.g., third-party API keys), add them here too.

### 3) Environment variables (Frontend)

Add the following environment variables to the frontend static site (Render static sites -> Environment):

- `VITE_FIREBASE_API_KEY` — Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` — Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` — Firebase project id
- `VITE_FIREBASE_STORAGE_BUCKET` — Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` — Firebase messaging sender id
- `VITE_FIREBASE_APP_ID` — Firebase app id

These variables are referenced by `src/config/firebase.js`. Render will inject them at build time.

### 4) Additional notes about Firebase & Google Drive

- The app uses Firebase Authentication and requests the Google Drive scope during sign-in. For Drive uploads to succeed in production, ensure your Firebase OAuth client and consent screen are configured correctly in the Google Cloud Console and that the authorized domains include your Render frontend domain.
- If you use server-side Firebase Admin features, create a service account and store its credentials as environment variables (see Backend section above).

### 5) Running locally (quick checks)

- Frontend:
	- Install deps: `npm install`
	- Start dev server: `npm run dev`

- Backend:
	- cd into server: `cd server`
	- Install deps: `npm install`
	- Start dev server: `npm run dev` (or `node src/index.js`)

### 6) Troubleshooting

- If Drive saves fail in production, check browser console and the Google OAuth consent screen configuration.
- If your frontend can't reach the backend, ensure CORS is properly configured on the backend and that the backend's `CORS_ORIGIN` (if used) includes your frontend URL.

If you'd like, I can: generate a checklist of exactly which Render settings to set for each service, or prepare a `.render` manifest if you'd prefer an infrastructure-as-code approach.
