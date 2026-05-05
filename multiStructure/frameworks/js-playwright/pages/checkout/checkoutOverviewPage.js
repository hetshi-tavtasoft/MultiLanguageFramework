class CheckoutOverview {
  constructor(page) {
    this.page = page;

    this.title = page.locator('.title');
    this.productPrice = page.locator('.inventory_item_price');
    this.finishButton = page.locator('#finish');
  }

  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText.replace('$', ''));
  }

  async getTitleText() {
    return await this.title.first().textContent();
  }

  async clickOnFinishButton() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutOverview };