# C# Playwright Framework

A Playwright test automation framework built with C# on .NET 8, following the Page Object Model (POM) pattern with a base test class for configuration loading and extensible test architecture. Uses `Microsoft.Playwright.NUnit` as the test runner.

## Tech Stack

- **Language:** C# (.NET 8)
- **Test Runner:** `Microsoft.Playwright.NUnit` (NUnit + Playwright integration)
- **Config Loading:** `Microsoft.Extensions.Configuration` (appsettings JSON + environment variables)
- **Build System:** .NET SDK / MSBuild

## Project Structure

```
csharp-playwright/
├── csharp-playwright.csproj          # .NET 8 project file & NuGet package references
├── csharp-playwright.sln             # Visual Studio solution file
├── .gitignore                        # Git ignore rules
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI/CD pipeline
├── Fixtures/
│   └── BaseTest.cs                   # Base test class with configuration loading
├── Pages/
│   └── LoginPage.cs                  # Page Object - Login page locators & actions
├── Tests/
│   ├── ExampleTests.cs               # Default Playwright example tests
│   └── LoginTests.cs                 # Login test using POM + base fixture
├── Utils/                            # Utility helpers (extendable)
├── TestData/                         # Test data files (extendable)
├── appsettings.json                  # Default/base configuration
├── appsettings.qa.json               # QA environment configuration
└── appsettings.uat.json              # UAT environment configuration
```

## Architecture

### Configuration Layer

The framework uses `Microsoft.Extensions.Configuration` to load settings from `appsettings.json` with environment-specific overlays:

- `appsettings.json` - Base/default configuration
- `appsettings.qa.json` - QA environment overrides
- `appsettings.uat.json` - UAT environment overrides

The `ENV` environment variable determines which overlay file to apply. Environment variables always take highest priority.

```csharp
var environment = Environment.GetEnvironmentVariable("ENV") ?? "qa";

Configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
    .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables()
    .Build();
```

### Base Test Class

`Fixtures/BaseTest.cs` extends `Microsoft.Playwright.NUnit.PageTest`, providing:

- Automatic configuration loading in `[SetUp]`
- Protected `Configuration` property for accessing any config value
- Protected `BaseUrl` property for use in derived test classes

```csharp
public class BaseTest : PageTest
{
    protected IConfiguration Configuration { get; private set; } = null!;
    protected string BaseUrl { get; private set; } = null!;

    [SetUp]
    public void GlobalSetup()
    {
        // Configuration loading logic
    }
}
```

### Page Object Model

Each page is a class with:
- Constructor accepting `IPage`
- Locators exposed as `ILocator` properties
- Action methods as `async Task` methods

```csharp
public class LoginPage
{
    private readonly IPage _page;

    public LoginPage(IPage page)
    {
        _page = page;
        Username = page.Locator("#username");
        Password = page.Locator("#password");
        LoginButton = page.Locator("#login");
    }

    public ILocator Username { get; }
    public ILocator Password { get; }
    public ILocator LoginButton { get; }

    public async Task LoginAsync(string user, string pass)
    {
        await Username.FillAsync(user);
        await Password.FillAsync(pass);
        await LoginButton.ClickAsync();
    }
}
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- PowerShell (for Playwright browser installation on Windows)

### Installation

```bash
dotnet restore
```

### Install Playwright Browsers

```bash
# Windows (PowerShell)
pwsh bin/Debug/net8.0/playwright.ps1 install --with-deps

# Linux/macOS
./bin/Debug/net8.0/playwright.sh install --with-deps
```

### Running Tests

```bash
dotnet test                             # Run all tests
dotnet test --filter "Name~Login"       # Run tests matching name
dotnet test --logger "console;verbosity=detailed"  # Verbose output
ENV=uat dotnet test                     # Run with UAT config
```

### Build

```bash
dotnet build                            # Build the project
dotnet build --no-restore               # Build without restoring packages
```

## NuGet Package References

| Package | Version | Purpose |
|---------|---------|---------|
| `Microsoft.NET.Test.Sdk` | 17.12.0 | .NET test SDK |
| `Microsoft.Playwright.NUnit` | 1.59.0 | Playwright + NUnit integration |
| `NUnit` | 4.3.2 | NUnit test framework |
| `NUnit3TestAdapter` | 4.6.0 | NUnit test adapter for .NET CLI |
| `Microsoft.Extensions.Configuration` | 9.0.0 | Configuration API |
| `Microsoft.Extensions.Configuration.Json` | 9.0.0 | JSON configuration provider |
| `Microsoft.Extensions.Configuration.EnvironmentVariables` | 9.0.0 | Environment variable provider |

## Configuration Reference

### appsettings.json

```json
{
  "BaseUrl": "https://qa.example.com",
  "Headless": true,
  "Timeout": 30000,
  "Retries": 2
}
```

| Key | Type | Description |
|-----|------|-------------|
| `BaseUrl` | string | Base URL for test navigation |
| `Headless` | bool | Run browser in headless mode |
| `Timeout` | int | Per-test timeout in milliseconds |
| `Retries` | int | Number of retries on failure |

## Environment Variables

Set `ENV` to select the environment overlay:

```bash
ENV=qa dotnet test
ENV=uat dotnet test
```

Individual config values can also be overridden directly via environment variables (highest priority).

## Adding New Tests

1. Create a new `.cs` file in `Tests/`
2. Inherit from `BaseTest` to get configuration access, or `PageTest` for standalone tests
3. Use `[Test]` attribute for test methods

```csharp
using csharp_playwright.Fixtures;
using csharp_playwright.Pages;
using NUnit.Framework;

namespace csharp_playwright.Tests;

public class MyTests : BaseTest
{
    [Test]
    public async Task MyTest()
    {
        await Page.GotoAsync(BaseUrl);
        await Expect(Page).ToHaveTitleAsync(new Regex("My Title"));
    }
}
```

## Adding New Page Objects

1. Create a new `.cs` file in `Pages/`
2. Define a class with `IPage` constructor, locator properties, and async methods

```csharp
using Microsoft.Playwright;

namespace csharp_playwright.Pages;

public class SomePage
{
    private readonly IPage _page;

    public SomePage(IPage page)
    {
        _page = page;
        SomeElement = page.Locator("#some-element");
    }

    public ILocator SomeElement { get; }

    public async Task DoSomethingAsync()
    {
        await SomeElement.ClickAsync();
    }
}
```

## Differences from JS/TS Frameworks

| Aspect | ts-playwright / js-playwright | csharp-playwright |
|--------|------------------------------|-------------------|
| Language | TypeScript / JavaScript | C# (.NET 8) |
| Test runner | `@playwright/test` | `Microsoft.Playwright.NUnit` |
| Config system | dotenv (`.env.{env}`) | `appsettings.{env}.json` |
| Fixture pattern | `test.extend()` | Base class inheritance (`BaseTest : PageTest`) |
| Package manager | npm | NuGet (dotnet CLI) |
| Test attributes | N/A (function-based) | `[Test]`, `[SetUp]` (NUnit attributes) |
| Async pattern | `async/await` | `async Task` |

## CI/CD

The `.github/workflows/playwright.yml` pipeline runs tests on push/PR to `main`/`master`:

- Checks out code
- Sets up .NET 8 SDK
- Restores NuGet packages
- Installs Playwright browsers
- Builds the project
- Runs tests
- Uploads HTML report as artifact (30-day retention)
