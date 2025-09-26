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

## Environment variables reference

Below is a consolidated list of every environment variable the project reads (frontend and backend), where each is consumed, whether it is required in production, and an example placeholder you can use when configuring Render or local `.env` files. Do NOT commit secrets to Git.

Frontend (Vite, set on the Static Site service or in root `.env` for local dev)
- `VITE_FIREBASE_API_KEY` — used by `src/config/firebase.js` (required)
	- Example: `VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` — used by `src/config/firebase.js` (required)
	- Example: `VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` — used by `src/config/firebase.js` (required)
	- Example: `VITE_FIREBASE_PROJECT_ID=personal-diary-85ff5`
- `VITE_FIREBASE_STORAGE_BUCKET` — used by `src/config/firebase.js` (optional)
	- Example: `VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` — used by `src/config/firebase.js` (optional)
	- Example: `VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890`
- `VITE_FIREBASE_APP_ID` — used by `src/config/firebase.js` (optional)
	- Example: `VITE_FIREBASE_APP_ID=1:123456789:web:abcdef` 
- `VITE_API_URL` — used by `src/lib/api.js` to point the frontend at the backend API (optional; defaults to `http://localhost:5000`)
	- Example: `VITE_API_URL=https://api.yourdomain.com`

Backend (server/.env or Render environment for the Web Service)
- `MONGODB_URI` — used by `server/src/config/db.js` and various scripts (required). This contains your MongoDB Atlas connection string and is secret.
	- Example placeholder (DO NOT commit real credentials):
		`MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourdbname?retryWrites=true&w=majority`
- `MONGODB_DB` — optional DB name override (defaults to `diary`)
	- Example: `MONGODB_DB=diary`
- `PORT` — server listen port (optional; defaults to `5000`)
	- Example: `PORT=5001`
- `FRONTEND_ORIGIN` — CORS origin whitelist for the backend (optional; defaults to `http://localhost:5173`)
	- Example: `FRONTEND_ORIGIN=http://localhost:5173` or `https://your-frontend.onrender.com`

Firebase Admin / service account options (server)
- `FIREBASE_SERVICE_ACCOUNT_PATH` — path to a local JSON file (e.g. `./secrets/firebase-service-account.json`) containing the service account credentials (useful for local dev). If present the server will load the JSON file and initialize Firebase Admin.
	- Example: `FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json`
- `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_PROJECT_ID` — alternative to `FIREBASE_SERVICE_ACCOUNT_PATH`. If you cannot provide a file on Render, set these three vars and the server will initialize Firebase Admin from them.
	- `FIREBASE_CLIENT_EMAIL` example: `your-service-account@your-project.iam.gserviceaccount.com`
	- `FIREBASE_PRIVATE_KEY` example: put the private key with `\n` in place of newlines (see notes below)
	- `FIREBASE_PROJECT_ID` example: `personal-diary-85ff5`

Notes about `FIREBASE_PRIVATE_KEY` formatting
- The private key value in a Firebase service account contains newlines. When pasting into Render's single-line env input, replace real newlines with the two-character sequence `\n`. Our server code will normalize `\\n` to `\n` and then to actual newlines at runtime.
- Example (not a real key, do NOT use this):
	`FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"`

Other optional variables referenced in code or docs
- `JWT_SECRET` — (optional) random secret used to sign any server-side JWT tokens if you add JWT flows. Not currently required by core routes.

Where to set them locally
- Frontend: root `.env` (already present in this repo with VITE_FIREBASE_* keys)
- Backend: `server/.env` (this repo contains a `server/.env.example` — copy to `server/.env` and populate). NEVER commit `server/.env` with secrets to Git.

Where to set them on Render
- Frontend Static Site: open the Static Site -> Environment -> Environment Variables and paste the VITE_* keys.
- Backend Web Service: open the Web Service -> Environment -> Environment Variables and paste the MONGODB_URI, FIREBASE_* vars, and any other server-side secrets.

Security reminders
- Never commit service account JSON files or private keys to source control.
- Use Render's environment variables to store secrets. For extra safety you can store the entire service account JSON as a Base64 string in one env var and decode it at startup; I can add a helper for that if you prefer.

If you want, I can now:
- Add a `server/.env.example` with placeholders for all server-side variables (safe to commit), or
- Add code to accept a `FIREBASE_SERVICE_ACCOUNT_BASE64` env var and decode it safely at startup (handy for Render single-line envs).

