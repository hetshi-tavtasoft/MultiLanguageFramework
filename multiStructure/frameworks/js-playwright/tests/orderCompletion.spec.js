const { expect } = require('@playwright/test');
const { testData } = require('../utils/testData/testData');
const { constantData } = require('../fixtures/constant');
const { userData } = require('../utils/dataFactory/userData');
const { test: fixtureTest } = require('../fixtures/pageObjects');

fixtureTest.describe('Order Completion Flow', () => {

  fixtureTest.beforeEach(async ({ loginPage, productPage, yourCartPage, checkoutInformationPage }) => {
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
    await checkoutInformationPage.enterDetails(userData());
    await checkoutInformationPage.clickOnContinueButton();
  });

  fixtureTest('Verify product details in checkout overview', async ({ checkoutOverviewPage }) => {
    try {
      console.log('Verify product details in checkout overview page');
      const currentProductPrice = await checkoutOverviewPage.getProductPrice();
      await expect(currentProductPrice).toBeGreaterThan(0);
    } 
    catch (error) {
      try { await checkoutOverviewPage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  fixtureTest('Complete checkout and verify success header', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
    try {
      console.log('Verify product details and click on Finish button');
      await checkoutOverviewPage.clickOnFinishButton();

      console.log('Verify success header');
      const successHeader = await checkoutCompletePage.getTitleText();
      await expect(successHeader).toEqual(constantData.data.checkoutSuccessHeader);
    } 
    catch (error) {
      try { await checkoutCompletePage.page.screenshot({ path: `./screenshots/${fixtureTest.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
