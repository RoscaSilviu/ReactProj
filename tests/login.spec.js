const { test, expect } = require('@playwright/test');

test('login failed', async ({ page }) => {
 
  await page.goto('http://localhost:3000/login');

  await page.fill('input[id="email"]', 'test@test.com');
  await page.fill('input[id="password"]', 'test124');

  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:3000/home');

  await expect(page).toHaveURL('http://localhost:3000/home');

});

test('navigate to home with authenticated state', async ({ page }) => {
  await page.goto('http://localhost:5000/home');

});
  