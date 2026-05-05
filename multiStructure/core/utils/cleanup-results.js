const fs = require('fs');
const path = require('path');

const dirs = [
  '../../frameworks/ts-playwright/test-results',
  '../../frameworks/ts-playwright/playwright-report',
  '../../frameworks/js-playwright/test-results',
  '../../frameworks/js-playwright/playwright-report',
  '../../frameworks/csharp-playwright/TestResults',
  '../../frameworks/csharp-playwright/bin',
  '../../frameworks/csharp-playwright/obj',
];

const maxAgeDays = parseInt(process.argv[2], 10) || 7;
const now = new Date();

dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;

  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  items.forEach((item) => {
    const itemPath = path.join(fullPath, item.name);
    const stats = fs.statSync(itemPath);
    const ageDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);

    if (ageDays > maxAgeDays) {
      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`Deleted: ${itemPath}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`Deleted: ${itemPath}`);
      }
    }
  });
});

console.log('Cleanup complete');
