using Microsoft.Playwright;

namespace PlaywrightFramework.Pages;

public class ProductPage
{
    private readonly IPage _page;

    public ProductPage(IPage page)
    {
        _page = page;
    }

    private ILocator SortingField => _page.Locator(".product_sort_container").First;
    private ILocator SortingDropdown => _page.Locator(".product_sort_container").First;
    private ILocator Title => _page.Locator(".title").First;
    private ILocator CartContainer => _page.Locator("a[class=\"shopping_cart_link\"]");

    public async Task ClickOnSortingContainerAsync()
    {
        await SortingField.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible });
        await SortingField.ClickAsync();
    }

    public async Task SelectSortingOptionAsync(string optionText)
    {
        await SortingDropdown.SelectOptionAsync(optionText);
    }

    public async Task<double> GetPriceAndClickOnAddToCartButtonAsync()
    {
        var productItems = _page.Locator(".inventory_item");
        var prices = await productItems.Locator(".inventory_item_price").AllTextContentsAsync();

        double lowestPrice = double.MaxValue;
        int lowestIndex = 0;

        for (int i = 0; i < prices.Count; i++)
        {
            var numPrice = double.Parse(prices[i].Replace("$", ""));
            if (numPrice < lowestPrice)
            {
                lowestPrice = numPrice;
                lowestIndex = i;
            }
        }

        var addToCartButton = productItems.Nth(lowestIndex).Locator("button");
        await addToCartButton.ClickAsync();

        return lowestPrice;
    }

    public async Task ClickOnCartContainerAsync()
    {
        await CartContainer.ClickAsync();
    }

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }
}