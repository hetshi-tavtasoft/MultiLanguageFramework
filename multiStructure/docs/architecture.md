# Architecture

## Overview

This repository contains three independent Playwright test automation frameworks sharing common patterns, resources, and infrastructure.

```
┌─────────────────────────────────────────────────────┐
│                  CI/CD Pipelines                     │
│  GitHub Actions │ GitLab CI │ Azure Pipelines        │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│                 Docker Layer                         │
│  docker-compose.yml + per-framework Dockerfiles      │
└─────────────────────────┬───────────────────────────┘
                          │
┌───────────┬─────────────▼──────────────┬────────────┐
│           │                            │            │
│  TS       │   JS                       │  C#        │
│  Playwright│  Playwright               │  Playwright │
│  (npm)    │   (npm)                    │  (dotnet)  │
│           │                            │            │
│  ┌────────▼─────────┐                  │            │
│  │ playwright.config│                  │            │
│  │ base.fixture     │                  │            │
│  │ pages/ (POM)     │                  │            │
│  │ tests/           │                  │            │
│  └────────┬─────────┘                  │            │
└───────────┼────────────────────────────┼────────────┘
            │                            │
┌───────────▼────────────────────────────▼────────────┐
│                    Core Resources                    │
│  api-clients │ config │ test-data │ utils            │
└─────────────────────────────────────────────────────┘
```

## Design Patterns

### Page Object Model (POM)

Each UI page is represented by a class containing:
- **Locators** - Element selectors as properties
- **Actions** - User interactions as async methods
- **Assertions** - Page state verification methods

Tests interact with pages, not with locators directly, providing:
- Single source of truth for selectors
- Easy maintenance when UI changes
- Reusable action methods

### Custom Fixtures / Base Test

Each framework provides an extension point:

| Framework | Mechanism | File |
|-----------|-----------|------|
| TypeScript | `test.extend()` | `fixtures/base.fixture.ts` |
| JavaScript | `base.extend()` (CommonJS) | `fixtures/base.fixture.js` |
| C# | Class inheritance | `Fixtures/BaseTest.cs` |

Use these to add:
- Pre-authenticated browser contexts
- API clients with shared state
- Test data generators
- Custom assertions

### Configuration Strategy

```
                    ┌─────────────────┐
                    │  ENV variable   │
                    │  (qa/uat/stage) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
       │ TS/JS:      │ │ TS/JS:   │ │ C#:         │
       │ dotenv      │ │ process  │ │ appsettings │
       │ .env.{env}  │ │ .env.*   │ │ .{env}.json │
       └─────────────┘ └──────────┘ └─────────────┘
```

- Environment variable `ENV` selects the config file
- Base config provides defaults
- Environment overlay overrides specific values
- CI/CD secrets override at runtime (highest priority)

## Cross-Framework Shared Resources

Located in `core/`:

| Resource | Purpose | Consumers |
|----------|---------|-----------|
| `api-clients/` | REST client templates, OpenAPI specs, Postman collections | All frameworks |
| `config/` | Environment templates, URL definitions | All frameworks |
| `test-data/` | User data, product data, API payloads | All frameworks |
| `utils/` | Report aggregation, data generation, cleanup | CI/CD pipelines |

## Execution Flow

1. **CI triggers** on push/PR to `main`/`master`
2. **Framework pipeline** installs dependencies
3. **Config loaded** based on `ENV` variable
4. **Playwright launches** browser (chromium/firefox/webkit)
5. **Tests run** against target environment
6. **Results captured** - screenshots, videos, traces on failure
7. **Reports uploaded** as CI artifacts
8. **Cleanup** removes stale results (via `core/utils/cleanup-results.js`)
