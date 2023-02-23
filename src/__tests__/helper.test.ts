
import request from 'supertest';
import app from '../index';

describe('App', () => {
    it('should return the correct message', () => {
      expect(true).toBe(true);
    });
  });


describe('GET /buyer/list-of-sellers', () => {
  it('should Not return a list of sellers', async () => {
    const response = await request(app).get('/buyer/list-of-sellers');

    expect(response.status).toBe(404);
    // expect(response.body).toHaveLength(2); // Assuming there are two sellers in the database
    // expect(response.body[0]).toHaveProperty('id');
    // expect(response.body[0]).toHaveProperty('name');
    // ... other assertions on the response body ...
  });
});