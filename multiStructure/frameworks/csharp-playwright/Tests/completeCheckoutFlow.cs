using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using NUnit.Framework;
using Allure.NUnit;
using Allure.NUnit.Attributes;
using PlaywrightFramework.Fixtures;
using PlaywrightFramework.Pages;
using PlaywrightFramework.Utils;
using PlaywrightFramework.Utils.DataFactory;

namespace PlaywrightFramework.Tests;

[AllureNUnit]
public class CompleteFlow
{
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _context;
    private IPage? _page;

    [OneTimeSetUp]
    public void OneTimeSetup()
    {
    }

    [SetUp]
    public async Task SetUp()
    {
        _playwright = await Microsoft.Playwright.Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            ExecutablePath = @"C:\Users\pct113\AppData\Local\ms-playwright\chromium-1217\chrome-win64\chrome.exe",
            Channel = "chrome",
            Headless = false
        });

        _context = await _browser.NewContextAsync();
        _page = await _context.NewPageAsync();
    }

    [TearDown]
    public async Task TearDown()
    {
        await _browser?.CloseAsync();
        _playwright?.Dispose();
    }


    [Test]
    [Category("regression")]
    [Category("critical")]
    public async Task CompleteCheckoutFlow()
    {
        try
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
        catch (Exception ex)
        {
            await _page!.ScreenshotAsync(new PageScreenshotOptions { Path = $"screenshots/{TestContext.CurrentContext.Test.Name}-fail.png" });
            TestContext.WriteLine($"Exception: {ex.Message}");
            TestContext.WriteLine($"Stack Trace: {ex.StackTrace}");
            throw;
        }
    }
}