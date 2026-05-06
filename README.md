# Multi-Language Playwright Framework

A multi-structure automation testing repository containing Playwright-based frameworks across multiple programming languages. Each framework is independent and follows the same architectural patterns while using language-specific conventions.

## Repository Structure

```
multiStructure/
├── README.md                           # This file
├── .gitignore                          # Root gitignore
├── core/                               # Shared resources across frameworks
│   ├── api-clients/                    # Reusable API client implementations
│   ├── config/                         # Shared configuration templates
│   ├── test-data/                      # Common test data files
│   └── utils/                          # Cross-framework utility scripts
├── docs/                               # Documentation and guides
├── infra/                              # Infrastructure and deployment
│   ├── ci-cd/                          # CI/CD pipeline configurations
│   └── docker/                         # Docker configurations
└── frameworks/                         # Individual test frameworks
    ├── ts-playwright/                  # TypeScript + Playwright + NUnit-style
    ├── js-playwright/                  # JavaScript + Playwright (CommonJS)
    └── csharp-playwright/              # C# (.NET 8) + Playwright.NUnit
```

---

## Frameworks Overview

| Framework | Language | Test Runner | Config System | Package Manager |
|-----------|----------|-------------|---------------|-----------------|
| `ts-playwright` | TypeScript | `@playwright/test` | dotenv (`.env.{env}`) | npm |
| `js-playwright` | JavaScript (CommonJS) | `@playwright/test` | dotenv (`.env.{env}`) | npm |
| `csharp-playwright` | C# (.NET 8) | `Microsoft.Playwright.NUnit` | `appsettings.{env}.json` | NuGet (dotnet) |

---

## Individual Framework Structure

### ts-playwright

```
ts-playwright/
├── package.json                      # npm dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── .gitignore
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI pipeline
├── config/
│   ├── playwright.config.ts          # Playwright runner config
│   ├── .env.qa                       # QA environment variables
│   └── .env.uat                      # UAT environment variables
├── fixtures/
│   └── base.fixture.ts               # Custom test fixture (extends base test)
├── pages/
│   └── login.page.ts                 # Page Object Model - Login page
├── tests/
│   ├── example.spec.ts               # Example Playwright tests
│   └── login.spec.ts                 # Login test using POM + fixture
├── utils/                            # Utility helpers (extendable)
├── test-data/                        # JSON test data files (extendable)
├── reports/                          # Test reports (gitignored)
├── test-results/                     # Test results (gitignored)
└── frameworks/                       # Cross-framework references
```

### js-playwright

```
js-playwright/
├── package.json                      # npm dependencies & scripts
├── .gitignore
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI pipeline
├── config/
│   ├── playwright.config.js          # Playwright runner config (CommonJS)
│   ├── .env.qa                       # QA environment variables
│   └── .env.uat                      # UAT environment variables
├── fixtures/
│   └── base.fixture.js               # Custom test fixture (CommonJS exports)
├── pages/
│   └── login.page.js                 # Page Object Model - Login page
├── tests/
│   ├── example.spec.js               # Example Playwright tests
│   └── login.spec.js                 # Login test using POM + fixture
├── utils/                            # Utility helpers (extendable)
└── test-data/                        # JSON test data files (extendable)
```

### csharp-playwright

```
csharp-playwright/
├── csharp-playwright.csproj          # .NET 8 project file & NuGet packages
├── csharp-playwright.sln             # Visual Studio solution file
├── .gitignore
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI pipeline
├── Config/
│   └── *(configuration handled via appsettings files at root)*
├── Fixtures/
│   └── BaseTest.cs                   # Base test class with configuration loading
├── Pages/
│   └── LoginPage.cs                  # Page Object Model - Login page
├── Tests/
│   ├── ExampleTests.cs               # Example Playwright tests
│   └── LoginTests.cs                 # Login test using POM + base fixture
├── Utils/                            # Utility helpers (extendable)
├── TestData/                         # Test data files (extendable)
├── appsettings.json                  # Default configuration
├── appsettings.qa.json               # QA environment configuration
└── appsettings.uat.json              # UAT environment configuration
```

---

## Framework Architecture Pattern

All three frameworks follow the same core architectural pattern:

```
┌─────────────────────────┐
│   CI/CD Pipeline        │   (.github/workflows/playwright.yml)
│   GitHub Actions        │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│   Configuration Layer   │   (playwright.config / appsettings + env files)
│   Env-Driven Config     │
└────────────┬────────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼──┐ ┌───▼────┐ ┌─▼─────┐
│Fixture│ │ Pages  │ │ Utils │
│(Base) │ │ (POM)  │ │ (TBD) │
└───┬───┘ └───┬────┘ └───────┘
    │         │
    └────┬────┘
         │
┌────────▼────────────┐
│   Tests (.spec)     │   (Test specs using fixtures + page objects)
└─────────────────────┘
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **Configuration** | Environment-driven config (QA/UAT) via dotenv (JS/TS) or appsettings (C#) |
| **Base Fixture** | Extends the base test runner; single import point for all tests |
| **Page Objects** | Class-based POM with locators as properties and async action methods |
| **Tests** | Spec files using custom fixtures and page objects |
| **CI/CD** | GitHub Actions workflows for automated test execution |

---

## Quick Start

### ts-playwright

```bash
cd frameworks/ts-playwright
npm install
npx playwright install --with-deps
npx playwright test
```

### js-playwright

```bash
cd frameworks/js-playwright
npm install
npx playwright install --with-deps
npm test
```

### csharp-playwright

```bash
cd frameworks/csharp-playwright
dotnet restore
dotnet build
dotnet test
```

---

## Environment Configuration

### JS/TS Frameworks

Environment files are located in `config/.env.{environment}`. The `ENV` environment variable selects which file to load (defaults to `qa`):

```bash
ENV=qa npx playwright test
ENV=uat npx playwright test
```

### C# Framework

Environment files are `appsettings.{environment}.json`. The `ENV` environment variable selects which file to overlay on the base `appsettings.json`:

```bash
ENV=qa dotnet test
ENV=uat dotnet test
```

---

## npm Scripts (JS/TS Frameworks)

| Script | Command |
|--------|---------|
| `npm test` | Run all tests |
| `npm run test:qa` | Run tests with QA config |
| `npm run test:uat` | Run tests with UAT config |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:debug` | Run tests in debug mode |
| `npm run report` | Open HTML test report |

## dotnet Commands (C# Framework)

| Command | Description |
|---------|-------------|
| `dotnet restore` | Restore NuGet packages |
| `dotnet build` | Build the project |
| `dotnet test` | Run all tests |
| `dotnet test --filter "Name~Login"` | Run specific tests |
