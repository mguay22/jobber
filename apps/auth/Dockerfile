# Builder Stage
FROM node:20-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

# Copy necessary files for building the app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY .eslintrc.json ./
COPY webpack.*.config.js ./

COPY apps/auth ./apps/auth
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/prisma ./libs/prisma

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

# Generate Prisma client
RUN cd apps/auth && npx prisma generate

# Build the app
RUN npx nx build auth

# Runner Stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/apps/auth/prisma ./prisma
COPY --from=builder /workspace/apps/auth/prisma.config.ts ./prisma.config.ts
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /workspace/package-lock.json ./

# Set production environment
ENV NODE_ENV=production

# Install production dependencies
RUN npm ci

# Copy build output
COPY --from=builder /workspace/dist ./dist

# Copy generated Prisma client
COPY --from=builder /workspace/apps/auth/src/generated ./apps/auth/src/generated

# Copy entrypoint script
COPY apps/auth/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Run the application
ENTRYPOINT ["/app/docker-entrypoint.sh"]
