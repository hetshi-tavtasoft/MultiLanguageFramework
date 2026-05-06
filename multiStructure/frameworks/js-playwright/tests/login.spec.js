const { expect } = require('@playwright/test');
const { testData } = require('../utils/testData/testData');
const { constantData } = require('../fixtures/constant');
const { test: fixtureTest } = require('../fixtures/pageObjects');

fixtureTest.describe('Login Flow', () => {

  fixtureTest('Navigate and verify Swag Labs dashboard', async ({ loginPage }) => {
    try {
      console.log("Navigate and Verify that user is navigated to Swag labs dashboard");
      await loginPage.navigate();
      const headerText = await loginPage.getTitleText();
      await expect(headerText).toContain(constantData.data.dashboardTitle);
    } 
    catch (error) {
      try { await loginPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  fixtureTest('Login to Swag Labs with valid credentials', async ({ loginPage, productPage }) => {
    try {
      console.log("Navigate and Login to Swag labs with valid username and password");
      await loginPage.navigate();
      await loginPage.loginToSwagLabs(
        testData.user.username,
        testData.user.password
      );

      console.log("Verify that user is navigated to products page");
      const productTitle = await productPage.getTitleText();
      await expect(productTitle).toContain(constantData.data.productTitle);
    } 
    catch (error) {
      try { await loginPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
