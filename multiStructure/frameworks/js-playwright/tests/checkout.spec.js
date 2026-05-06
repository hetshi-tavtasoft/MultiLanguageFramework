const { expect } = require('@playwright/test');
const { testData } = require('../utils/testData/testData');
const { constantData } = require('../fixtures/constant');
const { userData } = require('../utils/dataFactory/userData');
const { test: fixtureTest } = require('../fixtures/pageObjects');

fixtureTest.describe('Checkout Information Flow', () => {

  fixtureTest.beforeEach(async ({ loginPage, productPage, yourCartPage }) => {
    await loginPage.navigate();
    await loginPage.loginToSwagLabs(
      testData.user.username,
      testData.user.password
    );
    await productPage.clickOnSortingContainer();
    await productPage.selectSortingOption(constantData.data.sortHighToLowOption);
    await productPage.getPriceAndClickOnAddToCartButton();
    await productPage.clickOnCartContainer();
    await yourCartPage.clickOnCheckoutButton();
  });

  fixtureTest('Verify checkout information page title', async ({ checkoutInformationPage }) => {
    try {
      console.log('Verify that user is navigated to Checkout page');
      const checkoutInformationTitle = await checkoutInformationPage.getTitleText();
      await expect(checkoutInformationTitle).toContain(constantData.data.checkoutInformationTitle);
    } 
    catch (error) {
      try { await checkoutInformationPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  fixtureTest('Enter details and navigate to checkout overview', async ({ checkoutInformationPage, checkoutOverviewPage }) => {
    try {
      console.log('Enter details and click on continue button and verify that user is navigated to Checkout overview page');
      await checkoutInformationPage.enterDetails(userData());
      await checkoutInformationPage.clickOnContinueButton();
      const checkoutOverviewTitle = await checkoutOverviewPage.getTitleText();
      await expect(checkoutOverviewTitle).toContain(constantData.data.checkoutOverviewTitle);
    } 
    catch (error) {
      try { await checkoutInformationPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
