# Core Utilities

Shared scripts and resources used across all frameworks.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `aggregate-reports.js` | Collects test results from all frameworks into a single summary | `node aggregate-reports.js [frameworks-dir]` |
| `generate-test-data.js` | Generates test data (users, products) for testing | `node generate-test-data.js [count]` |
| `cleanup-results.js` | Removes old test results and reports older than N days | `node cleanup-results.js [days]` |

## Directory Structure

```
core/
├── api-clients/
│   ├── postman/          # Postman collections for API testing
│   ├── openapi/          # OpenAPI/Swagger specifications
│   └── rest-client-templates/
│       ├── ts/           # TypeScript REST client template
│       ├── js/           # JavaScript REST client template
│       └── csharp/       # C# REST client template
├── config/
│   └── templates/        # Shared environment and config templates
├── test-data/
│   ├── users/            # User test data (valid, invalid, security)
│   ├── products/         # Product catalog test data
│   └── payloads/         # API request/response payloads
└── utils/
    ├── aggregate-reports.js   # Report aggregation script
    ├── generate-test-data.js  # Test data generator
    └── cleanup-results.js     # Cleanup old results
```
