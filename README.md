# TaskFlow — Task Management System

Full-stack task manager with JWT authentication, refresh tokens, and CRUD tasks.

## Stack

- **Frontend:** React (JavaScript) + Vite + React Router + Axios
- **Backend:** Node.js (JavaScript) + Express + Sequelize + Zod
- **Database:** PostgreSQL 16

## Features

- User registration and login
- JWT access tokens + httpOnly refresh-token cookies (rotation on refresh)
- Create, read, update, delete tasks
- Mark tasks complete
- Filter by status (`pending`, `in_progress`, `completed`)
- Responsive layout for mobile and desktop

## Project structure

```
sanjeetpro/
├── docker-compose.yml
├── backend/
└── frontend/
```

## Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL) **or** a local PostgreSQL instance

## Setup

### 1. Start PostgreSQL

With Docker:

```bash
docker compose up -d
```

Or use a local Postgres instance and create the database:

```bash
createuser -P taskflow   # password: taskflow
createdb -O taskflow taskflow
```

Expected connection (matches `backend/.env.example`):

- host/port: `localhost:5432`
- user / password / database: `taskflow`

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at [http://localhost:4000](http://localhost:4000).

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `4000`) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | Postgres connection |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `ACCESS_TOKEN_TTL` | e.g. `15m` |
| `REFRESH_TOKEN_TTL` | e.g. `7d` |
| `CORS_ORIGIN` | Frontend origin |
| `COOKIE_SECURE` | `true` in production HTTPS |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (`http://localhost:4000/api`) |

## API overview

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Register (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Login (`email`, `password`) |
| `POST` | `/api/auth/refresh` | Rotate refresh cookie → new access token |
| `POST` | `/api/auth/logout` | Revoke refresh token |

### Tasks (requires `Authorization: Bearer <accessToken>`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tasks` | List tasks (`?status=` optional) |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `PATCH` | `/api/tasks/:id/complete` | Mark completed |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Task body fields

```json
{
  "title": "Finish report",
  "description": "Optional notes",
  "status": "pending",
  "dueDate": "2026-10-01"
}
```

## Database schema

- **users** — `id`, `name`, `email` (unique), `password_hash`, timestamps
- **tasks** — `id`, `user_id` (FK cascade), `title`, `description`, `status`, `due_date`, timestamps  
  Indexes on `user_id` and `(user_id, status)`
- **refresh_tokens** — `id`, `user_id` (FK cascade), `token_hash` (unique), `expires_at`

Token issue / refresh / logout use DB transactions. Refresh tokens are stored as SHA-256 hashes.

## Scripts

```bash
# backend
cd backend && npm run dev
cd backend && npm test

# frontend
cd frontend && npm run dev
cd frontend && npm test
cd frontend && npm run build
```

## Testing notes

Backend API tests need a running PostgreSQL instance matching `backend/.env`.
