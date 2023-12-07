import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// blacklist to store the logged out tokens
const blacklist: string[] = [];

function invalidateToken(token: string) {
  blacklist.push(token);
}

function isTokenValid(token: string) {
  return !blacklist.includes(token);
}

const checkSession = (req: Request, res: Response, next: NextFunction) => {
  const sessionCookie = req.headers.authorization;
  const secret = process.env.SECRET_KEY;
  if (sessionCookie && jwt.verify(sessionCookie, secret!) && isTokenValid(sessionCookie)) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default checkSession;

export {
  invalidateToken,
  isTokenValid,
}