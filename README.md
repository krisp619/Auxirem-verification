# Auxirem Verification

Monorepo-style setup with:

- Frontend (React + TypeScript + Vite) in the project root
- Backend (Node + Express) in `backend/`

## Project Structure

```text
.
|- src/                 # Frontend source
|- backend/             # Backend API
|  |- controllers/
|  |- models/
|  |- routes/
|  |- services/
|  |- server.js
|- package.json         # Root scripts for frontend + backend
```

## Setup

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
npm --prefix backend install
```

## Run Commands

Run frontend + backend together:

```bash
npm run dev
```

Run only frontend:

```bash
npm run dev:frontend
```

Run only backend in watch mode:

```bash
npm run dev:backend
```

Run backend without watch mode:

```bash
npm run start:backend
```

Build frontend:

```bash
npm run build
```

Preview frontend build:

```bash
npm run preview
```

## Branch Workflow

- Do all feature work on `dev`
- Avoid direct push to `main`
- Raise Pull Request: `dev` -> `main`

## Environment Notes

- Do not commit `.env` files
- Keep secrets in local environment only
- Use `.env.example` for documenting required keys
