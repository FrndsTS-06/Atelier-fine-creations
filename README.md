# ⚜️ ATELIER FINE CREATIONS / AURÉLIEN
### Haute Joaillerie, Bespoke Horlogerie & Handcrafted Leather

> An exquisite full-stack luxury jewelry atelier platform delivering an ultra-luxurious customer showcase, customizable gemstone & karatage filtering, private client inquiry dispatching, and a powerful administrative inventory control panel.

![AURÉLIEN Design Preview](docs/reference-design.png)

---

## 🌟 Architectural & Stack Highlights

- **Frontend Application**:
  - **Framework**: React 18+ powered by Vite & TypeScript (strict mode).
  - **Routing**: `react-router-dom` v6 with client SPA rewrites.
  - **Design System**: Luxury Atelier color palette (Obsidian `#0C0B09`, Champagne Gold `#C49A5A`, Ivory Cream `#F5F0E7`, Espresso `#352318`).
  - **Typography**: Cormorant Garamond / Playfair Display editorial serif typography paired with clean Inter sans-serif interface controls.
  - **Icons**: `lucide-react` vector iconography.
  - **Form Validation**: `react-hook-form` with `@hookform/resolvers` and `zod`.
  - **Production Optimization**: Manual vendor chunk splitting (`react`, `react-router-dom`, `lucide-react`), lazy loading, async decoding, and reserved image dimensions.

- **Backend REST API**:
  - **Engine**: Node.js v20+ with Express and TypeScript in strict mode.
  - **Security & Headers**: `helmet` security headers (CSP, HSTS), strict `cors` domain whitelisting, and in-memory token-bucket rate limiting.
  - **Authentication**: Cryptographically signed JSON Web Tokens (JWT) with salted `bcryptjs` password hashing and role-based access control (`ADMIN`, `SUPER_ADMIN`).
  - **ORM & Database**: Prisma ORM with SQLite for zero-config local development and out-of-the-box PostgreSQL support for production.
  - **Input Validation**: Strict runtime schema validation using `zod`.

- **Quality Assurance**:
  - **Automated Tests**: 71 automated tests passing (100% pass rate) across unit, component, API integration, security headers, and live E2E server journeys.
  - **Type Safety**: Full TypeScript compilation (`tsc --noEmit`) with 0 errors across frontend and backend.
  - **Linting**: ESLint flat configuration with 0 errors and 0 warnings.

---

## 📂 Repository Layout

```text
├── docs/                             # System architecture, API specs, schemas, and manuals
│   ├── reference-design.png          # Visual reference target
│   ├── architecture.md               # End-to-end system architecture
│   ├── api-documentation.md          # REST API specifications and endpoints
│   ├── database-schema.md            # Database schema, entities, and ERD
│   ├── deployment-guide.md           # Production cloud deployment guide
│   ├── admin-user-guide.md           # Boutique manager operations manual
│   ├── backup-and-recovery.md        # Disaster recovery and snapshot procedures
│   └── troubleshooting-guide.md      # Production diagnostic matrix
├── frontend/                         # React + Vite + TypeScript luxury storefront
│   ├── src/
│   │   ├── components/               # Design system & modular UI components
│   │   ├── config/env.ts             # Zod-validated client environment variables
│   │   ├── hooks/                    # Custom data-fetching and interaction hooks
│   │   ├── pages/                    # Public pages and Admin suite views
│   │   ├── services/                 # Central typed API client & service layer
│   │   └── styles/                   # Luxury typography, variables & global styles
│   ├── vercel.json                   # Vercel deployment routing & caching headers
│   ├── Dockerfile                    # Production Nginx container
│   ├── nginx.conf                    # Nginx SPA configuration
│   └── vite.config.ts                # Vite build config with vendor chunk splitting
├── backend/                          # Express + TypeScript + Prisma REST API
│   ├── src/
│   │   ├── config/                   # Environment, CORS, and security config
│   │   ├── controllers/              # Business logic handlers
│   │   ├── middleware/               # Auth, rate limiting, and error handling
│   │   ├── routes/                   # Versioned REST API routes (/api/v1)
│   │   └── server.ts                 # Server bootstrap entrypoint
│   ├── prisma/
│   │   ├── schema.prisma             # Multi-provider schema (SQLite / PostgreSQL)
│   │   ├── seed.ts                   # Atelier catalog and admin seeder
│   │   └── migrations/               # Production SQL migration scripts
│   └── Dockerfile                    # Production Node.js multi-stage container
├── docker-compose.prod.yml           # Production self-hosted full-stack compose
├── render.yaml                       # Render Infrastructure-as-Code manifest
└── README.md
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20 LTS recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Install dependencies across both client and server:
```bash
npm install
```

### 3. Environment Variables Setup
Initialize local environment files from the provided templates:
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### 4. Database Setup & Seeding
Initialize the Prisma client, synchronize tables, and seed catalog items:
```bash
cd backend
npx prisma generate
npx prisma db push
npm run prisma:seed
cd ..
```

### 5. Running the Application
Start both the backend API and frontend dev server concurrently:
```bash
npm run dev:all
```
- **Frontend Showcase**: [http://localhost:5173](http://localhost:5173)
- **Admin Management Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - Default Admin: `admin@aurelien.gold`
  - Default Password: `AdminPassword123!`
- **API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## ⚙️ Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default (Dev) | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `5000` | `5000` | Port for the Express HTTP server |
| `NODE_ENV` | `development` | `production` | Environment mode (`development`, `production`, `test`) |
| `DATABASE_URL` | `file:./dev.db` | `postgresql://user:pass@host:5432/db?sslmode=require` | Database connection URI |
| `JWT_SECRET` | *(development fallback)* | *(64+ random characters)* | Cryptographic signing key for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | `7d` | Admin session token validity duration |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://aurelien.gold` | Whitelisted frontend origin |
| `ADMIN_DEFAULT_EMAIL` | `admin@aurelien.gold` | `admin@aurelien.gold` | Default initial administrator email |
| `ADMIN_DEFAULT_PASSWORD` | `AdminPassword123!` | *(Secure secret)* | Initial administrator seed password |

### Frontend (`frontend/.env`)

| Variable | Default (Dev) | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | `https://api.aurelien.gold/api/v1` | Base URL of the backend API |
| `VITE_ENABLE_MOCK_FALLBACK`| `true` | `false` | Explicitly disables fake data fallbacks in production |

---

## 🛠️ Monorepo Commands

| Command | Action |
| :--- | :--- |
| `npm run dev:all` | Concurrently boots backend (port 5000) and frontend (port 5173) |
| `npm run dev:frontend` | Starts Vite dev server with instant hot-reload |
| `npm run dev:backend` | Starts Express backend server with watch mode |
| `npm run typecheck` | Executes TypeScript type checking (`tsc --noEmit`) across both workspaces |
| `npm run lint` | Runs ESLint and type linting across frontend and backend |
| `npm test` | Runs the unified 71-test automated suite (unit, integration, security, E2E) |
| `npm run build` | Compiles production bundles for both backend and frontend |

---

## 🌐 Production Deployment Summary

### 1. Managed PostgreSQL
1. Create a PostgreSQL 14+ instance on **Supabase**, **Neon**, **Render**, or **AWS RDS**.
2. Apply the production schema using either:
   - `npx prisma db push` (from `backend/` with `DATABASE_URL` configured)
   - Or direct execution of `backend/prisma/migrations/postgres_init.sql`.

### 2. Frontend to Vercel
1. Link the repository to **Vercel** with Root Directory set to `frontend`.
2. Framework Preset: `Vite`. Build Command: `npm run build`. Output Directory: `dist`.
3. Set environment variable: `VITE_API_BASE_URL=https://api.aurelien.gold/api/v1`.
4. Deploy. Vercel automatically uses `frontend/vercel.json` for SPA rewrites and asset cache-control.

### 3. Backend API to Render / Railway / Docker
1. Link repository with Root Directory set to `backend`.
2. Build Command: `npm install && npx prisma generate && npm run build`.
3. Start Command: `node dist/server.js`.
4. Set production environment variables (see table above).
5. Health Check Path: `/api/v1/health`.

### 4. Custom Domain & DNS Records
- **Root Domain (`aurelien.gold`)**: `A` record pointing to Vercel IP `76.76.21.21`.
- **Subdomain (`www.aurelien.gold`)**: `CNAME` record pointing to `cname.vercel-dns.com`.
- **API Subdomain (`api.aurelien.gold`)**: `CNAME` record pointing to your backend host (e.g. `aurelien-api.onrender.com`).

For step-by-step instructions, see the complete [Production Deployment Guide](docs/deployment-guide.md).

---

## 👑 Admin & Catalog Management

1. Navigate to `/admin/login` and log in with your administrator credentials.
2. **Product Catalog**: Add, edit, publish/draft toggle, and delete jewelry items with certified purity, weight, pricing, and high-resolution images.
3. **External Purchase Links**: Configure custom checkout or boutique URLs (e.g. Stripe checkout) to activate direct **"Buy Now"** actions for clients.
4. **Inquiry Concierge**: Track client consultation requests (`PENDING`, `CONTACTED`, `SCHEDULED`, `CLOSED`) and save internal notes.

For the complete operations manual, see the [Admin User Guide](docs/admin-user-guide.md).

---

## 📚 Complete Documentation Index

- [System Architecture](docs/architecture.md)
- [REST API Specifications](docs/api-documentation.md)
- [Database Schema & ERD](docs/database-schema.md)
- [Production Deployment Guide](docs/deployment-guide.md)
- [Admin User Guide](docs/admin-user-guide.md)
- [Backup & Recovery Procedures](docs/backup-and-recovery.md)
- [Troubleshooting & Diagnostics](docs/troubleshooting-guide.md)
