#!/usr/bin/env pwsh

# Playwright Multi-Framework Test Runner
# Runs tests for csharp-playwright, ts-playwright, and js-playwright

param(
    [string]$Environment = "qa",
    [string]$Browser = "chromium",
    [switch]$Headed
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Playwright Multi-Framework Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Browser: $Browser" -ForegroundColor Yellow
Write-Host "Headed Mode: $Headed" -ForegroundColor Yellow
Write-Host ""

$baseDir = $PSScriptRoot
$results = @()

# Function to run tests and track results
function Invoke-TestSuite {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "----------------------------------------" -ForegroundColor Green
    Write-Host "Running $Name Tests" -ForegroundColor Green
    Write-Host "----------------------------------------" -ForegroundColor Green
    
    Set-Location $Path
    $exitCode = 0
    try {
        Invoke-Expression $Command
        $exitCode = $LASTEXITCODE
    } catch {
        $exitCode = 1
    }
    
    if ($exitCode -eq 0) {
        Write-Host "✅ $Name tests PASSED" -ForegroundColor Green
        $script:results += [PSCustomObject]@{ Framework = $Name; Status = "PASSED"; ExitCode = $exitCode }
    } else {
        Write-Host "❌ $Name tests FAILED" -ForegroundColor Red
        $script:results += [PSCustomObject]@{ Framework = $Name; Status = "FAILED"; ExitCode = $exitCode }
    }
    
    Write-Host ""
    Set-Location $baseDir
}

# Build headed flag
$headedFlag = if ($Headed) { "--headed" } else { "" }

# Run JS Playwright Tests
Invoke-TestSuite -Name "JS Playwright" -Path "$baseDir\frameworks\js-playwright" -Command "npx playwright test $headedFlag"

# Run TS Playwright Tests  
Invoke-TestSuite -Name "TS Playwright" -Path "$baseDir\frameworks\ts-playwright" -Command "npx playwright test $headedFlag"

# Run C# Playwright Tests
$csCommand = "dotnet test --filter `"BrowserName=$Browser`""
Invoke-TestSuite -Name "C# Playwright" -Path "$baseDir\frameworks\csharp-playwright" -Command $csCommand

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST EXECUTION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -AutoSize

$passed = ($results | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAILED" }).Count

Write-Host "Total: $($results.Count) | Passed: $passed | Failed: $failed" -ForegroundColor Yellow
Write-Host ""

if ($failed -gt 0) {
    Write-Host "❌ Some tests failed!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    exit 0
}
