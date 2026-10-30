# 🔍 Production Operations & Troubleshooting Guide

This guide provides fast diagnostic procedures and resolutions for common production challenges in **ATELIER FINE CREATIONS / AURÉLIEN**.

---

## 1. Quick Diagnostics Matrix

| Symptom | Probable Cause | Diagnostic Command | Immediate Resolution |
| :--- | :--- | :--- | :--- |
| **API returns 502 / 503 Bad Gateway** | Node.js process crashed or database unreachable | `curl -i https://api.aurelien.gold/api/v1/health` | Inspect container logs; verify `DATABASE_URL` connectivity. |
| **CORS Policy Error in Browser Console** | Misconfigured `CORS_ORIGIN` on backend | Inspect `Access-Control-Allow-Origin` response header | Ensure backend `CORS_ORIGIN` matches frontend domain exactly (e.g. `https://aurelien.gold`). |
| **Admin Login returns 429 Too Many Requests** | Rate limiter triggered by failed attempts (5 in 15m) | Check `/auth/login` response body | Wait 15 minutes or reboot the backend instance to clear in-memory rate-limiter bucket. |
| **Single-Page App 404 on refresh** | Web server missing SPA rewrite rules | Request `/gallery` directly via browser | Ensure `vercel.json` rewrites or Nginx `try_files $uri $uri/ /index.html;` is active. |
| **Images failing to load** | Missing asset path or broken external CDN link | Check Network tab for 404 or SSL handshake errors | Verify image URL exists; check CORS / hotlinking rules if using external image CDN. |
| **Inquiry submissions failing (500)** | Prisma disconnected from database or missing table | Inspect server logs for `P2021: Table does not exist` | Run `npx prisma db push` or apply `postgres_init.sql`. |

---

## 2. Health Check Inspection

### Public Health Check
```bash
curl -i https://api.aurelien.gold/api/v1/health
```

**Expected Healthy Response:**
```json
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-26T21:15:00.000Z",
    "database": "connected"
  }
}
```

If `"database": "disconnected"`, check:
1. Is PostgreSQL running and accepting connections?
2. Does the connection string include `?sslmode=require`?
3. Has the managed database IP whitelist allowed the API server IP (or `0.0.0.0/0` with secure password)?

---

## 3. Database Migration & Schema Issues

### Error: `P1001: Can't reach database server`
- Check network firewall rules.
- Test connection using `psql`:
  ```bash
  psql "${DATABASE_URL}"
  ```

### Error: `P2002: Unique constraint failed`
- Occurs if attempting to insert duplicate slugs in `products` or duplicate emails in `admin_users`.
- Ensure slugs are unique or auto-append timestamp suffixes.

---

## 4. Resetting the Initial Administrator Account

If the administrator password is lost or locked:
```bash
cd backend
# Execute the seed script to reset/re-upsert the default administrator
ADMIN_DEFAULT_PASSWORD="NewSecurePassword2026!" npm run prisma:seed
```

---

## 5. Performance Diagnostics

- **Frontend Bundle Size**: Verify Vite bundle sizes via `npm run build`. Large vendor chunks should stay separated.
- **Image Optimization**: Ensure hero images use modern `.webp` / `.jpg` formats and below-the-fold images include `loading="lazy"`.
- **Database Indexing**: Check slow queries via PostgreSQL `pg_stat_statements`. Ensure indexes on `categoryId`, `status`, and `createdAt` are present.
