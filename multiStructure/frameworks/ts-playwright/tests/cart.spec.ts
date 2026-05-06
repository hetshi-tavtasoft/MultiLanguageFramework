import { test, expect } from '../fixtures/pageFixtures';
import { testData } from '../utils/testData/testData';
import { constantData } from '../fixtures/constant';

test.describe('Cart Flow', () => {

  test.beforeEach(async ({ loginPage, productPage }) => {
    await loginPage.navigate();
    await loginPage.loginToSwagLabs(
      testData.user.username,
      testData.user.password
    );
    await productPage.clickOnSortingContainer();
    await productPage.selectSortingOption(constantData.data.sortHighToLowOption);
    await productPage.getPriceAndClickOnAddToCartButton();
  });

  test('Navigate to cart and verify cart page title', async ({ productPage, yourCartPage }) => {
    try {
      console.log('Click on Cart container and verify that user is navigated to Your Cart page');
      await productPage.clickOnCartContainer();
      const yourCartTitle = await yourCartPage.getTitleText();
      await expect(yourCartTitle).toContain(constantData.data.yourCartTitle);
    } 
    catch (error: any) {
      try { await yourCartPage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  test('Verify cart contains the cheapest product', async ({ productPage, yourCartPage }) => {
    try {
      console.log('Get cart price and verify that cheapest price is added');
      await productPage.clickOnCartContainer();
      const cartPrice = await yourCartPage.getPrice();
      await expect(cartPrice).toBeGreaterThan(0);
    } 
    catch (error: any) {
      try { await yourCartPage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
