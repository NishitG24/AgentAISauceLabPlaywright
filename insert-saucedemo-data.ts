import { connectToMongo, closeMongoConnection } from './tests/utils/mongo';

async function insertSauceDemoData() {
  const db = await connectToMongo();
  await db.collection('SauceDemo').deleteMany({}); // Clean up for idempotency
  await db.collection('SauceDemo').insertOne({
    baseURL: 'https://www.saucedemo.com/v1/index.html',
    username: 'standard_user',
    password: 'secret_sauce',
    products: [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ],
    prices: [
      '29.99',
      '9.99',
      '15.99'
    ]
  });
  await closeMongoConnection();
  console.log('Inserted sample SauceDemo data.');
}

insertSauceDemoData();
