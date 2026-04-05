# SkillBridge 🚀

> **A campus peer-to-peer skill exchange and mentorship platform.**  
> Find mentors, offer skills, book sessions, earn reputation, and build your campus legacy.

---

## 🧩 What is SkillBridge?

SkillBridge is a full-stack web platform where students can:
- List skills they **offer** (teaching/mentoring)
- List skills they **want** to learn
- **Search** other students by skill, department, or year
- **Send session requests** and accept/reject them
- **Mark sessions complete** and leave **reviews**
- **Earn reputation points** and unlock **badges**
- View a rich **profile page** with their skills, reviews, and badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Icons | Lucide React |

---

## 📁 Folder Structure

```
SkillBridge/
├── backend/
│   └── src/
│       ├── config/         # DB connection
│       ├── controllers/    # auth, user, skill, request, review, admin
│       ├── middlewares/    # JWT protect, adminOnly
│       ├── models/         # User, Skill, Request, Review
│       ├── routes/         # All API routes
│       ├── utils/          # generateToken
│       └── server.js
└── frontend/
    └── src/
        ├── api/            # Axios configured instance
        ├── components/     # Navbar, cards, guards, badges
        ├── context/        # AuthContext
        ├── pages/          # All page components
        ├── App.jsx
        └── index.css       # Full design system
```

---

## ⚡ Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas)

### Backend
```bash
cd backend
npm install
# Set your .env:
#   MONGO_URI=mongodb://localhost:27017/skillbridge
#   JWT_SECRET=your_secret_key
#   PORT=5000
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` → `http://localhost:5000`.

---

## 🔌 API Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new student |
| POST | `/api/auth/login` | — | Login + get JWT |
| GET | `/api/auth/me` | 🔒 | Get current user |
| GET | `/api/users/:id` | — | Get user profile |
| PUT | `/api/users/profile` | 🔒 | Update own profile |
| GET | `/api/users/search` | — | Search users by skill |
| POST | `/api/skills` | 🔒 | Add a skill |
| GET | `/api/skills` | — | Browse skills (with filters) |
| GET | `/api/skills/user/:id` | — | Get skills for a user |
| PUT | `/api/skills/:id` | 🔒 | Update own skill |
| DELETE | `/api/skills/:id` | 🔒 | Delete own skill |
| POST | `/api/requests` | 🔒 | Send session request |
| GET | `/api/requests/my` | 🔒 | Get sent + received requests |
| PUT | `/api/requests/:id/respond` | 🔒 | Accept/reject request |
| PUT | `/api/requests/:id/complete` | 🔒 | Mark session complete |
| PUT | `/api/requests/:id/cancel` | 🔒 | Cancel request |
| POST | `/api/reviews` | 🔒 | Leave review (auto-updates rep.) |
| GET | `/api/reviews/user/:id` | — | Get all reviews for a user |
| GET | `/api/admin/stats` | 🔒👑 | Platform stats |
| GET | `/api/admin/users` | 🔒👑 | All users |
| DELETE | `/api/admin/users/:id` | 🔒👑 | Delete a user |

---

## 🏆 Reputation & Badges

After each completed session, the mentor earns:
- **+10 base points** for session completion
- **+0 to +4 bonus** based on star rating (5★ = +4)

| Points | Badge |
|---|---|
| 10 | 🌱 Rising Mentor |
| 50 | 🧭 Campus Guide |
| 100 | ⚡ Skill Hero |
| 200 | 🏗️ Community Builder |
| 500 | 🏆 Top Mentor |

---

## 📄 License

MIT — Built as a final-year project by the SkillBridge team.
