using Microsoft.Extensions.Configuration;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace csharp_playwright.Fixtures;

public class BaseTest : PageTest
{
    protected IConfiguration Configuration { get; private set; } = null!;
    protected string BaseUrl { get; private set; } = null!;

    [SetUp]
    public void GlobalSetup()
    {
        var environment = Environment.GetEnvironmentVariable("ENV") ?? "qa";

        Configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        BaseUrl = Configuration["BaseUrl"] ?? "https://qa.example.com";
    }
}
