# 🚀 Production Deployment & Infrastructure Manual
**ATELIER FINE CREATIONS / AURÉLIEN Haute Joaillerie & Horlogerie**

This comprehensive guide covers deploying the production stack to cloud infrastructure:
- **Frontend SPA**: Vercel (or Cloudflare Pages / Netlify / Nginx)
- **Backend API**: Render (or Railway / AWS ECS / Fly.io / Docker)
- **Database**: Managed PostgreSQL (Supabase / Neon / AWS RDS / Render Postgres)
- **CDN & Media**: Modern WebP assets / Cloudinary / AWS S3

---

## 1. Cloud Architecture Overview

```text
[ Client Browser / Mobile / Tablet ]
                  │
                  ▼
         [ Cloudflare / DNS ]
          ├── aurelien.gold       ──> [ Vercel Edge CDN (Frontend SPA) ]
          └── api.aurelien.gold   ──> [ Node.js Express API Container ]
                                              │
                                              ▼
                                 [ Managed PostgreSQL (SSL) ]
```

---

## 2. Phase-by-Phase Deployment Instructions

### Phase 1: Provision Managed PostgreSQL
1. Create a PostgreSQL 14+ database instance on **Supabase**, **Neon**, **Render**, or **AWS RDS**.
2. Enable SSL connections (`sslmode=require`).
3. Note the connection URI:
   ```text
   postgresql://<db_user>:<db_password>@<db_host>:5432/<db_name>?sslmode=require
   ```
4. Apply the database schema:
   - **Option A (Prisma)**: Set `DATABASE_URL` in `backend/.env` and update `provider = "postgresql"` in `backend/prisma/schema.prisma`, then run:
     ```bash
     cd backend
     npx prisma db push
     npm run prisma:seed
     ```
   - **Option B (Direct SQL Script)**: Open the database SQL console and run the prepared script:
     `backend/prisma/migrations/postgres_init.sql`

---

### Phase 2: Deploy the Backend REST API (Render / Railway)

#### Deploying on Render (PaaS)
1. In the Render Dashboard, choose **New Web Service** and link your Git repository.
2. Select Root Directory: `backend`.
3. Set Environment: `Node`.
4. Configure Build & Start commands:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Health Check Path**: `/api/v1/health`
5. Configure Environment Variables:
   | Variable | Value / Format | Purpose |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production security & logging modes |
   | `PORT` | `5000` | Listening HTTP port |
   | `DATABASE_URL` | `postgresql://...` | Connection URI to managed PostgreSQL |
   | `JWT_SECRET` | *(64+ random characters)* | Cryptographic key for admin tokens |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration period |
   | `CORS_ORIGIN` | `https://aurelien.gold` | Whitelisted frontend domain |
   | `ADMIN_DEFAULT_EMAIL` | `admin@aurelien.gold` | Initial administrator login |
   | `ADMIN_DEFAULT_PASSWORD` | *(Secure initial password)* | Initial administrator secret |

#### Deploying via Docker / Self-Hosted Host
Use the provided multi-stage container:
```bash
docker build -t aurelien-api:prod -f backend/Dockerfile .
docker run -d -p 5000:5000 --env-file backend/.env.production aurelien-api:prod
```

---

### Phase 3: Deploy the Frontend SPA (Vercel)

1. In the **Vercel Dashboard**, click **Add New Project** and select the repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Environment Variables:
   | Variable | Value | Purpose |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://api.aurelien.gold/api/v1` | Production API endpoint |
   | `VITE_ENABLE_MOCK_FALLBACK` | `false` | Explicitly disables fake data in production |
4. Click **Deploy**. Vercel will automatically read `frontend/vercel.json` for SPA routing and asset caching headers.

---

### Phase 4: DNS, Domain & HTTPS Configuration

Configure DNS records with your registrar or DNS provider (Cloudflare, Namecheap, Route53):

| Type | Name / Host | Target / Destination | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` (apex) | `76.76.21.21` (Vercel IP) | Root domain resolution (`aurelien.gold`) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Subdomain resolution (`www.aurelien.gold`) |
| **CNAME** | `api` | `aurelien-api.onrender.com` (or Railway host) | Backend API endpoint |

#### HTTPS & SSL Termination
- Vercel and Render automatically provision and renew **Let's Encrypt SSL certificates**.
- Force HTTPS redirection is enabled by default.
- Strict-Transport-Security (HSTS) headers are emitted by the Express API and Vercel routing layer.

---

### Phase 5: Image Hosting & Asset Optimization

1. **Current Static Assets**: High-resolution jewelry, watch, and atelier photography reside in `frontend/public/images/`.
2. **CDN Delivery**: Vercel's global Edge Network automatically compresses and caches static images with 1-year immutable headers (`Cache-Control: public, max-age=31536000`).
3. **Dynamic Admin Uploads**: When uploading new creations via the Admin Suite, use image URLs hosted on a secure CDN (e.g. Cloudinary, AWS S3 with CloudFront, or Vercel Blob).

---

## 3. Post-Deployment Verification Checklist

Verify each of the following endpoints and user flows immediately after deployment:

- [ ] **API Health Check**:
  ```bash
  curl -i https://api.aurelien.gold/api/v1/health
  # Must return HTTP 200 OK with {"database": "connected"}
  ```
- [ ] **Home Page**: Navigate to `https://aurelien.gold/`. Verify hero, navigation, collections, craftsmanship story, and featured product grid.
- [ ] **Gallery Page**: Test search box, category filters (Rings, Watches, Straps), sorting, and image lightbox.
- [ ] **About Page**: Verify editorial brand narrative, artisan photography, and CTAs.
- [ ] **Contact Page**: Submit a test inquiry. Confirm success toast appears and check that inquiry persists in `/api/v1/inquiries`.
- [ ] **Admin Authentication**: Access `https://aurelien.gold/admin/login` and authenticate.
- [ ] **Admin Inventory Management**: Create, edit, toggle published status, and verify in the public gallery.
- [ ] **Mobile Responsiveness**: Test at 375px (hamburger menu drawer and stacked cards).

---

## 4. Rollback and Redeployment Procedures

### Frontend Rollback (Zero-Downtime)
1. In Vercel, navigate to **Deployments**.
2. Locate the previous stable production deployment.
3. Click **Instant Rollback**. Vercel will instantaneously shift edge traffic to the previous build (< 1 second).

### Backend API Rollback
1. In Render or Railway, select the **Deployments** tab.
2. Select the previous stable commit or release tag and click **Rollback**.
3. If database migrations were applied, verify that changes were backward-compatible (non-destructive field additions).

### Safe Database Migration Rules
1. **Never drop columns or tables** in a live production deployment without a deprecation window.
2. **Add columns as nullable** or with safe default values.
3. Always verify point-in-time recovery before executing structural schema updates.
