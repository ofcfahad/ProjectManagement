import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../database/Schemas/User';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const encryptionKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

const secretKey = process.env.SECRET_KEY;

function encryptPayload(payload: any) {
    const payloadString = JSON.stringify(payload);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encryptedPayload = cipher.update(payloadString, 'utf8', 'base64');
    encryptedPayload += cipher.final('base64');

    return encryptedPayload;
}

function decryptPayload(encryptedPayload: string) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let decryptedPayload = decipher.update(encryptedPayload, 'base64', 'utf8');
    decryptedPayload += decipher.final('utf8');

    return JSON.parse(decryptedPayload);
}

const createToken = (payload: object, expiresIn: string = '7d') => {
    const data = encryptPayload(payload);

    return jwt.sign({ data }, secretKey, {
        expiresIn,
    });
};

const getUserIdbyEmail = async (userEmail: string, userPassword: string) => {
    try {
        const user = await User.findOne({ userEmail });

        if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
            return user._id;
        }
    } catch (error) {
        console.log("🚀 ~ file: functions.ts:46 ~ getUserIdbyEmail ~ error:", error)
    }
};

const getPayloadfromToken = (token: string) => {
    const decodedToken = jwt.verify(token, secretKey, {
        complete: true,
    }) as JwtPayload;

    const payload = decodedToken.payload.data;
    return decryptPayload(payload); // userId from token payload
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
    getPayloadfromToken,
    shortenUrl
};