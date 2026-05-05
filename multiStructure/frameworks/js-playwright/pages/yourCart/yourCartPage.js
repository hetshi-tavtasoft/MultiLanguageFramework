class YourCartPage {
    constructor(page) {
      this.page = page;
  
      this.itemPrice = page.locator('.inventory_item_price');
      this.checkoutButton = page.locator('#checkout');
      this.title = page.locator('.title');
    }
  
    async getPrice() {
        const priceText = await this.itemPrice.textContent();
        return parseFloat(priceText.replace('$', ''));
    }
  
    async clickOnCheckoutButton() {
      await this.checkoutButton.click();
    }

    async getTitleText() {
      return await this.title.first().textContent();
    }
  }
  
  module.exports = {YourCartPage };