import { test, expect } from '../fixtures/pageFixtures';
import { testData } from '../utils/testData/testData';
import { constantData } from '../fixtures/constant';

test.describe('Products Flow', () => {

  test.beforeEach(async ({ loginPage, productPage }) => {
    await loginPage.navigate();
    await loginPage.loginToSwagLabs(
      testData.user.username,
      testData.user.password
    );
  });

  test('Sort products by price high to low and add cheapest to cart', async ({ productPage }) => {
    try {
      console.log("Click on sorting container and click on High to low priority button and Add the cheapest product in cart");
      await productPage.clickOnSortingContainer();
      await productPage.selectSortingOption(constantData.data.sortHighToLowOption);
      const cheapestPrice = await productPage.getPriceAndClickOnAddToCartButton();
      await expect(cheapestPrice).toBeGreaterThan(0);
    } 
    catch (error: any) {
      try { await productPage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

  test('Verify products page title after login', async ({ productPage }) => {
    try {
      console.log("Verify that user is navigated to products page");
      const productTitle = await productPage.getTitleText();
      await expect(productTitle).toContain(constantData.data.productTitle);
    } 
    catch (error: any) {
      try { await productPage.page.screenshot({ path: `./screenshots/${test.info().title}-fail.png` }); } catch (e) {}
      console.error(`Exception: ${error.message}`);
      console.error(`Stack Trace: ${error.stack}`);
      throw error;
    }
  });

});
