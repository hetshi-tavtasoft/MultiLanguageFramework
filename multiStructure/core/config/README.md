# Shared Environment Configuration

This directory contains shared configuration templates for all frameworks.

## Files

| File | Purpose |
|------|---------|
| `.env.template` | Master environment variable template (copy to each framework) |
| `environments.json` | Centralized environment definitions with URLs and settings |

## Usage

1. Copy `.env.template` to your framework's config directory
2. Rename to `.env` or `.env.{environment}` as needed
3. Fill in actual values (never commit secrets)
4. Use `environments.json` as a reference for all available environments

## Secret Management

For CI/CD, store sensitive values (passwords, tokens) in your platform's secret store:
- **GitHub Actions**: Repository Settings > Secrets
- **GitLab CI**: Settings > CI/CD > Variables
- **Azure DevOps**: Pipelines > Library > Variable Groups
- **Local**: Use `.env` files (never committed)
