FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=@school/shared-types \
    && npm run db:generate --workspace=@school/api \
    && npm run build --workspace=@school/api

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
RUN npm ci --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache wget
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy Prisma client correctly
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma.config.ts apps/api/prisma.config.ts
COPY apps/api/prisma apps/api/prisma
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY --from=builder /app/packages/shared-types/dist packages/shared-types/dist
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json

RUN chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
