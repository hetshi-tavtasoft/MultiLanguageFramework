#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const reportDir = process.argv[2] || '../../frameworks';
const outputDir = path.join(__dirname, '../../docs');

function aggregateReports() {
  const frameworks = ['ts-playwright', 'js-playwright', 'csharp-playwright'];
  const summary = {
    generatedAt: new Date().toISOString(),
    frameworks: {},
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0,
    totalSkipped: 0,
  };

  frameworks.forEach((fw) => {
    const reportPath = path.join(reportDir, fw, 'playwright-report');
    const resultsPath = path.join(reportDir, fw, 'test-results');
    const testResultsPath = path.join(reportDir, fw, 'TestResults');

    let status = 'not-run';
    if (fs.existsSync(reportPath) || fs.existsSync(testResultsPath)) {
      status = 'completed';
    } else if (fs.existsSync(resultsPath)) {
      status = 'has-results';
    }

    summary.frameworks[fw] = { status };
  });

  const outputPath = path.join(outputDir, 'test-summary.json');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

  console.log(`Test summary generated: ${outputPath}`);
  console.log(JSON.stringify(summary, null, 2));
}

aggregateReports();
