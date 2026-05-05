using Bogus;

namespace PlaywrightFramework.Utils.DataFactory;

public class UserData
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;

    public static UserData Generate()
    {
        var faker = new Faker();
        return new UserData
        {
            FirstName = faker.Name.FirstName(),
            LastName = faker.Name.LastName(),
            ZipCode = faker.Address.ZipCode()
        };
    }
}