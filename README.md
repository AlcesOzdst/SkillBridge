# SkillBridge 🚀

> **A campus peer-to-peer skill exchange and mentorship platform.**  
> Find mentors, offer skills, book sessions, earn reputation, and build your campus legacy.

---

## 🧩 What is SkillBridge?

SkillBridge is a robust full-stack web platform built for high-performance University deployment where students can:
- List skills they **offer** (teaching/mentoring) or **want** to learn.
- **Search** other students across the campus by skill, department, or year.
- **Send session requests** natively through the feed, and accept/reject them via unified dashboards.
- **Mark sessions complete** and leave **reviews**.
- **Earn reputation points** and automatically unlock dynamic **badges**.
- **Administrators** can visualize live database rows directly from the application layer.

---

## 🛠️ Tech Stack

This project was entirely re-architected from MongoDB to a highly structured Relational Database model.

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 | High-speed component rendering under a custom Dark Glassmorphism aesthetic. |
| **Backend** | Node.js + Express.js | Robust API handling CORS processing for secure domain communication. |
| **Database** | MySQL + Sequelize ORM | Enforces strict schema integrity using declarative UUID primary bounds. |
| **Auth** | JWT + bcryptjs | Secure server-side credential verification and protected routing. |
| **Icons** | Lucide React | High-quality visual indicators. |

---

## 📊 Advanced Relational Database Architecture
*This project specifically fulfills rigorous academic database requirements!*

Rather than relying purely on Node.js processing, the `skillbridge` MySQL server handles advanced native computations via the custom `advanced_sql.js` injector built into the system core:

1. **Triggers:** A native `UpdateReputationOnReview` Trigger binds directly to the `Reviews` table to securely increase reputation mathematically without Application Layer intervention locking data states.
2. **Deterministic Functions:** Uses dynamic `GetAverageRating` compiled algorithms to execute exact decimal rating averages seamlessly.
3. **Stored Procedures with Date Logic:** Implements an automated `ArchiveOldRequests` Garbage Collector that administrators can invoke to mass-clear pending requests from previous years/days.
4. **Cursors:** Deploys a rigorous `RecomputeAllReputations` looping pointer that iteratively spans every registered User row within the `Users` table mapping to mass-calculate system metrics.

---

## ⚡ Deployment & Running Locally

### Prerequisites
- Node.js 18+
- MySQL Server (XAMPP, Aiven, or Local Instance)

### Backend (MySQL Boot)
```bash
cd backend
npm install
# Set your .env file:
#   DB_HOST=127.0.0.1
#   DB_USER=root
#   DB_PASSWORD=yourpassword
#   DB_NAME=skillbridge
#   JWT_SECRET=super_secret_dev_key
#   PORT=5000
npm run dev
```
> **Note:** Because of the `advanced_sql.js` synchronization block, launching `npm run dev` will automatically build the tables and inject the Cursors and Procedures directly into your localized MySQL instance!

### Frontend (React/Vite Boot)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs dynamically on `http://localhost:5173`. If hosted in production on Vercel, the Axios system automatically switches to mapping to your `VITE_API_URL` environment domain logic!

---

## 🏆 Reputation & Badges

The MySQL Trigger directly assigns points after each completed session. The frontend seamlessly parses these bounds to assign prestige badges mathematically:

| Points | Badge |
|---|---|
| 10 | 🌱 Rising Mentor |
| 50 | 🧭 Campus Guide |
| 100 | ⚡ Skill Hero |
| 200 | 🏗️ Community Builder |
| 500 | 🏆 Top Mentor |

---

## 🔌 API Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new student |
| POST | `/api/auth/login` | — | Login + get JWT |
| GET | `/api/users/:id` | — | Get user profile |
| POST | `/api/skills` | 🔒 | Add a skill |
| GET | `/api/skills` | — | Browse skills (with dynamic request parameters) |
| POST | `/api/requests` | 🔒 | Send session request (deep-links to UI Modals) |
| GET | `/api/admin/stats` | 🔒👑 | Platform metrics |
| GET | `/api/admin/database` | 🔒👑 | MySQL Data Viewer pipeline logic |

---

## 📄 License

MIT — Built as a highly structured Academic final-year project by the SkillBridge team.
