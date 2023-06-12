import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as secret from "../secret/db-config.json";

export const signToken = (payload: any, secret: string, options: jwt.SignOptions = {}): string => {
    return jwt.sign(payload, secret, options);
  }
  

  export const verifyToken = (token: string, secret: string, options: jwt.VerifyOptions = {}): any => {
    return jwt.verify(token, secret, options);
  }
  
// Middleware function to verify JWT token
export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await verifyToken(token, secret.JWT_SECRET); // Verify the token with the secret key
    req.body.user = decoded; // Save the decoded payload in the request object
    next(); // Call the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};