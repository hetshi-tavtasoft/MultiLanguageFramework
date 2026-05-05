# TypeScript Playwright Framework

A Playwright test automation framework built with TypeScript, following the Page Object Model (POM) pattern with custom fixtures for extensible test architecture.

## Tech Stack

- **Language:** TypeScript
- **Test Runner:** `@playwright/test`
- **Config Loading:** `dotenv` for environment-specific configuration
- **Module System:** CommonJS
- **Target:** ES2022

## Project Structure

```
ts-playwright/
├── package.json                      # npm dependencies & project metadata
├── tsconfig.json                     # TypeScript compiler configuration
├── .gitignore                        # Git ignore rules
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI/CD pipeline
├── config/
│   ├── playwright.config.ts          # Playwright test runner configuration
│   ├── .env.qa                       # QA environment variables (placeholder)
│   └── .env.uat                      # UAT environment variables (placeholder)
├── fixtures/
│   └── base.fixture.ts               # Custom test & expect exports (extends base)
├── pages/
│   └── login.page.ts                 # Page Object - Login page locators & actions
├── tests/
│   ├── example.spec.ts               # Default Playwright example tests
│   └── login.spec.ts                 # Login test using POM + custom fixture
├── utils/                            # Shared utility functions (extendable)
├── test-data/                        # JSON test data files (extendable)
├── reports/                          # Generated test reports (gitignored)
├── test-results/                     # Test run results (gitignored)
└── frameworks/                       # Cross-framework references
```

## Architecture

### Configuration Layer

The framework uses `dotenv` to load environment-specific variables. The `ENV` environment variable determines which `.env` file is loaded:

- `config/.env.qa` - QA environment
- `config/.env.uat` - UAT environment

```typescript
// config/playwright.config.ts
dotenv.config({ path: `./config/.env.${process.env.ENV || 'qa'}` });
```

### Custom Fixture Pattern

`fixtures/base.fixture.ts` extends Playwright's base `test` object, providing a single import point for all tests. This is where custom fixtures (authenticated contexts, API clients, test data helpers) are added:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  // custom fixtures here
});

export const expect = test.expect;
```

### Page Object Model

Each page is a class with:
- Constructor accepting `Page`
- Locators as class properties
- Action methods as async functions

```typescript
export class LoginPage {
  constructor(private page: Page) {}
  username = this.page.locator('#username');
  async login(user: string, pass: string) { /* ... */ }
}
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Running Tests

```bash
npx playwright test              # Run all tests
npx playwright test --headed     # Run in headed mode
npx playwright test --debug      # Run in debug mode
ENV=uat npx playwright test      # Run with UAT config
```

### Generating & Viewing Reports

```bash
npx playwright show-report       # Open HTML report in browser
```

## Configuration Reference

### playwright.config.ts

| Option | Value | Description |
|--------|-------|-------------|
| `testDir` | `../tests` | Directory containing test files |
| `timeout` | `30000` | Per-test timeout in milliseconds |
| `retries` | `2` | Number of retries on failure |
| `headless` | `true` | Run browser in headless mode |
| `screenshot` | `only-on-failure` | Capture screenshots on failure |
| `video` | `retain-on-failure` | Record videos, retain on failure |

### tsconfig.json

| Option | Value | Description |
|--------|-------|-------------|
| `target` | `ES2022` | JavaScript target version |
| `module` | `ES2022` | Module system |
| `moduleResolution` | `bundler` | Module resolution strategy |
| `strict` | `true` | Enable strict type checking |
| `outDir` | `./dist` | Output directory for compiled JS |

## Environment Variables

Add variables to `config/.env.{environment}`:

```
BASE_URL=https://qa.example.com
```

The `baseURL` is consumed by Playwright config and used in tests via `page.goto('/')`.

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/`
2. Import `test` and `expect` from `../fixtures/base.fixture`
3. Import page objects from `../pages/`

```typescript
import { test, expect } from '../fixtures/base.fixture';
import { SomePage } from '../pages/some.page';

test('my test', async ({ page }) => {
  const somePage = new SomePage(page);
  await page.goto('/');
  // assertions...
});
```

## Adding New Page Objects

1. Create a new `.page.ts` file in `pages/`
2. Define a class with locators and action methods

```typescript
import { Page } from '@playwright/test';

export class SomePage {
  constructor(private page: Page) {}
  someElement = this.page.locator('#some-element');
  async doSomething() { /* ... */ }
}
```

## CI/CD

The `.github/workflows/playwright.yml` pipeline runs tests on push/PR to `main`/`master`:

- Checks out code
- Sets up Node.js LTS
- Installs dependencies and Playwright browsers
- Runs tests
- Uploads HTML report as artifact (30-day retention)
