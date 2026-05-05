const fs = require('fs');
const path = require('path');

function generateUsers(count = 10) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: `User${i}@1234`,
      role: i === 1 ? 'admin' : 'user',
      isActive: true,
    });
  }
  return users;
}

function generateProducts(count = 20) {
  const categories = ['Electronics', 'Accessories', 'Software', 'Services'];
  const products = [];
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      price: Math.round((Math.random() * 500 + 10) * 100) / 100,
      category: categories[i % categories.length],
      sku: `SKU-${String(i).padStart(4, '0')}`,
      inStock: Math.random() > 0.2,
    });
  }
  return products;
}

function saveData(filename, data) {
  const outputPath = path.join(__dirname, '../test-data', filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Generated: ${outputPath}`);
}

const count = parseInt(process.argv[2], 10) || 10;

saveData('users/generated-users.json', generateUsers(count));
saveData('products/generated-products.json', generateProducts(count * 2));

console.log(`Generated ${count} users and ${count * 2} products`);
