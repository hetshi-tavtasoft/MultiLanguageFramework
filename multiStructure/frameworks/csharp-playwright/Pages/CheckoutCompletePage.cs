using Microsoft.Playwright;

namespace PlaywrightFramework.Pages;

public class CheckoutCompletePage
{
    private readonly IPage _page;

    public CheckoutCompletePage(IPage page)
    {
        _page = page;
    }

    private ILocator Title => _page.Locator(".complete-header").First;

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }
}