import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const checkSession = (req: Request, res: Response, next: NextFunction) => {
    const sessionCookie = req.headers.authorization;
    console.log(sessionCookie);
    const secret = process.env.SECRET_KEY
    if (sessionCookie && jwt.verify(sessionCookie, secret!)) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export default checkSession