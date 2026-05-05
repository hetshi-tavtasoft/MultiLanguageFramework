# Troubleshooting

## Common Issues

### Playwright Browsers Not Installing

**Error**: `Executable doesn't exist at ...`

```bash
# TS/JS
npx playwright install --with-deps

# C#
pwsh bin/Debug/net8.0/playwright.ps1 install --with-deps
```

### Tests Fail with `net::ERR_CONNECTION_REFUSED`

**Cause**: `BASE_URL` is incorrect or the application is not running.

**Fix**:
1. Check your `.env` or `appsettings` file has the correct `BASE_URL`
2. Verify the target environment is accessible from your machine
3. In Docker, use `host.docker.internal` instead of `localhost`

### Tests Timeout

**Error**: `Timeout of 30000ms exceeded`

**Fix**:
1. Increase timeout in `playwright.config.{ts,js}`:
   ```typescript
   timeout: 60000,
   ```
2. Or per-test:
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(60000);
   });
   ```

### C# Build Fails

**Error**: `The type or namespace name '...' could not be found`

**Fix**:
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

### Locators Not Finding Elements

1. Open Playwright Inspector:
   ```bash
   npx playwright test --debug
   ```
2. Use the locator picker to find the correct selector
3. Prefer `getByRole()` over CSS selectors
4. Check if the element is inside an iframe or shadow DOM

### Tests Pass Locally but Fail in CI

Common causes:
- **Different environment**: CI uses `ENV=qa` by default
- **Missing env variables**: Check CI secret configuration
- **Browser differences**: CI may use a different browser
- **Timing issues**: CI machines are slower; increase timeouts
- **Headless mode**: Some elements behave differently in headless mode

### npm install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Build with no cache
docker compose -f infra/docker/docker-compose.yml build --no-cache
```

### Reports Not Generating

1. Ensure tests actually ran (check terminal output)
2. Check `playwright.config` has `reporter` configured:
   ```typescript
   reporter: [['html'], ['list']],
   ```
3. For C#, check `TestResults/` directory exists

### GitLab CI Caching Issues

If dependencies are stale:
1. Clear cache in GitLab UI (CI/CD > Pipelines > Clear cache)
2. Or change the cache key in `.gitlab-ci.yml`

### "Page.goto: Navigation timeout" in Docker

The application may not be reachable from the container:
1. Use `host.docker.internal` instead of `localhost`
2. Or add `--network host` to `docker run`
3. Ensure the target application allows container IP addresses

### Tracing

Enable tracing for debugging:

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',
}
```

View traces:
```bash
npx playwright show-trace test-results/trace.zip
```
