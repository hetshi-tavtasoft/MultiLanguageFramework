using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using NUnit.Framework;
using Allure.NUnit.Attributes;
using PlaywrightFramework.Fixtures;
using PlaywrightFramework.Pages;
using PlaywrightFramework.Utils;
using PlaywrightFramework.Utils.DataFactory;

namespace PlaywrightFramework.Tests;

public class ProgramTests
{
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _context;
    private IPage? _page;


    [Test]
    public async Task NavigateAndVerifySwagLabsDashboard()
    {
        var loginPage = new LoginPage(_page!);
        await loginPage.NavigateAsync();
        var headerText = await loginPage.GetTitleTextAsync();
        Assert.That(headerText, Does.Contain(ConstantData.Data.DashboardTitle));
    }

    [Test]
    public async Task LoginToSwagLabsWithValidCredentials()
    {
        var loginPage = new LoginPage(_page!);
        var productPage = new ProductPage(_page!);

        await loginPage.NavigateAsync();
        await loginPage.LoginToSwagLabsAsync(TestData.User.Username, TestData.User.Password);

        var productTitle = await productPage.GetTitleTextAsync();
        Assert.That(productTitle, Does.Contain(ConstantData.Data.ProductTitle));
    }

    [Test]
    public async Task AddCheapestProductToCart()
    {
        var loginPage = new LoginPage(_page!);
        var productPage = new ProductPage(_page!);

        await loginPage.NavigateAsync();
        await loginPage.LoginToSwagLabsAsync(TestData.User.Username, TestData.User.Password);
        await productPage.ClickOnSortingContainerAsync();
        await productPage.SelectSortingOptionAsync(ConstantData.Data.SortHighToLowOption);
        var cheapestPrice = await productPage.GetPriceAndClickOnAddToCartButtonAsync();

        Assert.That(cheapestPrice, Is.GreaterThan(0));
    }

    [Test]
    public async Task VerifyCartContainsCheapestProduct()
    {
        var loginPage = new LoginPage(_page!);
        var productPage = new ProductPage(_page!);
        var yourCartPage = new YourCartPage(_page!);

        await loginPage.NavigateAsync();
        await loginPage.LoginToSwagLabsAsync(TestData.User.Username, TestData.User.Password);
        await productPage.ClickOnSortingContainerAsync();
        await productPage.SelectSortingOptionAsync(ConstantData.Data.SortHighToLowOption);
        var cheapestPrice = await productPage.GetPriceAndClickOnAddToCartButtonAsync();
        await productPage.ClickOnCartContainerAsync();

        var cartPrice = await yourCartPage.GetPriceAsync();
        Assert.That(cartPrice, Is.EqualTo(cheapestPrice));
    }

    [Test]
    public async Task CompleteCheckoutFlow()
    {
        var loginPage = new LoginPage(_page!);
        var productPage = new ProductPage(_page!);
        var yourCartPage = new YourCartPage(_page!);
        var checkoutInformationPage = new CheckoutInformationPage(_page!);
        var checkoutOverviewPage = new CheckoutOverviewPage(_page!);
        var checkoutCompletePage = new CheckoutCompletePage(_page!);

        await loginPage.NavigateAsync();
        await loginPage.LoginToSwagLabsAsync(TestData.User.Username, TestData.User.Password);
        await productPage.ClickOnSortingContainerAsync();
        await productPage.SelectSortingOptionAsync(ConstantData.Data.SortHighToLowOption);
        var cheapestPrice = await productPage.GetPriceAndClickOnAddToCartButtonAsync();
        await productPage.ClickOnCartContainerAsync();

        await yourCartPage.ClickOnCheckoutButtonAsync();
        await checkoutInformationPage.EnterDetailsAsync(UserData.Generate());
        await checkoutInformationPage.ClickOnContinueButtonAsync();

        var currentProductPrice = await checkoutOverviewPage.GetProductPriceAsync();
        Assert.That(currentProductPrice, Is.EqualTo(cheapestPrice));

        await checkoutOverviewPage.ClickOnFinishButtonAsync();

        var successHeader = await checkoutCompletePage.GetTitleTextAsync();
        Assert.That(successHeader, Is.EqualTo(ConstantData.Data.CheckoutSuccessHeader));
    }
}