import { test as base } from '@playwright/test';

export const test = base.extend({
  // custom fixtures here
});

export const expect = test.expect;