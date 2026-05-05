using System.Net.Http.Json;

namespace Core.ApiClients;

public class ApiClient
{
    private readonly HttpClient _httpClient;
    private string? _token;

    public ApiClient(string baseUrl)
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(baseUrl),
            DefaultRequestHeaders = { { "Accept", "application/json" } }
        };
    }

    public async Task<string> LoginAsync(string username, string password)
    {
        var response = await _httpClient.PostAsJsonAsync("auth/login", new { username, password });
        var data = await response.Content.ReadFromJsonAsync<LoginResponse>();
        _token = data?.Token;
        return _token ?? string.Empty;
    }

    private void SetAuthHeader()
    {
        if (!string.IsNullOrEmpty(_token))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _token);
        }
    }

    public async Task<T?> GetAsync<T>(string path)
    {
        SetAuthHeader();
        return await _httpClient.GetFromJsonAsync<T>(path);
    }

    public async Task<T?> PostAsync<T>(string path, object body)
    {
        SetAuthHeader();
        var response = await _httpClient.PostAsJsonAsync(path, body);
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task<T?> PutAsync<T>(string path, object body)
    {
        SetAuthHeader();
        var response = await _httpClient.PutAsJsonAsync(path, body);
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task DeleteAsync(string path)
    {
        SetAuthHeader();
        await _httpClient.DeleteAsync(path);
    }
}

public class LoginResponse
{
    public string? Token { get; set; }
    public int ExpiresIn { get; set; }
}
