# Getting Started

## Prerequisites

| Requirement | TS/JS Frameworks | C# Framework |
|-------------|-----------------|--------------|
| Node.js | 18+ (LTS recommended) | Not required |
| npm | Bundled with Node.js | Not required |
| .NET SDK | Not required | 8.0+ |
| OS | Windows, macOS, Linux | Windows, macOS, Linux |
| Git | Required | Required |

## Clone the Repository

```bash
git clone <repository-url>
cd multiStructure
```

## Setup: TypeScript Framework

```bash
cd frameworks/ts-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npx playwright test
```

## Setup: JavaScript Framework

```bash
cd frameworks/js-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npm test
```

## Setup: C# Framework

```bash
cd frameworks/csharp-playwright

# Restore NuGet packages
dotnet restore

# Install Playwright browsers
# Windows (PowerShell):
pwsh bin/Debug/net8.0/playwright.ps1 install --with-deps

# Linux/macOS:
./bin/Debug/net8.0/playwright.ps1 install --with-deps

# Build
dotnet build

# Run tests
dotnet test
```

## Configure Environment

1. Open `config/.env.qa` (TS/JS) or `appsettings.qa.json` (C#)
2. Set the `BASE_URL` to your test environment
3. Add any required credentials

### TS/JS (.env file)

```
BASE_URL=https://your-qa-environment.com
```

### C# (appsettings file)

```json
{
  "BaseUrl": "https://your-qa-environment.com"
}
```

## Run Tests

### Run All Tests

```bash
# TS/JS
npx playwright test

# C#
dotnet test
```

### Run Specific Tests

```bash
# By file name
npx playwright test login

# C# by test name filter
dotnet test --filter "Name~Login"
```

### Run in Headed Mode

```bash
# TS/JS
npx playwright test --headed

# C# - set in appsettings or via environment variable
```

### Run Against Different Environment

```bash
# TS/JS
ENV=uat npx playwright test

# C#
ENV=uat dotnet test
```

## View Reports

After tests run, view the HTML report:

```bash
# TS/JS
npx playwright show-report

# C# - open the HTML file in your browser
# Report location: TestResults/
```

## Using Docker

From the repository root:

```bash
# Copy env example and configure
cp infra/docker/.env.example infra/docker/.env
# Edit .env with your values

# Run all frameworks
docker compose -f infra/docker/docker-compose.yml up

# Run a single framework
docker compose -f infra/docker/docker-compose.yml up ts-playwright
```

## Next Steps

- Read [Architecture](architecture.md) to understand framework design
- Read [Test Writing Guide](test-writing-guide.md) for conventions
- Read [CI/CD Guide](ci-cd-guide.md) for pipeline setup
