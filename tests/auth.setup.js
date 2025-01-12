import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
 
    await page.goto('http://localhost:3000/login');
  
    await page.fill('input[id="email"]', 'test@test.com');
    await page.fill('input[id="password"]', 'test123');
  
    await page.click('button[type="submit"]');
  
    await page.waitForURL('http://localhost:3000/home');
  
   
    await expect(page).toHaveURL('http://localhost:3000/home');
    
    await page.context.storageState({ path: authFile });

  });