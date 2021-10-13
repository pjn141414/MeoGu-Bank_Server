import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config/config';

export const generateToken = (id: string): string => {
  const payload = {
    id,
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