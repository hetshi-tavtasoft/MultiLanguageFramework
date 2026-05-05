using Microsoft.Playwright;

namespace PlaywrightFramework.Pages;

public class YourCartPage
{
    private readonly IPage _page;

    public YourCartPage(IPage page)
    {
        _page = page;
    }

    private ILocator ItemPrice => _page.Locator(".inventory_item_price");
    private ILocator CheckoutButton => _page.Locator("#checkout");
    private ILocator Title => _page.Locator(".title").First;

    public async Task<double> GetPriceAsync()
    {
        var priceText = await ItemPrice.TextContentAsync();
        return double.Parse(priceText!.Replace("$", ""));
    }

    public async Task ClickOnCheckoutButtonAsync()
    {
        await CheckoutButton.ClickAsync();
    }

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }
}