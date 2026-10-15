# SkillBridge

SkillBridge is an enterprise-grade peer-to-peer mentorship and skill development platform designed for academic and institutional environments. The system facilitates verified peer discovery, session scheduling, mentorship reviews, algorithmic reputation tracking, and administrative data governance.

---

## 1. System Overview

SkillBridge provides a distributed, decoupled web architecture tailored for campus-wide collaboration:

- **Peer Discovery & Search:** Categorized skill indexing across academic departments and cohorts.
- **Session Lifecycle Management:** State-driven workflow governing mentorship requests, acceptances, rejections, and completion verification.
- **Automated Reputation & Merit Badges:** Serverless and database-level score calculation driven by review feedback.
- **Administrative Governance:** Native database schema visualizer, user role management, and operational analytics.

---

## 2. Technical Stack

| Tier | Component | Specification | Description |
|---|---|---|---|
| Frontend | Framework | React 19, Vite 8, React Router 7 | Single Page Application (SPA) architecture with optimized bundle delivery |
| Frontend | Styling | Tailwind CSS v4, Vanilla CSS | Design token system with dark-mode glassmorphism |
| Frontend | HTTP Client | Axios | Centralized request interceptors, token injection, and auto-logout handlers |
| Backend | Runtime & API | Node.js, Express.js 5 | RESTful API service with route segmentation and middleware controllers |
| Database | Persistence & ORM | MySQL 8.0+, Sequelize 6 | Relational schema with UUID primary keys, foreign constraints, and pooling |
| Security | Auth & Cryptography | JWT (jsonwebtoken), bcryptjs | Stateless bearer authentication and salted password hashing |
| Hosting | Frontend Host | Vercel CDN | Edge-delivered static assets with client-side rewrite rules |
| Hosting | Backend Host | Render Web Service | Containerized Node.js runtime with health checks and Blueprint automation |
| Hosting | Database Host | Aiven / Railway / Cloud MySQL | Dedicated managed relational database with TLS/SSL encryption |

---

## 3. Database Architecture & Advanced SQL Implementation

SkillBridge enforces strict relational integrity and offloads analytical computations directly to the MySQL database engine via custom initialization routines.

### Relational Schema Design
- **Users:** Stores user profiles, credentials, department affiliations, reputation scores, and badge arrays.
- **Skills:** Relates user profiles to specific competencies, categorized by skill type (`offered` vs `wanted`), proficiency level, and delivery mode.
- **Requests:** State-driven table managing connections between requesters and providers (`pending`, `accepted`, `rejected`, `completed`, `cancelled`).
- **Reviews:** Strict 1-to-1 association with completed requests, capturing numerical ratings (1-5) and textual evaluations.

### Native Database Constructs
1. **Triggers (`UpdateReputationOnReview`):**
   Executes `AFTER INSERT ON Reviews`. If a session receives a rating of 4 or higher, the mentor's reputation points automatically increment by 10 points directly within the database transaction, eliminating application-level race conditions.

2. **Deterministic Stored Functions (`GetAverageRating`):**
   Accepts a user UUID parameter and computes the exact decimal average rating based on all received reviews. Marked `DETERMINISTIC` for execution optimization.

3. **Stored Procedures with Date Logic (`ArchiveOldRequests`):**
   Automates data lifecycle maintenance by batch-updating stale requests in `pending` status older than a specified day threshold to `cancelled`.

4. **Iterative Cursors (`RecomputeAllReputations`):**
   Deploys an explicit database cursor looping over every registered user record to recalculate and reconcile reputation metrics against historical review ratings.

5. **Relational Views:**
   - `v_UserSummary`: Pre-joined view linking user identities with dynamically calculated average ratings.
   - `v_SkillCatalog`: Denormalized view joining skill records with provider department and profile metadata.
   - `v_PendingSkillRequests`: Operational view filtering unresolved requests for queue management.

---

## 4. Production Deployment Architecture

SkillBridge utilizes a dual-cloud decoupled architecture:

```text
                  +-----------------------------------+
                  |           Client Browser          |
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          | (Static Assets)                                   | (API Requests)
          v                                                   v
+-----------------------+                           +-----------------------+
|      Vercel CDN       |                           |  Render Web Service   |
| (skillbridges.dev)    |                           | (skillbridge-backend) |
| SPA Rewrite Enabled   |                           | Express 5 REST API    |
+-----------------------+                           +-----------+-----------+
                                                                |
                                                                | (TLS / SSL Connection)
                                                                v
                                                    +-----------------------+
                                                    |  Managed MySQL 8.0+   |
                                                    | (Aiven / Cloud Host)  |
                                                    | Triggers, Views, SPs  |
                                                    +-----------------------+
```

### Production Setup

1. **Database Provisioning:**
   - Provision a standard MySQL 8.0+ instance (e.g., Aiven, DigitalOcean Managed MySQL, Railway, AWS RDS).
   - Ensure the database user has routine and trigger execution privileges (`CREATE ROUTINE`, `TRIGGER`, `CREATE VIEW`).
   - Enable SSL/TLS connections.

2. **Backend Deployment (Render):**
   - Connect the repository to Render via the root Blueprint (`render.yaml`).
   - Supply the environment parameters in Render's dashboard (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`).
   - Configure `FRONTEND_URL` to point to your production frontend domain to enforce CORS policies.

3. **Frontend Deployment (Vercel):**
   - Connect the repository to Vercel.
   - Set the `VITE_API_URL` environment variable to the live Render backend URL (`https://skillbridge-backend-vjgo.onrender.com`).
   - Vercel automatically incorporates `vercel.json` to handle client-side routing rewrites for React Router.

---

## 5. Local Development Environment

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- MySQL 8.0 Server (Local instance, Docker, or Cloud connection)

### Backend Installation

```bash
cd backend
npm install
```

Configure your local environment by creating `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=skillbridge
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_SSL=false
DB_SYNC_ALTER=false
JWT_SECRET=development_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

Start the backend service:

```bash
npm run dev
```

### Frontend Installation

```bash
cd frontend
npm install
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.

---

## 6. Environment Configuration Reference

### Backend (`skillbridge-backend`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port on which Express listens |
| `NODE_ENV` | Required | `development` | Environment mode (`production` or `development`) |
| `JWT_SECRET` | Required | - | Secret key used for signing and verifying JSON Web Tokens |
| `DB_HOST` | Required | - | Fully qualified domain name or IP of the MySQL server |
| `DB_PORT` | Required | `3306` | Port assigned by the MySQL host |
| `DB_NAME` | Required | - | Name of the target relational database |
| `DB_USER` | Required | - | Database username with routine and trigger privileges |
| `DB_PASSWORD` | Required | - | Database authentication password |
| `DB_SSL` | Optional | `false` | Set to `true` for cloud providers requiring TLS/SSL (e.g., Aiven) |
| `DB_SYNC_ALTER` | Optional | `false` | Set to `true` only when explicit table alteration on boot is required |
| `FRONTEND_URL` | Required | - | Allowed origins for CORS validation (supports comma-separated values) |

### Frontend (`skillbridge-frontend`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Required | `/api` | Root endpoint of the backend API service |

---

## 7. RESTful API Specification

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Registers a new student account |
| POST | `/api/auth/login` | Public | Authenticates credentials and issues a JWT token |
| GET | `/api/auth/me` | Authenticated | Retrieves profile of currently authenticated user |
| GET | `/api/users/:id` | Public | Retrieves public profile information for a specified student |
| PUT | `/api/users/profile` | Authenticated | Updates personal profile, availability, and club affiliations |
| GET | `/api/skills` | Public | Queries catalog with filters (category, type, mode, keyword) |
| POST | `/api/skills` | Authenticated | Publishes a skill offered or wanted |
| GET | `/api/skills/user/:userId` | Public | Retrieves all skills listed by a specific student |
| GET | `/api/requests/my` | Authenticated | Fetches active sent and received session requests |
| POST | `/api/requests` | Authenticated | Submits a mentorship session booking request |
| PUT | `/api/requests/:id/respond` | Authenticated | Updates request status (`accepted` or `rejected`) |
| PUT | `/api/requests/:id/complete` | Authenticated | Flags an accepted session as completed |
| POST | `/api/reviews` | Authenticated | Submits rating and feedback for a completed session |
| GET | `/api/reviews/user/:userId` | Public | Retrieves reviews and ratings received by a mentor |
| GET | `/api/admin/stats` | Admin Only | Fetches aggregated platform metrics and totals |
| GET | `/api/admin/users` | Admin Only | Retrieves complete user roster for moderation |
| DELETE | `/api/admin/users/:id` | Admin Only | Deletes non-admin user records |
| GET | `/api/admin/database` | Admin Only | Fetches live database schema tables and row samples |
| GET | `/api/health` | Public | Health check endpoint returning service status and uptime |

---

## 8. Gamification & Reputation Model

Reputation points are accrued deterministically through verified mentorship sessions:

| Threshold (Points) | Merit Badge | Designation |
|---|---|---|
| 10 | Rising Mentor | Initial threshold unlocked upon receiving positive feedback |
| 50 | Campus Guide | Active mentor providing consistent guidance across cohorts |
| 100 | Skill Hero | Established mentor with high frequency of successful sessions |
| 200 | Community Builder | Advanced contributor driving cross-department peer learning |
| 500 | Top Mentor | Highest honor recognizing exceptional campus mentorship impact |

---

## 9. Security & Access Control

- **Password Cryptography:** User passwords are encrypted prior to persistence using `bcryptjs` with a work factor of 10 within Sequelize lifecycle hooks.
- **Stateless Authorization:** Authenticated routes enforce JSON Web Tokens (JWT) transmitted via standard `Authorization: Bearer <token>` headers.
- **Origin Isolation (CORS):** The backend CORS middleware restricts cross-origin traffic strictly to explicitly configured frontend domains.
- **SQL Injection Prevention:** All SQL interactions execute via Sequelize parameterized query generation or prepared statements.

---

## 10. License

This project is licensed under the MIT License.
