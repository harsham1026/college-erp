# 🎓 College ERP — AI-Powered Smart Campus Management

<div align="center">

**Enterprise Resource Planning for Modern Educational Institutions**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)

</div>

---

## ✨ Features

### 14 User Roles
Super Admin · Principal · Vice Principal · HOD · Teacher · Student · Parent · Accountant · Librarian · Placement Officer · Hostel Warden · Transport Manager · Receptionist · Exam Controller

### 30+ Modules
- **Academics**: Attendance, Homework, Assignments, Exams, Results, Timetable
- **Finance**: Fees, Payments, Scholarships, Salary, Invoices
- **Library**: Books, Issue/Return, Digital Library, Reservations
- **Hostel**: Rooms, Allocation, Complaints
- **Transport**: Buses, Routes, Drivers
- **Placement**: Companies, Drives, Applications, Offers
- **Communication**: Announcements, Notifications, Messages, Forums
- **AI Features**: Chatbot, Study Planner, Question Paper Generator, Performance Prediction

### Premium UI
- Apple-inspired minimal design
- Dark/Light mode
- Glassmorphism & micro-animations
- Fully responsive
- Recharts analytics dashboards

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis (optional, for caching)

### 1. Clone & Install

```bash
git clone <repo-url>
cd college-erp

# Install dependencies
cd apps/server && npm install
cd ../web && npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database

```bash
cd apps/server
npx prisma db push
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd apps/server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd apps/web && npm run dev
```

### 5. Open Browser
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@collegeerp.com | Admin@123 |
| Principal | principal@collegeerp.com | Principal@123 |
| Teacher | priya.sharma@collegeerp.com | Teacher@123 |
| Student | rahul.verma@student.collegeerp.com | Student@123 |
| Accountant | accountant@collegeerp.com | Staff@123 |
| Librarian | librarian@collegeerp.com | Staff@123 |

---

## 🐳 Docker

```bash
cd docker
docker-compose up -d
```

This starts PostgreSQL, Redis, backend, and frontend.

---

## 📁 Project Structure

```
college-erp/
├── apps/
│   ├── web/          # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/          # Pages (App Router)
│   │   │   ├── components/   # Reusable components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── lib/          # Utilities
│   │   │   └── services/     # API layer
│   │   └── package.json
│   │
│   └── server/       # Express.js Backend
│       ├── src/
│       │   ├── config/       # Database, Redis, Logger
│       │   ├── controllers/  # Route handlers
│       │   ├── middleware/   # Auth, validation, errors
│       │   ├── routes/       # API routes
│       │   ├── services/     # Business logic
│       │   └── app.ts        # Entry point
│       ├── prisma/
│       │   ├── schema.prisma # 50+ models
│       │   └── seed.ts       # Demo data
│       └── package.json
│
├── packages/
│   └── shared/       # Shared types, validators, constants
│
├── docker/           # Docker configuration
├── .env.example      # Environment template
└── README.md
```

---

## 🔌 API Endpoints

| Module | Route | Methods |
|--------|-------|---------|
| Auth | `/api/auth/*` | POST, GET |
| Colleges | `/api/colleges` | CRUD |
| Departments | `/api/departments` | CRUD |
| Courses | `/api/courses` | CRUD |
| Subjects | `/api/subjects` | CRUD |
| Students | `/api/students` | CRUD |
| Teachers | `/api/teachers` | CRUD |
| Attendance | `/api/attendance` | POST, GET |
| Homework | `/api/homework` | CRUD |
| Assignments | `/api/assignments` | CRUD |
| Exams | `/api/exams` | CRUD |
| Fees | `/api/fees` | CRUD |
| Payments | `/api/payments` | CRUD |
| Library | `/api/library/*` | CRUD |
| Hostel | `/api/hostel/*` | CRUD |
| Transport | `/api/transport/*` | CRUD |
| Placement | `/api/placement/*` | CRUD |
| Dashboard | `/api/dashboard/*` | GET |
| Notifications | `/api/notifications` | CRUD |
| Announcements | `/api/announcements` | CRUD |

---

## 🛡️ Security

- Password hashing (bcrypt, 12 rounds)
- JWT access + refresh tokens
- HTTP-only cookies
- Role-based access control
- Rate limiting
- Input validation (Zod)
- Helmet security headers
- CORS configuration

---

## 📄 License

MIT
