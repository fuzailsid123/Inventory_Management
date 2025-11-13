import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index.js';
import Product from '../src/models/Product.js';

describe('Products API', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/inventorydb_test';
    await mongoose.connect(uri, { dbName: 'inventorydb_test' });
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  test('POST /api/products creates a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test', sku: 'T-001', quantity: 1, reorderLevel: 5, turnoverRate: 1 });
    expect(res.status).toBe(201);
    expect(res.body.sku).toBe('T-001');
  });

  test('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

