class CheckoutInformation {
    constructor(page) {
      this.page = page;
  
      this.title = page.locator('.title');
      this.firstName = page.locator('#first-name');
      this.lastName = page.locator('#last-name');
      this.zipcode = page.locator('#postal-code');
      this.continueButton = page.locator('#continue');
    }
  
    async clickOnCheckoutButton() {
      await this.checkoutButton.click();
    }

    async getTitleText() {
      return await this.title.first().textContent();
    }

    async enterDetails(data){
      await this.firstName.fill(data.firstname);
      await this.lastName.fill (data.lastname);
      await this.zipcode.fill(data.zipcode);
    } 

    async clickOnContinueButton(){
      await this.continueButton.click();
    }
  }
  
  module.exports = { CheckoutInformation };