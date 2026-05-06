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
public class ProgramTests
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
        var isWindows = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(
            System.Runtime.InteropServices.OSPlatform.Windows);
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Channel = isWindows ? "chrome" : "chromium",
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
    [Category("smoke")]
    [Category("regression")]
    public async Task NavigateAndVerifySwagLabsDashboard()
    {
        try
        {
            var loginPage = new LoginPage(_page!);
            await loginPage.NavigateAsync();
            var headerText = await loginPage.GetTitleTextAsync();
            Assert.That(headerText, Does.Contain(ConstantData.Data.DashboardTitle));
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