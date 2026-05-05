import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `./config/.env.${process.env.ENV || 'qa'}` });

export default defineConfig({
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
});