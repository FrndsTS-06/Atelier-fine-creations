# Multi-stage build for frontend production SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and package manifests
COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm ci

# Copy frontend source and configs
COPY frontend ./frontend/

WORKDIR /app/frontend

# Build Vite SPA
RUN npm run build

# Nginx production web server
FROM nginx:alpine AS runner

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
