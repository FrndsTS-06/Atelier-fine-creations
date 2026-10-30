# 🛡️ Database Backup, Recovery, and Disaster Preparedness Guide

This guide establishes backup policies, automated snapshot schedules, manual export routines, and disaster recovery procedures for **ATELIER FINE CREATIONS / AURÉLIEN**.

---

## 1. Backup Strategy Overview

| Tier | Method | Frequency | Retention Period | Storage Location |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Automated Snapshots)** | Provider Managed (Supabase / Neon / Render / AWS RDS) | Continuous / Daily | 7 to 30 Days | Managed Cloud Storage |
| **Tier 2 (Logical SQL Dumps)** | Automated cron job via `pg_dump` | Daily at 02:00 UTC | 90 Days | Encrypted S3 / Cloudflare R2 Bucket |
| **Tier 3 (Pre-Deployment Snapshots)** | Manual snapshot before schema migrations | Ad-hoc | Kept until migration verified | Local secure offline & Cloud |

---

## 2. Automated Logical Backups (`pg_dump`)

### Daily Backup Script
Execute via scheduled GitHub Action, Render Cron Job, or Linux cron:

```bash
#!/bin/bash
set -e

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/aurelien"
BACKUP_FILE="${BACKUP_DIR}/aurelien_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "Starting PostgreSQL backup: ${BACKUP_FILE}..."

# Export compressed plain-text SQL schema and data
pg_dump "${DATABASE_URL}" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    | gzip > "${BACKUP_FILE}"

echo "Backup created successfully ($(du -h "${BACKUP_FILE}" | cut -f1))."

# Retain backups for 30 days locally
find "${BACKUP_DIR}" -name "aurelien_backup_*.sql.gz" -mtime +30 -exec rm {} \;
```

---

## 3. Disaster Recovery & Restoration Procedure

### Scenario A: Rollback to Point-in-Time (Provider Managed)
1. Open cloud provider dashboard (e.g. Supabase or AWS RDS console).
2. Select **Database** -> **Backups & PITR**.
3. Choose the target restoration timestamp immediately prior to the failure or errant transaction.
4. Confirm point-in-time clone and re-point `DATABASE_URL` in the API host settings.

### Scenario B: Restoring from `pg_dump` Archive
To restore into a fresh PostgreSQL instance:

```bash
# 1. Unpack compressed dump
gunzip -c aurelien_backup_YYYYMMDD_HHMMSS.sql.gz > restore.sql

# 2. Execute SQL restoration
psql "${TARGET_DATABASE_URL}" -f restore.sql

# 3. Verify record counts
psql "${TARGET_DATABASE_URL}" -c "SELECT count(*) FROM products;"
psql "${TARGET_DATABASE_URL}" -c "SELECT count(*) FROM categories;"
psql "${TARGET_DATABASE_URL}" -c "SELECT count(*) FROM inquiries;"
```

---

## 4. SQLite Development Backup (Local Testing)
For local development using SQLite:
```bash
# SQLite online safe backup
sqlite3 backend/prisma/dev.db ".backup 'backend/prisma/dev_backup_$(date +%Y%m%d).db'"
```

---

## 5. Recovery Verification Drills
Run a restoration drill quarterly:
1. Spin up a temporary staging database container or ephemeral cloud instance.
2. Restore the latest backup archive into the staging instance.
3. Run `npm test` against the restored staging database to confirm schema and data validity.
4. Tear down staging instance upon successful drill sign-off.
