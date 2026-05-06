const { expect } = require('@playwright/test');
const { testData } = require('../utils/testData/testData');
const { constantData } = require('../fixtures/constant');
const { test: fixtureTest } = require('../fixtures/pageObjects');

fixtureTest.describe('Products Flow', () => {

  fixtureTest.beforeEach(async ({ loginPage, productPage }) => {
    await loginPage.navigate();
    await loginPage.loginToSwagLabs(
      testData.user.username,
      testData.user.password
    );
  });

  fixtureTest('Sort products by price high to low and add cheapest to cart', async ({ productPage }) => {
    try {
      console.log("Click on sorting container and click on High to low priority button and Add the cheapest product in cart");
      await productPage.clickOnSortingContainer();
      await productPage.selectSortingOption(constantData.data.sortHighToLowOption);
      const cheapestPrice = await productPage.getPriceAndClickOnAddToCartButton();
      await expect(cheapestPrice).toBeGreaterThan(0);
    } 
    catch (error) {
      try { await productPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  fixtureTest('Verify products page title after login', async ({ productPage }) => {
    try {
      console.log("Verify that user is navigated to products page");
      const productTitle = await productPage.getTitleText();
      await expect(productTitle).toContain(constantData.data.productTitle);
    } 
    catch (error) {
      try { await productPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
