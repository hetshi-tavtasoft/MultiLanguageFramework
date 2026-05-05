const { test: base } = require('@playwright/test');
const { LoginPage } = require('../pages/login/loginPage');
const { ProductPage } = require('../pages/products/productsPage');
const { YourCartPage } = require('../pages/yourCart/yourCartPage');
const { CheckoutInformation } = require('../pages/checkout/checkoutInformationPage');
const { CheckoutOverview } = require('../pages/checkout/checkoutOverviewPage');
const { CheckoutComplete } = require('../pages/checkout/checkoutCompletePage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  yourCartPage: async ({ page }, use) => {
    await use(new YourCartPage(page));
  },
  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformation(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverview(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutComplete(page));
  },
});

module.exports = { test };
