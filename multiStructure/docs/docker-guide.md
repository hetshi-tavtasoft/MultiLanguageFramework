# Docker Guide

## Overview

Docker configurations are in `infra/docker/` with per-framework Dockerfiles and a `docker-compose.yml` for running all frameworks together.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2 (included with Docker Desktop)

## Structure

```
infra/docker/
├── docker-compose.yml       # Orchestrates all frameworks
├── .dockerignore            # Root ignore for build context
├── .env.example             # Environment template
├── ts-playwright/
│   ├── Dockerfile           # TypeScript framework image
│   └── .dockerignore
├── js-playwright/
│   ├── Dockerfile           # JavaScript framework image
│   └── .dockerignore
└── csharp-playwright/
    ├── Dockerfile           # C# framework image (multi-stage)
    └── .dockerignore
```

## Quick Start

### 1. Configure Environment

```bash
cp infra/docker/.env.example infra/docker/.env
# Edit .env with your values
```

### 2. Build All Images

```bash
docker compose -f infra/docker/docker-compose.yml build
```

### 3. Run All Frameworks

```bash
docker compose -f infra/docker/docker-compose.yml up
```

### 4. Run a Single Framework

```bash
docker compose -f infra/docker/docker-compose.yml up ts-playwright
docker compose -f infra/docker/docker-compose.yml up js-playwright
docker compose -f infra/docker/docker-compose.yml up csharp-playwright
```

### 5. View Results

Reports and test results are mounted as volumes:

- `frameworks/ts-playwright/playwright-report/`
- `frameworks/js-playwright/playwright-report/`
- `frameworks/csharp-playwright/TestResults/`

Open the HTML report in your browser after tests complete.

## Dockerfile Details

### TS/JS Dockerfiles

Based on `mcr.microsoft.com/playwright:v1.59.0-jammy` which includes:
- Node.js runtime
- Playwright browsers pre-installed
- System dependencies for Chromium, Firefox, WebKit

Build process:
1. Copy `package*.json`
2. Run `npm ci` (faster, deterministic)
3. Copy source code
4. Run `npx playwright install` (framework-specific browsers)

### C# Dockerfile (Multi-Stage)

**Stage 1 - Build:**
- Base: `mcr.microsoft.com/dotnet/sdk:8.0-jammy`
- Restores NuGet packages
- Builds in Release mode
- Outputs to `/app/build`

**Stage 2 - Runtime:**
- Base: `mcr.microsoft.com/playwright:v1.59.0-jammy`
- Copies build output from Stage 1
- Installs Playwright browsers
- Runs `dotnet test`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `qa` | Target environment (qa/uat) |
| `BASE_URL` | *(empty)* | Override base URL |
| `CI` | `1` | Enable CI mode |

## Building Individual Images

```bash
# TypeScript
docker build -f infra/docker/ts-playwright/Dockerfile -t playwright-ts:latest .

# JavaScript
docker build -f infra/docker/js-playwright/Dockerfile -t playwright-js:latest .

# C#
docker build -f infra/docker/csharp-playwright/Dockerfile -t playwright-csharp:latest .
```

## Running with Custom Config

```bash
docker run --rm \
  -e ENV=uat \
  -e BASE_URL=https://uat.example.com \
  -v $(pwd)/frameworks/ts-playwright/playwright-report:/app/playwright-report \
  playwright-ts:latest
```

## Cleanup

```bash
# Stop and remove containers
docker compose -f infra/docker/docker-compose.yml down

# Remove images
docker compose -f infra/docker/docker-compose.yml down --rmi all

# Remove volumes (test results)
docker compose -f infra/docker/docker-compose.yml down -v
```
