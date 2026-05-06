# Playwright Multi-Structure Framework

A cross-language Playwright test automation framework supporting **TypeScript**, **JavaScript**, and **C#** with Allure reporting.

## Project Structure

```
Playwright_Multi_Structure_Framework/
├── multiStructure/
│   └── frameworks/
│       ├── ts-playwright/      # TypeScript Playwright tests
│       ├── js-playwright/      # JavaScript Playwright tests
│       └── csharp-playwright/ # C# (.NET 8) Playwright tests
└── .github/
    └── workflows/
        └── playwright-ci.yml   # CI pipeline
```

## Prerequisites

- **Node.js** 18+ (for TS/JS frameworks)
- **.NET 8 SDK** (for C# framework)
- **Playwright browsers** (Chromium)

## Setup

### TypeScript / JavaScript Frameworks

```bash
cd multiStructure/frameworks/ts-playwright   # or js-playwright
npm ci
npx playwright install chromium
```

### C# Framework

```bash
cd multiStructure/frameworks/csharp-playwright
dotnet restore
dotnet build
pwsh bin/Debug/net8.0/playwright.ps1 install chromium
```

## Running Tests

### Using Test Runner (Recommended)

The `test-runner.yml` file controls test execution with tags and scheduling:

```yaml
# Run tests by tag
dotnet test --filter "Category=smoke"        # C# - run smoke tests
npx playwright test --grep "@smoke"           # TS/JS - run smoke tests
```

**Available Tags:**
- `@smoke` - Quick smoke tests (runs every 15 min in CI)
- `@regression` - Full regression suite (runs daily at 2 AM)
- `@critical` - Critical path tests (runs every hour)

### TypeScript
```bash
cd multiStructure/frameworks/ts-playwright
npx playwright test --project=chromium
npx playwright test --grep "@smoke"              # Run only smoke tests
```

### JavaScript
```bash
cd multiStructure/frameworks/js-playwright
npx playwright test --project=chromium
npx playwright test --grep "@regression"         # Run only regression tests
```

### C# (.NET)
```bash
cd multiStructure/frameworks/csharp-playwright
dotnet test --filter "BrowserName=chromium"
dotnet test --filter "Category=smoke"           # Run only smoke tests
```

## Environment Configuration

Each framework supports multiple environments via `appsettings.{env}.json`:
- `appsettings.qa.json`
- `appsettings.uat.json`
- `appsettings.prod.json`

Set environment variables:
```
BASE_URL=https://your-url.com
USERNAME=your_username
PASSWORD=your_password
```

## CI/CD Pipeline

### playwright-ci.yml (Main Pipeline)
Runs on:
- Push to `main` branch
- Pull requests to `main`
- Manual dispatch (select environment: qa/uat/prod)

**Jobs:** ts-tests | js-tests | csharp-tests (all parallel on ubuntu-latest with Chromium)

### scheduled-tests.yml (Tag-Based Scheduled Runs)
Runs automatically based on tags defined in `test-runner.yml`:

| Tag | Schedule | Description |
|-----|----------|-------------|
| `@smoke` | Every 15 min | Quick smoke tests |
| `@critical` | Every hour | Critical path tests |
| `@regression` | Daily 2 AM | Full regression suite |

**Manual Dispatch Options:**
- Select tag: smoke / regression / critical
- Select environment: qa / uat / prod
- Select framework: all / ts / js / csharp

### Adding New Tests

1. Create test file in appropriate framework directory
2. Add entry in `test-runner.yml` under `modules:`
3. Tag your tests:
   - **C#**: `[Category("smoke")]`
   - **TS/JS**: `test('@smoke Your test', async () => {})`
4. Push to trigger pipeline or manually dispatch from GitHub Actions

## Allure Reporting (C#)

C# framework uses **Allure.NUnit 2.x** for test reporting.

**Important**: Uses **NUnit 3.14.0** (Allure.NUnit 2.x is not compatible with NUnit 4.x).

Generate Allure report:
```bash
cd multiStructure/frameworks/csharp-playwright
allure generate bin/Debug/net8.0/allure-results -o allure-report --clean
allure open allure-report
```

## Test Scenarios

All frameworks implement the same Swag Labs test scenarios:
1. Navigate and verify dashboard
2. Login with valid credentials
3. Add cheapest product to cart
4. Verify cart contents
5. Complete checkout flow

## Secrets (GitHub Actions)

Configure in repository settings:
- `BASE_URL` - Target application URL
- `USERNAME` - Test user username
- `PASSWORD` - Test user password

## Troubleshooting

### C# Allure Not Generating Results
- Verify NUnit version is 3.14.0 (not 4.x)
- Ensure `[AllureNUnit]` attribute is on test classes
- Check `allureConfig.json` exists in project root
- Results generate in `bin/Debug/net8.0/allure-results/`

### Playwright Browser Issues
```bash
npx playwright install --with-deps chromium
# or for C#
pwsh bin/Debug/net8.0/playwright.ps1 install chromium
```
