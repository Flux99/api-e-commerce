
import request from 'supertest';
import app from '../index';

let sellerToken:string 
let buyerToken:string 

describe('AUTH APIS TEST CASES ', () => {
describe('REGISTER APIS TEST CASES ', () => {
  it('should register a seller with unique username', async() => {
    const body = {
      username: "abc",
      password: "abc@123",
      isSeller: true
    }
    const response = await request(app).post('/auth/register')
    .send(body);
    console.log("response of register user", response.body);
    
     expect(response.body.message).toBe("User Created");

  });
  it('it should not register a seller with same username, throw Already Exist error', async() => {
    const body = {
      username: "abc",
      password: "abc@123",
      isSeller: true
    }
    const response = await request(app).post('/auth/register')
    .send(body);
    console.log("response of not register user", response.body);
    
     expect(response.body.message).toBe("User Already exist!");
     expect(response.status).toBe(400);

  });
});


  describe('LOG IN APIS TEST CASES ', () => {
    it('it should log in a seller with correct username and password', async() => {
      const body = {
        username: "abc123",
        password: "abc@123",
      }
      const response = await request(app).post('/auth/login')
      .send(body);
      sellerToken =response.body.token
       expect(response.body.message).toBe("User Logged in");
       expect(response.status).toBe(200);

    });
    it('it should log in a buyer with correct username and password', async() => {
      const body = {
        username: "xyz123",
        password: "xyz@123",
      }
      const response = await request(app).post('/auth/login')
      .send(body);
      buyerToken =response.body.token
       expect(response.body.message).toBe("User Logged in");
       expect(response.status).toBe(200);

    });
    it('it should not log in a seller with wrong username and password', async() => {
      const body = {
        username: "abc",
        password: "abc@1234",
      }
      const response = await request(app).post('/auth/login')
      .send(body);
      console.log("response of NOT login user", response.body, response.status);
      
      expect(response.body.message).toBe("No User Found!");
      expect(response.status).toBe(404);

    });
  });
});
describe('SELLER API TEST CASES',() => {
  
  it('should NOT create a catalog for sellers without TOKEN', async () => {
    const body = {
      user: {id: 1},
      catalog_name: "new02",
      products: [
        {
          name:"product1",
          price: 10
        },
        {
          name:"product2",
          price: 12
        },
      ]
    }
// 
const response = await request(app).post('/seller/create-catalog').send(body);

// expect(response.body.message).toBe("No User Found!");
expect(response.status).toBe(401);
});
  it('should create a catalog for sellers', async () => {
    const body = {
      user: {id: 1},
      catalog_name: "new01",
      products: [
        {
          name:"product15",
          price: 10
        },
        {
          name:"product16",
          price: 12
        },
      ]
    }
// 
const response = await request(app).post('/seller/create-catalog')
.send(body)
.set('Authorization', `Bearer ${sellerToken}`);
expect(response.status).toBe(200);
}); // buyer/seller-catalog/

it('should get a seller-catalog', async () => {
// 
const body = {
  seller_id:2
}
const response = await request(app).get('/buyer/seller-catalog')
.send(body)
.set('Authorization', `Bearer ${buyerToken}`);
console.log("response of seller catalog", response.body, response.status);

// expect(response.body.message).toBe("No User Found!");
expect(response.status).toBe(200);
});
});

describe('BUYER API TEST CASES',() => {

it('should return a list of sellers', async () => {
  const response = await request(app).get('/buyer/list-of-sellers')
  .set('Authorization', `Bearer ${buyerToken}`);
  expect(response.status).toBe(200);
});
it('should NOT return a list of sellers without token', async () => {
  const response = await request(app).get('/buyer/list-of-sellers');
  // .set('Authorization', `Bearer ${buyerToken}`);
  console.log("should NOT return a seller without token", response.body, response.status);
});

it('should create an order', async () => {
  const body = {
    seller_id:2,
    products: [
      {id: 17},{id: 16}
    ]
}
  const response = await request(app).post('/buyer/create-order')
  .send(body)
  .set('Authorization', `Bearer ${buyerToken}`);
  console.log("response of a create order", response.status, response.body);
  
  expect(response.status).toBe(200);
}); // seller/orders


it('should NOT create an order, without token', async () => {
  const body = {
    seller_id:2,
    products: [
      {id: 1},{id: 2}
    ]
}
  const response = await request(app).post('/buyer/create-order')
  .send(body);
  // .set('Authorization', `Bearer ${buyerToken}`);
  console.log("response of a NOT token", response.status,response.body );
  
  expect(response.status).toBe(401);
});

it('should get order of a seller', async () => {
  
  const response = await request(app).get('/seller/orders')
  .set('Authorization', `Bearer ${sellerToken}`);
  console.log("response of a get order", response.body,response.status );
  
  expect(response.status).toBe(200);
});
});
