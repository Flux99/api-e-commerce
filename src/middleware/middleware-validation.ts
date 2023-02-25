import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
  isSeller: Joi.boolean().required()
//   repeat_password: Joi.ref('password'),
});

export const userLoginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  //   repeat_password: Joi.ref('password'),
  });
export const sellerCatalog = Joi.object({
    seller_id: Joi.number().integer().required(),
    user: Joi.object({user_id: Joi.number().integer().min(1), iat: Joi.number().integer(), exp: Joi.number().integer()})
})

export const product = Joi.object({
    name:Joi.string().required(),
    price:Joi.number().integer().min(1).required()
}) 
export const createCatalogSchema = Joi.object({
    // seller_id:Joi.number().integer().min(1).required(),
    catalog_name:Joi.string().required(),
    products: Joi.array().items(product),
    user: Joi.object({user_id: Joi.number().integer().min(1), iat: Joi.number().integer(), exp: Joi.number().integer()})
})

export const createOrder = Joi.object({
    seller_id:Joi.number().integer().min(1).required(),
    products: Joi.array().items({id: Joi.number().integer().min(1)}),
    user: Joi.object({user_id: Joi.number().integer().min(1), iat: Joi.number().integer(), exp: Joi.number().integer()})
})