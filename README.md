# Legal Tech Dashboard

A full-stack dashboard for managing legal cases, documents, and tasks. This repository contains a Node/Express backend (MongoDB) and a React + Vite frontend.

## Features
- Case, Document, and Task models and CRUD APIs
- Dashboard with charts (Recharts) for status distributions and case types
- Simple seeder to populate sample data

## Repo structure
- `backend/` - Express API, Mongoose models, seeder, and database config
- `frontend/` - Vite + React app, components, pages, and styles

## Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas or local MongoDB

## Backend — Setup & Run
1. Open a terminal and navigate to the backend folder:

```powershell
cd backend
npm install
```

2. Create a `.env` in `backend/` (example):

```
# MongoDB Connection String
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/legaltech?retryWrites=true&w=majority

# Server Port (optional)
PORT=5000
```

3. Run the development server:

```powershell
npm run dev   # uses nodemon
# or
npm start
```

4. (Optional) Seed sample data:

```powershell
node seeder.js
```

API endpoints are mounted at `/api` (see `backend/routes/apiRoutes.js`) and dashboard summary at `/api/dashboard/summary`.

## Frontend — Setup & Run
1. Open a separate terminal and navigate to the frontend folder:

```powershell
cd frontend
npm install
npm run dev
```

2. The app runs on Vite's dev server (usually http://localhost:5173). The frontend expects the backend API at `http://localhost:5000/api` by default. Update `frontend/src/services/api.js` if needed.

## Environment & Configuration
- Backend: `backend/.env` — set `MONGO_URI` and `PORT`.
- Frontend: currently uses a hard-coded base URL in `frontend/src/services/api.js` (`http://localhost:5000/api`). For production, replace with an environment variable.

## Testing the charts & data
- If charts appear empty, add cases/documents/tasks via the UI or run `node backend/seeder.js` to populate sample data.

## Committing & Pushing
This project is version controlled with Git and already pushed to GitHub. Example commands:

```powershell
git add .
git commit -m "Your message"
git push origin main
```

## Notes
- Do not commit secrets (tokens / passwords). The `backend/.env` file is ignored via `.gitignore`.
- If using MongoDB Atlas, ensure your IP is allowed and your user credentials are correct.

## Next steps / Improvements
- Add authentication (JWT) for secured APIs
- Add pagination/filtering for large datasets
- Add tests and CI (GitHub Actions)

---
Created for the Legal Tech Dashboard project. 
