
import { test, expect } from '@playwright/test';
import { connectToMongo, closeMongoConnection } from './utils/mongo';

const LOGIN_URL = process.env.LOGIN_URL || 'https://www.saucedemo.com/v1/index.html';

// Credentials as shown on the saucedemo login page
const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const INVALID_USERNAME = 'invalid_user';
const INVALID_PASSWORD = 'invalid_pass';

test.describe('SauceDemo Login', () => {
  let db: any;
  test.beforeAll(async () => {
    db = await connectToMongo();
  });
  test.afterAll(async () => {
    await closeMongoConnection();
  });

  test('Positive: should login successfully with valid credentials', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('#user-name', VALID_USERNAME);
    await page.fill('#password', VALID_PASSWORD);
    await page.click('#login-button');
    // Successful login redirects to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    // Log to MongoDB
    await db.collection('loginAttempts').insertOne({
      username: VALID_USERNAME,
      password: VALID_PASSWORD,
      result: 'success',
      timestamp: new Date()
    });
  });

  test('Negative: should show error with invalid credentials', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.fill('#user-name', INVALID_USERNAME);
    await page.fill('#password', INVALID_PASSWORD);
    await page.click('#login-button');
    // Error message should be visible
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    // Log to MongoDB
    await db.collection('loginAttempts').insertOne({
      username: INVALID_USERNAME,
      password: INVALID_PASSWORD,
      result: 'failure',
      timestamp: new Date()
    });
  });
});
