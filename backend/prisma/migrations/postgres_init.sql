-- ============================================================================
-- AURÉLIEN Haute Joaillerie & Elite Horlogerie — PostgreSQL Production Schema
-- Compatible with PostgreSQL 14+, Neon, Supabase, AWS RDS, Render Postgres
-- ============================================================================

-- Enable pgcrypto for UUID/CUID generation if desired
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Administrative Users (Phase 9 & 10 Suite)
CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) DEFAULT 'Admin',
    "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Legacy Users table (Boutique Staff)
CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS "categories" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "bannerUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products (Fine Creations Catalog)
CREATE TABLE IF NOT EXISTS "products" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "categoryId" VARCHAR(36) NOT NULL,
    "price" NUMERIC(14, 2),
    "currency" VARCHAR(10) DEFAULT 'USD',
    "purchaseUrl" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'published',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "purity" VARCHAR(20) DEFAULT '22K',
    "grossWeight" DOUBLE PRECISION,
    "netWeight" DOUBLE PRECISION,
    "stoneWeight" DOUBLE PRECISION DEFAULT 0,
    "makingCharges" DOUBLE PRECISION DEFAULT 0,
    "estimatedPrice" DOUBLE PRECISION,
    "hallmarkCertified" BOOLEAN DEFAULT true,
    "inStock" BOOLEAN DEFAULT true,
    "images" TEXT,
    "createdById" VARCHAR(36),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_products_category" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_products_user" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. Product Gallery Images
CREATE TABLE IF NOT EXISTS "product_images" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" VARCHAR(36) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" VARCHAR(255),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_product_images_product" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Customer Inquiries & Private Salon Requests
CREATE TABLE IF NOT EXISTS "inquiries" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" VARCHAR(255) NOT NULL DEFAULT 'Valued Client',
    "fullName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "phone" VARCHAR(50),
    "preferredKarat" VARCHAR(20),
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "productId" VARCHAR(36),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_inquiries_product" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Indices for optimal search & query performance
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products" ("categoryId");
CREATE INDEX IF NOT EXISTS "idx_products_status" ON "products" ("status");
CREATE INDEX IF NOT EXISTS "idx_products_isFeatured" ON "products" ("isFeatured");
CREATE INDEX IF NOT EXISTS "idx_products_price" ON "products" ("price");
CREATE INDEX IF NOT EXISTS "idx_product_images_product" ON "product_images" ("productId");
CREATE INDEX IF NOT EXISTS "idx_inquiries_status" ON "inquiries" ("status");
CREATE INDEX IF NOT EXISTS "idx_inquiries_createdAt" ON "inquiries" ("createdAt" DESC);
