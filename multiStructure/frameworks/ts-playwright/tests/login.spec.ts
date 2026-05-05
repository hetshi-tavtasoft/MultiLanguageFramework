import { test, expect } from '../fixtures/base.fixture';
import { LoginPage } from '../pages/login.page';

test('Verify That user can login', async ({ page }) => {
  const login = new LoginPage(page);

  await page.goto('/');
  await login.login('admin', 'admin');

  await expect(page).toHaveURL(/dashboard/);
});