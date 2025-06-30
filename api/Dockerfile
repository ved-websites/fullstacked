FROM arm64v8/node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable

# ====================

FROM base AS build

COPY . .

RUN --mount=type=cache,id=pnpm,target=$PNPM_HOME/store pnpm install --frozen-lockfile

RUN pnpm run build

RUN pnpm exec prisma generate
RUN rm -r /app/dist/_generated/prisma
RUN mv /app/src/_generated/prisma /app/dist/_generated/prisma

# ====================

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# ====================

FROM base AS dokploy

ENV NODE_ENV=production

# Copy only the necessary files
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]