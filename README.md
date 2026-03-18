# Auxirem Verification

Monorepo-style setup with:

- Frontend (React + TypeScript + Vite) in `client/`
- Backend (Node + Express) in `server/`

## Project Structure

```text
.
|- client/              # Frontend app
|  |- src/
|  |- public/
|  |- vite.config.ts
|- server/              # Backend API
|  |- controllers/
|  |- models/
|  |- routes/
|  |- services/
|  |- server.js
|- package.json         # Root orchestration scripts
```

## Setup

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix client install
```

Install backend dependencies:

```bash
npm --prefix server install
```

## Run Commands

Run frontend + backend together:

```bash
npm run dev
```

Run only frontend:

```bash
npm run dev:client
```

Run only backend in watch mode:

```bash
npm run dev:server
```

Run backend without watch mode:

```bash
npm run start:server
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
