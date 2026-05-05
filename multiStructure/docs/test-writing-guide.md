# Test Writing Guide

## Test Structure

### TypeScript

```typescript
import { test, expect } from '../fixtures/base.fixture';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test('Verify user can login', async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login('admin', 'admin');
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### JavaScript

```javascript
const { test, expect } = require('../fixtures/base.fixture');
const { LoginPage } = require('../pages/login.page');

test.describe('Login', () => {
  test('Verify user can login', async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login('admin', 'admin');
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### C#

```csharp
using csharp_playwright.Fixtures;
using csharp_playwright.Pages;
using NUnit.Framework;

namespace csharp_playwright.Tests;

public class LoginTests : BaseTest
{
    [Test]
    public async Task VerifyUserCanLogin()
    {
        var loginPage = new LoginPage(Page);
        await Page.GotoAsync(BaseUrl);
        await loginPage.LoginAsync("admin", "admin");
        await Expect(Page).ToHaveURLAsync(new Regex("dashboard"));
    }
}
```

## Page Object Pattern

### Rules

1. **One class per page/screen** - Each UI page gets its own class
2. **Locators as properties** - All selectors are class properties, not scattered in tests
3. **Actions as methods** - User flows are named methods, not raw locator calls
4. **No assertions in pages** - Page objects interact; tests assert

### Template

```typescript
// TypeScript
import { Page } from '@playwright/test';

export class SomePage {
  constructor(private page: Page) {}

  // Locators
  element = this.page.locator('#element');
  items = this.page.locator('.item');

  // Actions
  async action(): Promise<void> {
    await this.element.click();
  }

  // Getters for dynamic data
  async getItemText(index: number): Promise<string> {
    return this.items.nth(index).textContent() as Promise<string>;
  }
}
```

## Locators Priority

Use Playwright's locators in this order:

1. `getByRole()` - Most resilient, maps to accessibility tree
2. `getByText()` - Good for visible text content
3. `getByLabel()` - Best for form inputs
4. `getByPlaceholder()` - Good for input placeholders
5. `getByTestId()` - When nothing else works (requires `data-testid` attributes)
6. `locator()` - CSS/XPath as last resort

```typescript
// Preferred
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Username');

// Avoid
page.locator('#submit-btn');
page.locator('div > span:nth-child(3)');
```

## Assertions

### Common Assertions

```typescript
// Page state
await expect(page).toHaveTitle(/Dashboard/);
await expect(page).toHaveURL(/dashboard/);

// Element visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Element state
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();

// Text content
await expect(element).toHaveText('Expected text');
await expect(element).toContainText('partial');

// Count
await expect(items).toHaveCount(5);

// Value
await expect(input).toHaveValue('entered text');
```

## Test Data Management

### Inline (Simple)

```typescript
test('login test', async ({ page }) => {
  await login.login('admin', 'admin123');
});
```

### From Core Test Data

```typescript
import testUsers from '../../../core/test-data/users/users.json';

test('login as admin', async ({ page }) => {
  const admin = testUsers.admin;
  await login.login(admin.username, admin.password);
});
```

### Data-Driven Tests

```typescript
import invalidUsers from '../../../core/test-data/users/invalidUsers.json';

for (const scenario of invalidUsers.invalidCredentials) {
  test(`fails with ${scenario.username}`, async ({ page }) => {
    await login.login(scenario.username, scenario.password);
    await expect(login.errorMsg).toHaveText(scenario.expectedError);
  });
}
```

## Fixtures

Add custom fixtures in the base fixture file to share state across tests:

### TypeScript/JavaScript

```typescript
// fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { ApiClient } from '../../../core/api-clients/rest-client-templates/ts/apiClient';

type MyFixtures = {
  apiClient: ApiClient;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  apiClient: async ({ baseURL }, use) => {
    const client = new ApiClient(baseURL!);
    await client.login('admin', 'admin123');
    await use(client);
  },
});
```

### C#

```csharp
// Fixtures/BaseTest.cs
public class BaseTest : PageTest
{
    protected ApiClient ApiClient { get; private set; } = null!;

    [SetUp]
    public async Task Setup()
    {
        ApiClient = new ApiClient(BaseUrl);
        await ApiClient.LoginAsync("admin", "admin123");
    }
}
```

## Best Practices

1. **Keep tests independent** - No test should depend on another test's state
2. **Use `test.describe()`** for grouping related tests
3. **One assertion per test** when possible, or assertions that verify a single behavior
4. **Use `test.beforeEach()`** for shared setup within a describe block
5. **Clean up after tests** using `test.afterEach()` or fixtures
6. **Avoid hardcoded waits** - Use Playwright's auto-waiting
7. **Name tests clearly** - "Verify that X happens when Y" not "test 1"
