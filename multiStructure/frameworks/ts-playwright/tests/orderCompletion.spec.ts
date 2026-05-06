import { test, expect } from '../fixtures/pageFixtures';
import { testData } from '../utils/testData/testData';
import { constantData } from '../fixtures/constant';
import { userData } from '../utils/dataFactory/userData';

test.describe('Order Completion Flow', () => {

  test.beforeEach(async ({ loginPage, productPage, yourCartPage, checkoutInformationPage }) => {
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

  test('Verify product details in checkout overview', async ({ checkoutOverviewPage }) => {
    try {
      console.log('Verify product details in checkout overview page');
      const currentProductPrice = await checkoutOverviewPage.getProductPrice();
      await expect(currentProductPrice).toBeGreaterThan(0);
    } 
    catch (error: any) {
      try { await checkoutOverviewPage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  test('Complete checkout and verify success header', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
    try {
      console.log('Verify product details and click on Finish button');
      await checkoutOverviewPage.clickOnFinishButton();

      console.log('Verify success header');
      const successHeader = await checkoutCompletePage.getTitleText();
      await expect(successHeader).toEqual(constantData.data.checkoutSuccessHeader);
    } 
    catch (error: any) {
      try { await checkoutCompletePage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
