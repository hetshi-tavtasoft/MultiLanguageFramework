class CheckoutComplete {
    constructor(page) {
      this.page = page;
  
      this.title = page.locator('.complete-header');
    }
  
    async getTitleText() {
      return await this.title.first().textContent();
    }

  }
  
  module.exports = { CheckoutComplete };