class ProductPage {
    constructor(page) {
      this.page = page;
  
      this.sortingField = page.locator('.product_sort_container');
      this.sortingDropdown = page.locator('.product_sort_container');
      this.price = page.locator('inventory-item-price');
      this.title = page.locator('.title');
      this.cartContainer = page.locator('a[class="shopping_cart_link"]');
    }
  
    async clickOnSortingContainer() {
        await this.sortingField.waitFor({ state: 'visible' });
        await this.sortingField.click();
    }
  
    async selectSortingOption(optionText) {
      await this.sortingDropdown.selectOption({ label: optionText });
    }
 
    async getPriceAndClickOnAddToCartButton() {
      const productItems = this.page.locator('.inventory_item');
      const prices = await productItems.locator('.inventory_item_price').allTextContents();
        let lowestPrice = Infinity;
        let lowestIndex = 0;

        prices.forEach((price, index) => {
            const numPrice = parseFloat(price.replace('$', ''));
            if (numPrice < lowestPrice) {
                lowestPrice = numPrice;
                lowestIndex = index;
            }
        });

        const addToCartButton = productItems.nth(lowestIndex).locator('button');
        await addToCartButton.click();

        return lowestPrice;
    }

    async clickOnCartContainer(){
        await this.cartContainer.click();
    }
    
    async getTitleText() {
      return await this.title.first().textContent();
    }
  }
  
  module.exports = { ProductPage };