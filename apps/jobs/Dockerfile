# Builder Stage
FROM node:20-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY .eslintrc.json ./
COPY webpack.*.config.js ./

COPY apps/jobs ./apps/jobs
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar
COPY libs/prisma ./libs/prisma

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

# Generate Prisma client
RUN cd apps/jobs && npx prisma generate

RUN npx nx build jobs

# Runner Stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/package.json
COPY --from=builder /workspace/apps/jobs/prisma ./prisma
COPY --from=builder /workspace/apps/jobs/prisma.config.ts ./prisma.config.ts
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /workspace/package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

# Copy build output
COPY --from=builder /workspace/dist ./dist

# Copy generated Prisma client
COPY --from=builder /workspace/apps/jobs/src/generated ./apps/jobs/src/generated

# Copy entrypoint script
COPY apps/jobs/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
