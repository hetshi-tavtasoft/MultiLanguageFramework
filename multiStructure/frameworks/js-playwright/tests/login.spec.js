const { test, expect } = require('../fixtures/base.fixture');
const { LoginPage } = require('../pages/login.page');

test('Verify That user can login', async ({ page }) => {
  const login = new LoginPage(page);

  await page.goto('/');
  await login.login('admin', 'admin');

  await expect(page).toHaveURL(/dashboard/);
});
