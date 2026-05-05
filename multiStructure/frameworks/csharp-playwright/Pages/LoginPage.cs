using Microsoft.Playwright;

namespace csharp_playwright.Pages;

public class LoginPage
{
    private readonly IPage _page;

    public LoginPage(IPage page)
    {
        _page = page;
        Username = page.Locator("#username");
        Password = page.Locator("#password");
        LoginButton = page.Locator("#login");
    }

    public ILocator Username { get; }
    public ILocator Password { get; }
    public ILocator LoginButton { get; }

    public async Task LoginAsync(string user, string pass)
    {
        await Username.FillAsync(user);
        await Password.FillAsync(pass);
        await LoginButton.ClickAsync();
    }
}
