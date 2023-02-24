import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  isSeller: Joi.boolean().required()
//   repeat_password: Joi.ref('password'),
});

export const userLoginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  //   repeat_password: Joi.ref('password'),
  });
export const sellerCatalog = Joi.object({
    seller_id: Joi.number().integer().required()
})

// {
//     "catalog_name": "new01",
//     "products": [
//       {
//         "name":"product1",
//         "price": 10
//       },
//       {
//         "name":"product2",
//         "price": 12
//       }
//     ]
// }
export const product = Joi.object({
    name:Joi.string().required(),
    price:Joi.number().integer().min(1).required()
}) 
export const createCatalogSchema = Joi.object({
    seller_id:Joi.number().integer().min(1).required(),
    catalog_name:Joi.string().required(),
    products: Joi.array().items(product),
    user: Joi.object({user_id: Joi.number().integer().min(1)})
})

export const createOrder = Joi.object({
    seller_id:Joi.number().integer().min(1).required(),
    products: Joi.array().items(product),
    user: Joi.object({user_id: Joi.number().integer().min(1)})
})