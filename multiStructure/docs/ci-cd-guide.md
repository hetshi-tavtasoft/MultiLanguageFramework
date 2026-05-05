# CI/CD Guide

## Overview

All CI/CD configurations are in `infra/ci-cd/` with support for three platforms:

| Platform | Directory | Files |
|----------|-----------|-------|
| GitHub Actions | `ci-cd/github-actions/` | `all-frameworks.yml`, per-framework pipelines |
| GitLab CI | `ci-cd/gitlab-ci/` | `.gitlab-ci.yml` |
| Azure DevOps | `ci-cd/azure-pipelines/` | `azure-pipelines.yml` |

## GitHub Actions

### Setup

1. Copy the desired workflow to `.github/workflows/` in your repository:

```bash
cp infra/ci-cd/github-actions/all-frameworks.yml .github/workflows/
```

2. Configure repository secrets (Settings > Secrets > Actions):

| Secret | Description |
|--------|-------------|
| `BASE_URL` | Test environment URL |
| `TEST_USERNAME` | Test account username |
| `TEST_PASSWORD` | Test account password |

3. Configure environment variables in the workflow or via repository variables.

### Manual Trigger

The `all-frameworks.yml` supports `workflow_dispatch` with inputs:

- **environment**: Select `qa` or `uat`
- **frameworks**: Comma-separated list (`ts`, `js`, `csharp`)

### Per-Framework Pipelines

Individual pipelines (`ts-playwright.yml`, `js-playwright.yml`, `csharp-playwright.yml`) trigger only when their framework's files change, reducing CI time.

## GitLab CI

### Setup

1. Copy `.gitlab-ci.yml` to the repository root:

```bash
cp infra/ci-cd/gitlab-ci/.gitlab-ci.yml .gitlab-ci.yml
```

2. Configure CI/CD variables (Settings > CI/CD > Variables):

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Test environment URL |
| `TEST_USERNAME` | Test account username |
| `TEST_PASSWORD` | Test account password |

### Features

- **Path-based triggers**: Jobs only run when relevant framework files change
- **Caching**: npm and NuGet packages cached between runs
- **Artifacts**: Reports retained for 30 days
- **Manual triggers**: All jobs can be run manually

## Azure DevOps

### Setup

1. Create a new pipeline in Azure DevOps
2. Select "Existing Azure Pipelines YAML file"
3. Point to `infra/ci-cd/azure-pipelines/azure-pipelines.yml`

4. Configure pipeline variables:

| Variable | Description |
|----------|-------------|
| `ENV` | Environment (qa/uat) |
| `BASE_URL` | Test environment URL |
| `NODE_VERSION` | Node.js version (default: 20.x) |
| `DOTNET_VERSION` | .NET SDK version (default: 8.x) |

### Structure

Three stages run in parallel:
- `TypeScriptTests`
- `JavaScriptTests`
- `CSharpTests`

Each stage installs dependencies, runs tests, and publishes reports as artifacts.

## Common Configuration

### Environment Selection

All pipelines use the `ENV` variable to select the target environment:

```yaml
env:
  ENV: ${{ github.event.inputs.environment || 'qa' }}
```

### Browser Matrix

GitHub Actions pipelines run tests across all three browsers by default:
- chromium
- firefox
- webkit

### Artifact Retention

Test reports are uploaded as artifacts with 30-day retention:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: playwright-report-ts
    path: frameworks/ts-playwright/playwright-report/
    retention-days: 30
```

## Scheduling

Add scheduled runs to any GitHub Actions workflow:

```yaml
on:
  schedule:
    - cron: '0 6 * * 1-5'  # Weekdays at 6 AM UTC
```

## Notifications

Add Slack/email notifications on failure:

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Playwright tests failed: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
