class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.title = page.locator('.login_container div.login_logo'); 
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
    await this.page.waitForLoadState('networkidle');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
    await this.page.waitForURL('**/inventory.html');
  }

  async loginToSwagLabs(username, password) {
    await this.navigate();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getTitleText() {
    return await this.title.first().textContent();
  }
}

module.exports = { LoginPage };