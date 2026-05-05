using System.Text.RegularExpressions;
using csharp_playwright.Fixtures;
using csharp_playwright.Pages;
using NUnit.Framework;

namespace csharp_playwright.Tests;

public class LoginTests : BaseTest
{
    [Test]
    public async Task VerifyUserCanLogin()
    {
        var loginPage = new LoginPage(Page);

        await Page.GotoAsync(BaseUrl);
        await loginPage.LoginAsync("admin", "admin");

        await Expect(Page).ToHaveURLAsync(new Regex("dashboard"));
    }
}
