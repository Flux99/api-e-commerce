import express from "express"
import { Request, Response } from "express"
import { connection} from "./database";
import { User } from "./entity/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as secret from "./secret/config.json";

const saltRounds = 10;
import {signToken,verifyToken} from "./middleware/jwt-middleware";
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


app.post("/auth/register", async  (req: Request, res: Response)=>{
try {
  const data = await (await connection).getRepository(User).findOne({where: {username: req.body.username}});
  if (data) {
    return res.status(400).send({message: "User Already exist!"});
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User();
    user.username = req.body.username;
    user.isSeller= req.body.isSeller;
    user.password= hashedPassword;
    const userSaved = await (await connection).manager.save(user);
    const token = await signToken({user_id:userSaved.id},secret.JWT_SECRET,{expiresIn: "1h"})
    return res.status(200).send({message: "User Created", token:token,user_id: userSaved.id})
  }
}catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
} finally {
  (await connection).close();
}
});

app.post("/auth/login", async  (req: Request, res: Response)=>{
  try {
    const data = await (await connection).getRepository(User).findOne({where: {username: req.body.username}});
    if (data) {

      const isPasswordCorrect = await bcrypt.compare(req.body.password,data.password);
      if (isPasswordCorrect) {
        const token = await signToken({user_id:data.id},secret.JWT_SECRET,{expiresIn: "1h"})
        return res.status(200).send({message: "User Logged in", token:token,user_id: data.id})
      } else {
        return res.status(401).send("Unauthorized")
      }
     
    } else {
      return res.status(404).send({message: "No User Found!"});

    }
  }catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    (await connection).close();
  }
  });
app.get("/buyer/list-of-sellers", async  (req: Request, res: Response)=>{
    // here we will have logic to return all users
    console.log("running get users api...");
    
    try {
      const data = await (await connection).getRepository(User).find({
        where: { 
          isSeller: true
        } 
      });
    if (data.length > 0) {
      return res.status(200).send({message: "Seller Found", data: data})
    } else {
      return res.status(404).send({message: "No Seller Found"})
    }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } finally {
      (await connection).close();
    }
})

// start express server
app.listen(3000)

export default app;