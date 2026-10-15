# SkillBridge — Project Context & Memory

> Compact context memory for coding-agent sessions. Keep concise (<1,000 words). Update upon architectural changes.

---

## 1. Project Purpose
SkillBridge is a university-oriented peer-to-peer skill exchange and mentorship platform. Students list skills offered/wanted, discover peers, schedule sessions, leave reviews, and earn dynamic reputation badges. Administrators monitor metrics and inspect relational tables.

---

## 2. Technology Stack
- **Frontend:** React 19 (`react`, `react-dom`), Vite 8, Tailwind CSS v4, `react-router-dom` v7, Axios, Lucide React.
- **Backend:** Node.js, Express 5, Sequelize ORM v6, `mysql2`, JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv.
- **Database:** MySQL 8.0+ (Relational schema with advanced native SQL constructs).
- **Deployment Platform:** Render (Root Blueprint `render.yaml`: Web Service + Static Site).

---

## 3. Repository Structure & Key Paths
```
SkillBridge/
├── render.yaml                     # Render Blueprint (Web service + Static site)
├── backend/
│   ├── src/
│   │   ├── server.js               # Express app entry, CORS, health checks, route mounting
│   │   ├── config/
│   │   │   ├── db.js               # Sequelize instance, connection pooling, SSL, safe sync
│   │   │   └── advanced_sql.js     # Triggers, functions, procedures, cursors, views
│   │   ├── models/index.js         # Sequelize models (User, Skill, Request, Review)
│   │   ├── controllers/            # Route handlers (auth, user, skill, request, review, admin)
│   │   ├── middlewares/            # JWT auth and admin authorization
│   │   └── routes/                 # API routes mounted at /api/*
│   ├── verify_sql.js               # Integration test for native SQL routines
│   ├── verify_views.js             # Verification test for SQL views
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # SPA routes & AuthProvider wrapper
│   │   ├── api/axios.js            # Axios instance with baseURL normalization & JWT interceptor
│   │   ├── context/AuthContext.jsx # Auth state & session management
│   │   ├── pages/                  # UI pages (Landing, Login, Dashboard, Skills, Profile, Admin)
│   │   └── components/             # Reusable UI cards, navigation, protected routes
│   ├── vite.config.js              # Vite config with local dev proxy (/api -> localhost:5000)
│   └── package.json
└── docs/
    └── PROJECT_CONTEXT.md          # This context file
```

---

## 4. Architecture & Data Flow
1. **Client -> API:** Frontend requests invoke `api` (Axios) which prepends `/api` and attaches `Authorization: Bearer <token>`.
2. **Routing & Auth:** Express routes authenticate JWT via `protect` middleware, attaching `req.user`.
3. **ORM & Native SQL:** Queries execute through Sequelize models or raw SQL views.
4. **Automated Metrics:** A native MySQL trigger recalculates user reputation on review insertion. A cursor procedure is available for platform-wide recomputations.

---

## 5. Database Requirements & SQL Constraints
- **Engine:** MySQL 8.0+ strictly required. Do not migrate to PostgreSQL or MongoDB.
- **Hosting Constraint:** Render does not provide managed MySQL. An external provider must be used (e.g., Aiven, AWS RDS, DigitalOcean, Railway, Clever Cloud).
- **Incompatible Providers:** Serverless engines like PlanetScale are incompatible due to lack of standard foreign keys, triggers, and stored procedures.
- **Required Privileges:** Database user needs `TRIGGER`, `CREATE ROUTINE`, `ALTER ROUTINE`, `EXECUTE`, and `CREATE VIEW`. If binary logging is enabled on managed hosts, `log_bin_trust_function_creators=1` is required for deterministic functions.
- **Schema Sync (`sequelize.sync`):** In production (`NODE_ENV=production`), `alter: true` is disabled by default to prevent table locks and accidental schema mutation. `sequelize.sync({})` runs safe `CREATE TABLE IF NOT EXISTS`. Schema alteration requires explicit `DB_SYNC_ALTER=true`.

---

## 6. Environment Variables
| Variable | Service | Required | Purpose |
|---|---|---|---|
| `NODE_ENV` | Backend | Yes | `production` or `development` |
| `PORT` | Backend | Yes | Express listen port (Render sets dynamically) |
| `JWT_SECRET` | Backend | Yes | JWT signing secret (`generateValue: true` on Render) |
| `DB_HOST` | Backend | Yes | MySQL hostname/endpoint |
| `DB_PORT` | Backend | Yes | MySQL port (default: `3306`) |
| `DB_NAME` | Backend | Yes | Database name |
| `DB_USER` | Backend | Yes | Database username |
| `DB_PASSWORD` | Backend | Yes | Database password |
| `DB_SSL` | Backend | Optional | `true` for cloud providers requiring TLS |
| `DB_SYNC_ALTER` | Backend | Optional | `true` to force Sequelize table alteration on boot |
| `FRONTEND_URL` | Backend | Yes | Allowed origin for CORS (comma-separated for multi-origin) |
| `VITE_API_URL` | Frontend | Yes | Backend base URL (e.g., `https://backend.onrender.com`) |

---

## 7. Deployment Decisions
- **Render Blueprint:** Configured in root `render.yaml` with two services:
  1. `skillbridge-backend`: Web Service (`runtime: node`), free plan, root `backend/`, health check `/api/health`.
  2. `skillbridge-frontend`: Static Site (`runtime: static`), free plan, root `frontend/`, publish path `./dist`, SPA rewrite `/* -> /index.html`.
- **CORS Allowlist:** Dynamically allows `FRONTEND_URL`, `.onrender.com`, `.vercel.app`, and local origins in development.
- **BaseURL Normalization:** `frontend/src/api/axios.js` strips trailing slashes and guarantees `/api` suffix.

---

## 8. Current Branch & PR Status
- **Base Branch:** `main`
- **Active Branch:** `deploy/render-blueprint`
- **PR Status:** Prepared locally; submitted/ready against `main`.

---

## 9. Verified Tests
- **Backend Syntax Check:** Verified clean (`node -c` on all JS files in `backend/src`).
- **SQL Verification Scripts:**
  - `verify_sql.js`: PASSED (Tested `UpdateReputationOnReview` trigger, `GetAverageRating` function, and `RecomputeAllReputations` cursor procedure).
  - `verify_views.js`: PASSED (Tested `v_UserSummary`, `v_SkillCatalog`, and `v_PendingSkillRequests`).
- **Frontend Linting:** PASSED (`npm --prefix frontend run lint` exited with 0 errors).
- **Frontend Production Build:** PASSED (`npm --prefix frontend run build` bundled cleanly into `./dist`).

---

## 10. Outstanding Issues & Risks
- **External MySQL Dependency:** Users must provision external MySQL before deploying the backend.
- **Cold Starts:** On Render free web tier, the backend spins down after inactivity (~50s boot delay on first hit).
- **Managed MySQL Permissions:** Some cloud providers restrict routine creation without `SET GLOBAL log_bin_trust_function_creators = 1`.

---

## 11. Key Decisions & Rationale
1. **Preserve Native SQL:** Retained academic triggers and cursors in `advanced_sql.js` rather than moving logic to Node.js.
2. **Safe Production Sync:** Defaulted `sync({ alter: true })` to off in production to prevent runtime DDL deadlocks.
3. **Axios Normalization:** Sanitized `VITE_API_URL` in `axios.js` to eliminate mismatches between root domain and `/api`.

---

## 12. Instructions for Future Agents
1. Read `docs/PROJECT_CONTEXT.md` first.
2. Check current Git branch and working tree state.
3. Compare the memory with actual repository state.
4. Inspect only files relevant to the new task.
5. Update this context file whenever a major decision, deployment status, or architecture change occurs.
6. Treat source code and current Git history as authoritative if this file is outdated.
7. At the end of tasks, report changed files, checks performed, unresolved blockers, branch name, and PR URL.
8. Work incrementally, preserve existing functionality, and prioritize correctness over speed.
