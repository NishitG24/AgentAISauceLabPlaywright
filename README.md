# Sauce Labs Playwright + MongoDB E2E Project

This project demonstrates end-to-end testing using [Playwright](https://playwright.dev/) with TypeScript, integrated with MongoDB for dynamic test data.

## Features
- Playwright E2E tests in TypeScript
- MongoDB integration for test data and logging
- Example login, add-to-cart, and checkout tests
- GitHub Actions workflow for CI

## Getting Started

### 1. Install dependencies
```sh
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```
LOGIN_URL=https://www.saucedemo.com/v1/index.html
MONGODB_URI=your_mongodb_connection_string
```

### 3. Prepare MongoDB Data
Insert a document in the `SauceDemo` collection with this structure:
```json
{
	"baseURL": "https://www.saucedemo.com/v1/index.html",
	"username": "standard_user",
	"password": "secret_sauce",
	"products": ["Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt"],
	"prices": ["29.99", "9.99", "15.99"]
}
```

### 4. Run Tests
```sh
npx playwright test
```

### 5. Run a Specific Test
```sh
npx playwright test tests/add-to-cart.spec.ts --project=chromium
```

### 6. View HTML Report
```sh
npx playwright show-report
```

## Continuous Integration
Tests run automatically on push/pull request to `main` via GitHub Actions. See `.github/workflows/playwright.yml`.

## Project Structure
- `tests/` - All Playwright test files
- `tests/utils/mongo.ts` - MongoDB connection helpers
- `playwright.config.ts` - Playwright configuration
- `.env` - Environment variables (not committed)
- `.github/workflows/playwright.yml` - CI workflow

## Documentation
- [Playwright Docs](https://playwright.dev/docs/intro)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
