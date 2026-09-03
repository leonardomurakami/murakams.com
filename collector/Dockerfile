# syntax=docker/dockerfile:1.7
#
# Infra collector image. Compiles the standalone collector + sanitizer (no
# external runtime dependencies — only Node built-ins) and runs the publish
# entrypoint on a CronJob schedule.
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm exec tsc -p collector/tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 collector
COPY --from=builder --chown=collector:nodejs /app/collector/dist ./dist
USER collector
CMD ["node", "dist/collector/publish.js"]
