test('should add all products to cart, validate names and prices, and checkout', async ({ page }) => {
  // Fetch SauceDemo data from DB
  const dbData = await getSauceDemoData();
  const baseURL = dbData.baseURL;
  const username = dbData.username;
  const password = dbData.password;
  const products = dbData.products;
  const prices = dbData.prices;

  // 1. Login
  await page.goto(baseURL);
  await page.waitForTimeout(1500);
  await page.fill('#user-name', username);
  await page.waitForTimeout(1000);
  await page.fill('#password', password);
  await page.waitForTimeout(1000);
  await page.click('#login-button');
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/.*inventory\.html/);
  await page.waitForTimeout(1000);

  // 2. Add all products from DB
  for (let i = 0; i < products.length; i++) {
    const name = products[i];
    const price = prices[i];
    const productCard = page.locator('.inventory_item').filter({ hasText: name });
    await expect(productCard).toBeVisible();
    await page.waitForTimeout(1000);
    await expect(productCard.locator('.inventory_item_price')).toHaveText(`$${price}`);
    await page.waitForTimeout(1000);
    await productCard.locator('button:has-text("Add to cart")').click();
    await page.waitForTimeout(1000);
    await expect(productCard.locator('.inventory_item_name')).toHaveText(name);
    await page.waitForTimeout(1000);
    await expect(productCard.locator('.inventory_item_price')).toHaveText(`$${price}`);
    await page.waitForTimeout(1000);
  }

  // 3. Go to cart
  await page.click('.shopping_cart_link');
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/.*cart\.html/);
  await page.waitForTimeout(1000);

  // 4. Validate all products and prices in cart
  for (let i = 0; i < products.length; i++) {
    const name = products[i];
    const price = prices[i];
    const cartItem = page.locator('.cart_item').filter({ hasText: name });
    await expect(cartItem.locator('.inventory_item_name')).toHaveText(name);
    await page.waitForTimeout(1000);
    await expect(cartItem.locator('.inventory_item_price')).toHaveText(price);
    await page.waitForTimeout(1000);
  }

  // 5. Checkout
  const checkoutLink = page.locator('a.btn_action.checkout_button');
  await expect(checkoutLink).toBeVisible();
  await page.waitForTimeout(1000);
  await checkoutLink.click();
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
});

import { test, expect } from '@playwright/test';
import { connectToMongo, closeMongoConnection } from './utils/mongo';

// Helper to get test data from SauceDemo collection
async function getSauceDemoData() {
  const db = await connectToMongo();
  // Assume a single document with baseURL, username, password, products: [{name, price}]
  const data = await db.collection('SauceDemo').findOne({});
  if (!data) throw new Error('No SauceDemo data found in MongoDB');
  return data;
}

test.describe('Add to Cart and Validate', () => {

  let baseURL: string;
  let username: string;
  let password: string;
  let productName: string;
  let productPrice: string;

  test.beforeAll(async () => {
    const data = await getSauceDemoData();
    baseURL = data.baseURL;
    username = data.username;
    password = data.password;
    productName = data.products[0];
    productPrice = data.prices[0];
  });

  test.afterAll(async () => {
    await closeMongoConnection();
  });

  test('should add first product to cart and validate name and price', async ({ page }) => {
    // 1. Login
    await page.goto(baseURL);
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Pick first product (by name from DB)
  const productCard = page.locator('.inventory_item').filter({ hasText: productName });

    // 3. Add product
    await expect(productCard).toBeVisible();
  await expect(productCard.locator('.inventory_item_price')).toHaveText(`$${productPrice}`);
    await productCard.locator('button:has-text("Add to cart")').click();

    // 4. Validate product name and price on inventory page
    await expect(productCard.locator('.inventory_item_name')).toHaveText(productName);
  await expect(productCard.locator('.inventory_item_price')).toHaveText(`$${productPrice}`);

    // 5. Add to cart (already done)
    // 6. Go to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart\.html/);

    // 7. Validate product name and price in cart
    const cartItem = page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);
  await expect(cartItem.locator('.inventory_item_price')).toHaveText(productPrice);

  // 8. Debug: print cart page URL and HTML, then all button texts
  const cartUrl = page.url();
  const cartHtml = await page.content();
  console.log('Cart page URL:', cartUrl);
  console.log('Cart page HTML:', cartHtml);
  const allButtons = await page.locator('button').allTextContents();
  console.log('Cart page button texts:', allButtons);
  // Try to find the Checkout button
  const checkoutLink = page.locator('a.btn_action.checkout_button');
  await expect(checkoutLink).toBeVisible();
  await checkoutLink.click();
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });
});
