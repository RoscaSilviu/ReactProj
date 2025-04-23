const { test, expect } = require('@playwright/test');

test('should measure the login performance', async ({ page }) => {
  await page.goto('http://localhost:3000/login'); // Update with your app's URL

  // Start tracking performance
  const startTime = Date.now();

  // Fill out the form
  await page.fill('input#email', 'admin@admin.com');
  await page.fill('input#password', 'admin');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for redirection or response
  await page.waitForURL('http://localhost:3000/home'); // Assuming successful login redirects to /home

  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`Login completed in ${duration}ms`);

  // Assert response time is within acceptable limits
  expect(duration).toBeLessThan(2000); // Example threshold: 2 seconds
});
