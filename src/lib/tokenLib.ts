import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config/config';

export const generateToken = (userPhone: string): string => {
  const payload = {
    userPhone,
  };

  const options: SignOptions = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const decodedToken = (token: string) => {
  return jwt.decoded(token);
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
}