import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../database/Schemas/User";
import { Request, Response } from 'express'


//Get UserData by id
const getUserData = async (req: Request, res: Response) => {
    try {
        const token = req.body.token // get's token from request body
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY!, {
                complete: true
            }) as JwtPayload
            const userId = decoded.payload.userId; // userId from token payload
            var user = await User.findById(userId); // get User by userId
            if (user?.userPassword) {
                user.userPassword = undefined // removes password
            }
            res.status(200).json(user); // sends user as json
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const getPeopleInfo = async (req: Request, res: Response) => {
    try {
        const userIds = req.body.userIds;
        const users: Array<object | null> = [];
        await Promise.all(userIds.map(async (userId: object) => {
          try {
            const user = await User.findById(userId);
            if (user) {
              user.githubId = undefined;
              user.googleId = undefined;
              user.fullName = undefined;
              user.userEmail = undefined;
              user.userPassword = undefined;
            }
            users.push(user);
          } catch (error) {
            console.log(error);
          }
        }));
        res.status(200).json({ users })
    } catch (error) {
        console.log(`from getPeopleInfo: ${error}`);
    }
}


export {
    getUserData,
    getPeopleInfo
}