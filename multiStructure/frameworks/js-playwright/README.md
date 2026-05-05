# JavaScript Playwright Framework

A Playwright test automation framework built with JavaScript (CommonJS), following the Page Object Model (POM) pattern with custom fixtures for extensible test architecture. This is the JavaScript equivalent of the ts-playwright framework.

## Tech Stack

- **Language:** JavaScript (CommonJS)
- **Test Runner:** `@playwright/test`
- **Config Loading:** `dotenv` for environment-specific configuration
- **Module System:** CommonJS (`require` / `module.exports`)

## Project Structure

```
js-playwright/
├── package.json                      # npm dependencies & project metadata
├── .gitignore                        # Git ignore rules
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI/CD pipeline
├── config/
│   ├── playwright.config.js          # Playwright test runner configuration
│   ├── .env.qa                       # QA environment variables (placeholder)
│   └── .env.uat                      # UAT environment variables (placeholder)
├── fixtures/
│   └── base.fixture.js               # Custom test & expect exports (extends base)
├── pages/
│   └── login.page.js                 # Page Object - Login page locators & actions
├── tests/
│   ├── example.spec.js               # Default Playwright example tests
│   └── login.spec.js                 # Login test using POM + custom fixture
├── utils/                            # Shared utility functions (extendable)
└── test-data/                        # JSON test data files (extendable)
```

## Architecture

### Configuration Layer

The framework uses `dotenv` to load environment-specific variables. The `ENV` environment variable determines which `.env` file is loaded:

- `config/.env.qa` - QA environment
- `config/.env.uat` - UAT environment

```javascript
// config/playwright.config.js
const env = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
```

### Custom Fixture Pattern

`fixtures/base.fixture.js` extends Playwright's base `test` object, providing a single import point for all tests. This is where custom fixtures (authenticated contexts, API clients, test data helpers) are added:

```javascript
const { test: base } = require('@playwright/test');

const test = base.extend({
  // custom fixtures here
});

const expect = test.expect;

module.exports = { test, expect };
```

### Page Object Model

Each page is a class with:
- Constructor accepting `page`
- Locators assigned as instance properties in constructor
- Action methods as async functions

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('#username');
    this.password = page.locator('#password');
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
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
npm test                         # Run all tests
npm run test:headed              # Run in headed mode
npm run test:debug               # Run in debug mode
npm run test:qa                  # Run with QA config
npm run test:uat                 # Run with UAT config
```

### Generating & Viewing Reports

```bash
npm run report                   # Open HTML report in browser
```

## npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npx playwright test` | Run all tests |
| `test:qa` | `ENV=qa npx playwright test` | Run tests with QA config |
| `test:uat` | `ENV=uat npx playwright test` | Run tests with UAT config |
| `test:headed` | `npx playwright test --headed` | Run in headed browser mode |
| `test:debug` | `npx playwright test --debug` | Run in debug mode with UI |
| `report` | `npx playwright show-report` | Open HTML test report |

## Configuration Reference

### playwright.config.js

| Option | Value | Description |
|--------|-------|-------------|
| `testDir` | `../tests` | Directory containing test files |
| `timeout` | `30000` | Per-test timeout in milliseconds |
| `retries` | `2` | Number of retries on failure |
| `headless` | `true` | Run browser in headless mode |
| `screenshot` | `only-on-failure` | Capture screenshots on failure |
| `video` | `retain-on-failure` | Record videos, retain on failure |

## Environment Variables

Add variables to `config/.env.{environment}`:

```
BASE_URL=https://qa.example.com
```

The `baseURL` is consumed by Playwright config and used in tests via `page.goto('/')`.

## Adding New Tests

1. Create a new `.spec.js` file in `tests/`
2. Import `test` and `expect` from `../fixtures/base.fixture`
3. Import page objects from `../pages/`

```javascript
const { test, expect } = require('../fixtures/base.fixture');
const { SomePage } = require('../pages/some.page');

test('my test', async ({ page }) => {
  const somePage = new SomePage(page);
  await page.goto('/');
  // assertions...
});
```

## Adding New Page Objects

1. Create a new `.page.js` file in `pages/`
2. Define a class with locators and action methods
3. Export using `module.exports`

```javascript
class SomePage {
  constructor(page) {
    this.page = page;
    this.someElement = page.locator('#some-element');
  }

  async doSomething() {
    await this.someElement.click();
  }
}

module.exports = { SomePage };
```

## Differences from ts-playwright

| Aspect | ts-playwright | js-playwright |
|--------|--------------|---------------|
| File extension | `.ts` | `.js` |
| Module syntax | `import`/`export` | `require`/`module.exports` |
| Type annotations | Yes | No |
| `tsconfig.json` | Yes | Not needed |
| `package.json` scripts | Not defined | Pre-configured convenience scripts |

## CI/CD

The `.github/workflows/playwright.yml` pipeline runs tests on push/PR to `main`/`master`:

- Checks out code
- Sets up Node.js LTS
- Installs dependencies and Playwright browsers
- Runs tests
- Uploads HTML report as artifact (30-day retention)
