const { test: base } = require('@playwright/test');

const test = base.extend({
  // custom fixtures here
});

const expect = test.expect;

module.exports = { test, expect };
