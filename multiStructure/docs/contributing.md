# Contributing Guidelines

## Branching Strategy

```
main/master
  ├── feature/add-login-tests
  ├── bugfix/fix-selector
  └── release/v1.0.0
```

- **`main`/`master`**: Production-ready code
- **`feature/*`**: New features or tests
- **`bugfix/*`**: Bug fixes
- **`release/*`**: Release preparation

## Pull Request Process

1. Create a feature branch from `main`
2. Make changes in the relevant framework(s)
3. Run tests locally before pushing
4. Open a pull request with:
   - Clear title describing the change
   - Description of what was added/changed/fixed
   - List of frameworks affected
5. Wait for review and address feedback
6. Merge after approval

## Commit Message Convention

```
type: description

Types:
  feat:     New feature or test
  fix:      Bug fix
  refactor: Code restructuring (no behavior change)
  docs:     Documentation changes
  chore:    Maintenance (deps, config, CI)
  test:     Test additions or updates
```

Examples:

```
feat: add login page object and tests
fix: correct username selector on login page
docs: update getting started guide
chore: update Playwright to v1.59.0
test: add invalid credentials test cases
```

## Coding Standards

### TypeScript/JavaScript

- Use `async/await` over `.then()` chains
- Import `test` and `expect` from `fixtures/base.fixture` (not from `@playwright/test` directly)
- Name test files as `*.spec.{ts,js}`
- Name page files as `*.page.{ts,js}`
- Use `test.describe()` for grouping related tests
- Keep page objects focused on a single page/screen

### C#

- Use `async Task` for all test methods
- Follow PascalCase for test method names
- Name test files as `*Tests.cs`
- Name page files as `*Page.cs`
- Use `[Test]` attribute for test methods
- Use `Arrange-Act-Assert` pattern in tests

### General

- No hardcoded URLs - use `baseURL` from config
- No hardcoded credentials - use test data or env variables
- No secrets committed to the repository
- Keep tests independent and idempotent
- Add comments only when the intent is not obvious from the code

## Adding a New Framework

1. Create directory under `frameworks/`
2. Follow the same structure as existing frameworks:
   - Config directory with environment files
   - Fixtures/BaseTest for extension point
   - Pages/ for page objects
   - Tests/ for test specs
   - Utils/ and TestData/ directories
3. Add CI/CD pipeline configuration
4. Add Dockerfile
5. Update root README.md
6. Create framework-specific README.md

## Review Checklist

- [ ] Tests run locally and pass
- [ ] No hardcoded secrets or credentials
- [ ] Page objects follow POM pattern
- [ ] Locators use preferred methods (getByRole, getByLabel, etc.)
- [ ] Tests are independent and idempotent
- [ ] README updated if structure changed
- [ ] CI/CD pipeline updated if needed
