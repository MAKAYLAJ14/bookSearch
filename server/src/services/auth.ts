import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

//Middleware for authenticating JWT tokens
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  //Retrieve token from the headers
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Get the token from the "Bearer <token>" format

    const secretKey = process.env.JWT_SECRET_KEY || '';

    //verify the token
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload; // Attach user data to the request
      return next(); // Proceed to the next middleware or resolver
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Function to sign a JWT token
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
