# Backend (Express + MongoDB)

This folder contains the Express API for the Personal Diary app.

## Quick start

1) Create .env from the example

```
cp .env.example .env
```

2) Fill values
- MONGODB_URI=mongodb+srv://...
- MONGODB_DB=diary
- PORT=5000
- FRONTEND_ORIGIN=http://localhost:5173

3) Install and run

```
npm i
npm run dev
```

API will start at http://localhost:$PORT (default 5000).

## Routes
- GET /api/health
- POST /api/entries { title?, content, date?, images?, audio?, userId? }
- GET /api/entries?userId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/entries/:id
- PUT /api/entries/:id
- DELETE /api/entries/:id
