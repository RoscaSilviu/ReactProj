const { test, expect } = require('@playwright/test');

test('should render the login form correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/login'); // Update with your app's URL

  // Check form elements
  await expect(page.locator('h2')).toHaveText('Login');
  await expect(page.locator('input#email')).toBeVisible();
  await expect(page.locator('input#password')).toBeVisible();
  await expect(page.locator('input#rememberMe')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toHaveText('Login');
});

test('should log in successfully with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login'); // Update with your app's URL

  // Fill out the form
  await page.fill('input#email', 'admin@admin.com');
  await page.fill('input#password', 'admin');
  await page.click('input#rememberMe'); // Check "Remember Me"

  // Submit the form
  await page.click('button[type="submit"]');

  // Check for redirection
  await page.waitForURL('http://localhost:3000/home'); // Assuming successful login redirects to /home
  await expect(page).toHaveURL('http://localhost:3000/home');
});
