import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../database/Schemas/User';
import { Types } from 'mongoose';

const createToken = (userId: Types.ObjectId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY!, {
        expiresIn: '7d',
    });
};

const getUserIdbyEmail = async (userEmail: string, userPassword: string) => {
    try {
        const user = await User.findOne({ userEmail });

        if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
            return user._id;
        }
    } catch (error) {
        console.log("🚀 ~ file: functions.ts:13 ~ getUserIdbyEmail ~ error:", error)
    }
};

const getUserIdfromToken = (token: string) => {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!, {
        complete: true,
    }) as JwtPayload;
    return decodedToken.payload.userId; // userId from token payload
}

const shortenUrl = async (url: string) => {
    console.log('====================================');
    console.log(url);
    console.log('====================================');
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': `4f4f8cf0e45226dabc0e15c46c0be6f1e6d96b50`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": url })
    });

    const shortUrl = await response.json()

    console.log('====================================');
    console.log(shortUrl);
    console.log('====================================');

    return shortUrl.link;
}

export {
    createToken,
    getUserIdbyEmail,
    getUserIdfromToken,
    shortenUrl
};