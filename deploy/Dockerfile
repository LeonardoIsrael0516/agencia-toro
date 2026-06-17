# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY api/package.json api/

RUN npm ci --workspace=@agencia-toro/api --workspace=@agencia-toro/shared --include-workspace-root

COPY packages/shared packages/shared
COPY api api

RUN npm run build -w @agencia-toro/shared && npm run build -w @agencia-toro/api

FROM node:22-bookworm-slim AS prod-deps

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY api/package.json api/

RUN npm ci --workspace=@agencia-toro/api --workspace=@agencia-toro/shared --include-workspace-root --omit=dev

FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

COPY api/package.json api/
COPY --from=builder /app/api/dist ./api/dist
COPY api/drizzle.config.ts api/drizzle.config.ts
COPY api/src/db/schema.ts api/src/db/schema.ts

COPY --from=prod-deps /app/node_modules ./node_modules

WORKDIR /app/api

ENV NODE_ENV=production

RUN mkdir -p /app/api/data \
  && chown -R node:node /app /app/api/data

USER node

EXPOSE 3333

VOLUME ["/app/api/data"]

CMD ["node", "dist/index.js"]
