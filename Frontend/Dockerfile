# ── Deps ────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Dev Server ──────────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173

ENV VITE_API_TARGET=http://backend:3001

CMD ["npx", "vite", "--host", "0.0.0.0"]
