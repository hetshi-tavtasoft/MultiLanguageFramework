using Microsoft.Playwright;

namespace PlaywrightFramework.Pages;

public class LoginPage
{
    private readonly IPage _page;

    public LoginPage(IPage page)
    {
        _page = page;
    }

    private ILocator UsernameInput => _page.Locator("#user-name");
    private ILocator PasswordInput => _page.Locator("#password");
    private ILocator LoginButton => _page.Locator("#login-button");
    private ILocator Title => _page.Locator(".login_container div.login_logo").First;

    public async Task NavigateAsync()
    {
        await _page.GotoAsync("https://www.saucedemo.com/");
        await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }

    public async Task EnterUsernameAsync(string username)
    {
        await UsernameInput.FillAsync(username);
    }

    public async Task EnterPasswordAsync(string password)
    {
        await PasswordInput.FillAsync(password);
    }

    public async Task ClickLoginAsync()
    {
        await LoginButton.ClickAsync();
        await _page.WaitForURLAsync("**/inventory.html");
    }

    public async Task LoginToSwagLabsAsync(string username, string password)
    {
        await NavigateAsync();
        await EnterUsernameAsync(username);
        await EnterPasswordAsync(password);
        await ClickLoginAsync();
    }

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }
}