# Jobber

A distributed job processing system built with a microservices architecture using NestJS, Apache Pulsar, and gRPC.

## Overview

Jobber enables asynchronous job execution and tracking across multiple services. It includes:

- **Authentication & user management**
- **Job execution and progress tracking**
- **Product catalog management**
- **Asynchronous message processing via Apache Pulsar**

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Auth     │     │    Jobs     │     │  Products   │
│  (GraphQL)  │     │  (GraphQL)  │     │  (GraphQL)  │
│  port 3000  │     │  port 3001  │     │  port 3002  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └─────────┬─────────┴─────────┬─────────┘
                 │      gRPC         │
                 ▼                   ▼
          ┌─────────────┐     ┌─────────────┐
          │   Pulsar    │────▶│  Executor   │
          │   (Queue)   │     │  (Worker)   │
          └─────────────┘     └─────────────┘
                 │                   │
                 ▼                   ▼
          ┌─────────────────────────────────┐
          │           PostgreSQL            │
          └─────────────────────────────────┘
```

### Applications

| App | Description | Port |
|-----|-------------|------|
| `auth` | Authentication & user management | 3000 |
| `jobs` | Job management & execution | 3001 |
| `products` | Product catalog service | 3002 |
| `executor` | Background job worker | - |

### Shared Libraries

| Library | Description |
|---------|-------------|
| `@jobber/grpc` | gRPC protocol definitions (proto files) |
| `@jobber/graphql` | Shared GraphQL utilities |
| `@jobber/nestjs` | Common NestJS setup utilities |
| `@jobber/pulsar` | Apache Pulsar client & consumer abstractions |
| `@jobber/prisma` | Shared Prisma database utilities |

## Tech Stack

- **Framework**: NestJS 10.x
- **Monorepo**: Nx 19.6
- **Language**: TypeScript 5.5
- **Databases**: PostgreSQL with Prisma ORM (auth, jobs) and Drizzle ORM (products)
- **Message Queue**: Apache Pulsar
- **Inter-service Communication**: gRPC with Protocol Buffers
- **API**: GraphQL (Apollo)

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Apache Pulsar on port 6650

### 3. Run database migrations

```bash
# Auth & Jobs (Prisma)
npx nx migrate-prisma auth
npx nx migrate-prisma jobs

# Products (Drizzle)
npx nx migrate-drizzle products
```

### 4. Generate Prisma clients

```bash
npx nx generate-prisma auth
npx nx generate-prisma jobs
```

### 5. Start all services

```bash
npm start
```

Or start individual services:

```bash
npx nx serve auth
npx nx serve jobs
npx nx serve executor
npx nx serve products
```

## Usage

### GraphQL Endpoints

- Auth: http://localhost:3000/graphql
- Jobs: http://localhost:3001/graphql
- Products: http://localhost:3002/graphql

### Execute a Job

```graphql
mutation {
  executeJob(executeJobInput: {
    name: "LOAD_PRODUCTS",
    data: { fileName: "products.json" }
  }) {
    id
    status
  }
}
```

### Query Job Status

```graphql
query {
  job(id: 1) {
    id
    name
    status
    size
    completed
  }
}
```

### Test Script

```bash
# Test Fibonacci job execution
node scripts/fibonacci.mjs http://localhost:3000/graphql http://localhost:3001/graphql 1000
```

## Development

### Build

```bash
npx nx build <app-name>
```

### Test

```bash
npx nx test <app-name>
```

### Lint

```bash
npx nx lint <app-name>
```

### Generate Drizzle migrations (Products)

```bash
npx nx generate-drizzle products
```

### Visualize project graph

```bash
npx nx graph
```

## Project Structure

```
jobber/
├── apps/
│   ├── auth/           # Auth service (GraphQL, Prisma)
│   ├── jobs/           # Jobs service (GraphQL, Prisma)
│   ├── executor/       # Worker service (Pulsar consumer)
│   └── products/       # Products service (GraphQL, Drizzle)
├── libs/
│   ├── grpc/           # Proto definitions & generated types
│   ├── graphql/        # GraphQL utilities & plugins
│   ├── nestjs/         # Common NestJS utilities
│   ├── prisma/         # Prisma utilities
│   └── pulsar/         # Pulsar client & messages
├── docker-compose.yaml
├── nx.json
├── package.json
└── tsconfig.base.json
```

## Environment Variables

Each service requires configuration via environment variables. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PULSAR_SERVICE_URL` | Pulsar broker URL |
| `AUTH_GRPC_SERVICE_URL` | Auth service gRPC endpoint |
| `JOBS_GRPC_SERVICE_URL` | Jobs service gRPC endpoint |
