import express from "express"
import { Request, Response, NextFunction } from "express"
import { connection} from "./database";
import { User } from "./entity/User";
import bcrypt from 'bcrypt';
import * as secret from "./secret/config.json";
import { Product } from './entity/Product';
import { Catalog } from './entity/Catalog';
import {createOrder,createCatalogSchema, sellerCatalog, userLoginSchema, userRegisterSchema} from "./middleware/middleware-validation";
const saltRounds = 10;
import {signToken,verifyToken, verifyTokenMiddleware} from "./middleware/jwt-middleware";
import { Order } from "./entity/Order";
// Hash the password
// const hashedPassword = await bcrypt.hash(password, saltRounds);

// Compare a password to a hash
// const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

// create and setup express app
const app = express()
app.use(express.json())
connection
.then(async (connection) => {
      console.log('Connected to MySQL');
    })
    .catch((err) => {
      console.error('Failed to connect to MySQL', err);
    });




// --------------------------------------------------------------------------------- AUTH APIS---------------------------------------------------------------------------------
app.post("/auth/register", async  (req: Request, res: Response, next: NextFunction)=>{
try {
  const result = await userRegisterSchema.validateAsync(req.body);
  const data = await (await connection).getRepository(User).findOne({where: {username: result.username}});
  if (data) {
    return res.status(400).send({message: "User Already exist!"});
  } else {
    const hashedPassword = await bcrypt.hash(result.password, saltRounds);
    const user = new User();
    user.username = result.username;
    user.isSeller= result.isSeller;
    user.password= hashedPassword;
    const userSaved = await (await connection).manager.save(user);
    const token = await signToken({user_id:userSaved.id},secret.JWT_SECRET,{expiresIn: "1h"})
    return res.status(200).send({message: "User Created", token:token,user_id: userSaved.id})
  }
}catch (error:any) {
  console.log("error in /auth/register api", error);
  if (error.isJoi) {
      error.status = 422;
    }
    next(error);
}
});

app.post("/auth/login", async  (req: Request, res: Response, next: NextFunction)=>{
  try {
    const result = await userLoginSchema.validateAsync(req.body);
    const data = await (await connection).getRepository(User).findOne({where: {username: result.username}});
    if (data) {

      const isPasswordCorrect = await bcrypt.compare(result.password,data.password);
      if (isPasswordCorrect) {
        const token = await signToken({user_id:data.id},secret.JWT_SECRET,{expiresIn: "1h"})
        return res.status(200).send({message: "User Logged in", token:token,user_id: data.id})
      } else {
        return res.status(401).send("Unauthorized")
      }
     
    } else {
      return res.status(404).send({message: "No User Found!"});

    }
  }catch (error:any) {
    console.log("error in auth/login api", error);
    if (error.isJoi) {
        error.status = 422;
      }
      next(error);
}
  });
app.get("/buyer/list-of-sellers", verifyTokenMiddleware, async  (req: Request, res: Response, next: NextFunction)=>{
    // here we will have logic to return all users
    console.log("running get users api...");
    
    try {
      const data = await (await connection).getRepository(User)
      .createQueryBuilder("users")
      .select(["users.username","users.id","users.catalog"])
      .where("isSeller = true")
      .getMany();
      // .find({
      //   where: { 
      //     isSeller: true
      //   }
      // });
      // data
      console.log("seller data",data);
    if (data.length > 0) {
      return res.status(200).send({message: "Seller Found", data: data})
    } else {
      return res.status(404).send({message: "No Seller Found"})
    }
    } catch (error:any) {
      console.log("error in buyer/list-of-seller api", error);
      if (error.isJoi) {
          error.status = 422;
        }
        next(error);
  }
})

// For buyers find a catalog  
app.get("/buyer/seller-catalog", verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) =>{
  // here we will have logic to return user by id

  try {
    const result = await sellerCatalog.validateAsync(req.body);
    const seller = await (await connection)
    .getRepository(User).findOne({
      where: {id: result.seller_id},
      relations: {
          catalog: true,
      },
  })
  console.log("get catalog data", req.body,seller);
  if (seller) {
    
    if (!seller.catalog) {
      return res.status(404).send({message: "Catalog Not Found"})
    }
    const product = await (await connection)
    .getRepository(Product).find({
      where: {catalog: seller.catalog.id}
  })
  if (product) {
    seller.catalog.products=product;
  }
    return res.status(200).send({message: "Seller Found", data: seller.catalog})
  } else {
    return res.status(404).send({message:"No Seller Found"});
  }
    // Fetch the catalog of the specified seller from the database
    // const catalogRepository = getRepository(Catalog);
    // const catalog = await catalogRepository.findOne({
    //   where: { seller: req.params.seller_id },
    //   relations: ['products'],
    // });

    // // Return the catalog as a JSON response
    // res.json(catalog);
  } catch (error:any) {
    console.log("error in seller/seller-catalog api", error);
    if (error.isJoi) {
        error.status = 422;
      }
      next(error);
}
})
// For Buyer to create an order 
app.post("/buyer/create-order/", verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) =>{
  // here we will have logic to return user by id
  console.log("buyer-create-order paayload", req.body);
  
  try {
    const result = await createOrder.validateAsync(req.body);
    const seller = await (await connection)
    .getRepository(User).findOne({
      where: {id: result.seller_id},
      relations: {
          catalog: true,
      },
  })
  
  if (seller) {
    console.log("seller data", seller);
    if (!seller.catalog) {
      return res.status(404).send({message: "Catalog Not Found"})
    }
    const productArray: Product[]=[]
    for(let i=0; i < result.products.length;i++) {
      const product = await (await connection)
    .getRepository(Product).findOne({
      where: {id:result.products[i].id, catalog: seller.catalog.id}
  })  
  if (product) {
    productArray.push(product)
   
  } else {
    return res.status(400).send({message: "Some Product Not Found"})
  }

}
  if (productArray.length > 0) {
    const order= new Order();
    order.buyerId= result.user.user_id;
    order.sellerId=result.seller_id;
    const orderSaved = await (await connection).getRepository(Order).manager.save(order);  
    for(let i=0; i < productArray.length;i++) {
      productArray[i].order=orderSaved.id;
      await (await connection)
      .getRepository(Product).manager.save(productArray[i])
    }
    // seller.catalog.products=product;
    return res.status(200).send({message: "Order Created", data: orderSaved})
  } else {
    return res.status(400).send({message: "Product Not Found"})
  }
  } else {
    return res.status(404).send({message:"No Seller Found"});
  }
  } catch (error:any) {
    console.log("error in buyer/create-order api", error);
    if (error.isJoi) {
        error.status = 422;
      }
      next(error);
}
})

app.post("/seller/create-catalog", verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction)=>{ // verifyTokenMiddleware
  // here we will have logic to save a user
  try {
    console.log("req body of create-catalog",req.body);
    const result = await createCatalogSchema.validateAsync(req.body);

    // const { catalog_name, products } = req.body;

    // Check if user is a seller
    const user = await (await connection)
    .getRepository(User).findOne({
      where: {id: result.user.user_id,isSeller: true,},
      // relations:['catalog']
    });
    if (user && user.isSeller) {
      
      const catalogdata= new Catalog();
      catalogdata.name= result.catalog_name;
      const catalogRepository = await (await connection).getRepository(Catalog).manager.save(catalogdata);  
       console.log("user data", user);
      const productRepo = await (await connection).getRepository(Product);
      const productList: Product[]=[];
      result.products.map(async (p: { name: string; price: number }) =>{
        const product= new Product();
        product.name=p.name;
        product.price=p.price;
        product.catalog=catalogRepository.id;
        productList.push(product);
        await productRepo.save(product);
    });
     
      // Associate the catalog with the seller's user entity
      user.catalog = catalogRepository;
      await (await connection).getRepository(User).save(user);
      return res.status(200).send({message:"Seller catalog created",data:user})
    } else {
      return res.status(404).send({message:"No User Found"})
    }
  }catch (error:any) {
    console.log("error in seller/seller-catalog api", error);
    if (error.isJoi) {
        error.status = 422;
      }
      next(error);
}
})

app.get("/seller/orders", verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const {user_id} = req.body.user;
    console.log("get seller order ", req.body);
    const orderSaved = await (await connection).getRepository(Order).find({
      where:{sellerId: user_id}
    })

    if (orderSaved.length > 0) {
      return res.status(200).send({message: "Order Found", data: orderSaved})
    } else {
      return res.status(404).send({message:"No Order Found"})
    }
  } catch (error:any) {
    console.log("error in seller/orders api", error);
    if (error.isJoi) {
        error.status = 422;
      }
      next(error);
}
})

app.use((err:any, req:any, res:any, _next:any) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

// start express server
app.listen(3000)

export default app;