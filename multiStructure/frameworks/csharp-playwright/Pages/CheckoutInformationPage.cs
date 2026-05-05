using Microsoft.Playwright;
using PlaywrightFramework.Utils.DataFactory;

namespace PlaywrightFramework.Pages;

public class CheckoutInformationPage
{
    private readonly IPage _page;

    public CheckoutInformationPage(IPage page)
    {
        _page = page;
    }

    private ILocator Title => _page.Locator(".title").First;
    private ILocator FirstName => _page.Locator("#first-name");
    private ILocator LastName => _page.Locator("#last-name");
    private ILocator ZipCode => _page.Locator("#postal-code");
    private ILocator ContinueButton => _page.Locator("#continue");

    public async Task<string> GetTitleTextAsync()
    {
        return await Title.TextContentAsync() ?? string.Empty;
    }

    public async Task EnterDetailsAsync(UserData data)
    {
        await FirstName.FillAsync(data.FirstName);
        await LastName.FillAsync(data.LastName);
        await ZipCode.FillAsync(data.ZipCode);
    }

    public async Task ClickOnContinueButtonAsync()
    {
        await ContinueButton.ClickAsync();
    }
}