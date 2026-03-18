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

Install everything (root + client + server):

```bash
npm run install:all
```

Create env files automatically:

```bash
npm run setup:env
```

Validate env files:

```bash
npm run validate:env
```

Do full setup in one command:

```bash
npm run setup
```

Or install each package separately:

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

Create env files from examples:

```bash
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
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
- `server/.env` must contain valid `PORT` (1-65535)
- `client/.env` must contain valid `VITE_API_BASE_URL` starting with `http://` or `https://`
