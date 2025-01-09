# Builder Stage
FROM node:18-slim AS builder

WORKDIR /workspace

# Copy necessary files for building the app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY .eslintrc.json ./
COPY webpack.*.config.js ./

COPY apps/products ./apps/products
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

# Build the app
RUN npx nx build products

# Runner Stage
FROM node:18-slim AS runner

WORKDIR /app

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/products/package.json ./apps/products/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/apps/products/drizzle.config.ts ./apps/products/drizzle.config.ts
COPY --from=builder /workspace/apps/products/drizzle ./apps/products/drizzle
COPY --from=builder /workspace/package-lock.json ./

# Set production environment
ENV NODE_ENV=production

# Install production dependencies
RUN npm ci

# Copy build output and other files
COPY --from=builder /workspace/dist ./dist

# Run the application
CMD ["node", "dist/apps/products/main"]