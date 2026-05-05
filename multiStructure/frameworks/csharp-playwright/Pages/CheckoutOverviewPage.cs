using Microsoft.Playwright;

namespace PlaywrightFramework.Pages;

public class CheckoutOverviewPage
{
    private readonly IPage _page;

    public CheckoutOverviewPage(IPage page)
    {
        _page = page;
    }

    private ILocator Title => _page.Locator(".title").First;
    private ILocator ProductPrice => _page.Locator(".inventory_item_price");
    private ILocator FinishButton => _page.Locator("#finish");

    public async Task<double> GetProductPriceAsync()
    {
        var priceText = await ProductPrice.TextContentAsync();
        return double.Parse(priceText!.Replace("$", ""));
    }

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }

    public async Task ClickOnFinishButtonAsync()
    {
        await FinishButton.ClickAsync();
    }
}