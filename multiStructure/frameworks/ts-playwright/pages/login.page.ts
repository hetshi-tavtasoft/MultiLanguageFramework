import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  username = this.page.locator('#username');
  password = this.page.locator('#password');
  loginBtn = this.page.locator('#login');

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}