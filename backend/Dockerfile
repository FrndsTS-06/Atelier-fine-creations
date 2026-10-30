# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and package manifests
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy backend source, prisma schema, and config
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma/
COPY backend/src ./backend/src/

# Generate Prisma client and compile TypeScript to JavaScript
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy root manifests
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled artifacts from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/backend

EXPOSE 5000

# Run prisma db push/migration check then start server
CMD ["sh", "-c", "npx prisma generate && node dist/server.js"]
