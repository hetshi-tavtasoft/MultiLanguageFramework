const dotenv = require('dotenv');
const path = require('path');

const env = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

module.exports = {
  testDir: '../tests',
  timeout: 30000,
  retries: 2,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
};
