FROM node:18-slim AS builder

WORKDIR /workspace

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

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

RUN npx nx build products

FROM node:18-slim AS runner

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/products/package.json ./apps/products/package.json
COPY --from=builder /workspace/apps/products/drizzle.config.ts ./apps/products/drizzle.config.ts
COPY --from=builder /workspace/apps/products/drizzle ./apps/products/drizzle
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/products/main"]