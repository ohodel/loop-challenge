const request = require('supertest');
const server = 'http://localhost:3000';

describe('Server Integration Tests', () => {
  describe('GET /products', () => {
    // Randomize the page call
    let page = Math.floor(Math.random() * 10);

    it('Responds with 200 status and json content type', () => {
      return request(server)
        .get(`/products?page=${page}`)
        .expect('Content-Type', /application\/json/)
        .expect(200);
    });

    it('Sends an object with the correct properties', (done) => {
      request(server)
        .get(`/products?page=${page}`)
        .end((err, res) => {
          expect(res.body).toHaveProperty('products');
          expect(res.body).toHaveProperty('total_count');
          if (err) throw err;
          done();
        });
    });

    it('Sends <15 products', (done) => {
      request(server)
        .get(`/products?page=${page}`)
        .end((err, res) => {
          expect(res.body.products.length).toBeLessThanOrEqual(15);
          if (err) throw err;
          done();
        });
    });

    it('Sends the correct product properties', (done) => {
      request(server)
        .get(`/products?page=${page}`)
        .end((err, res) => {
          expect(res.body.products[0]).toHaveProperty('id');
          expect(res.body.products[0]).toHaveProperty('image');
          expect(res.body.products[0]).toHaveProperty('inventory_item_id');
          expect(res.body.products[0]).toHaveProperty('name');
          expect(res.body.products[0]).toHaveProperty('price');
          expect(res.body.products[0]).toHaveProperty('total_inventory');
          expect(res.body.products[0]).toHaveProperty('total_orders');
          expect(res.body.products[0]).toHaveProperty('total_value');
          if (err) throw err;
          done();
        });
    });
  });
});
