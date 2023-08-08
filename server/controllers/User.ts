import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../database/Schemas/User";
import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'


//Get UserData by id
const getUserData = async (req: Request, res: Response) => {
    try {
        const token = req.body.token // get's token from request body
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.SECRET_KEY!, {
                    complete: true
                }) as JwtPayload
                const userId = decodedToken.payload.userId; // userId from token payload

                var user = await User.findById(userId); // get User by userId
                if (user?.userPassword) {
                    user.userPassword = undefined // removes password
                }
                res.status(200).json(user); // sends user as json

            } catch (error) {
                return res.json('invalid token')
            }

        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const getPeopleInfo = async (req: Request, res: Response) => {
    try {
        const userIds = req.body.userIds;
        const users: Array<object | null> = [];

        for (const userId of userIds) {
            try {
                const user = await User.findById(userId);
                if (user) {
                    user.githubId = undefined;
                    user.googleId = undefined;
                    user.userEmail = undefined;
                    user.userPassword = undefined;
                    user.preferences = undefined;
                }
                users.push(user);
            } catch (error) {
                console.log(error);
            }
        }

        res.status(200).json({ users })
    } catch (error) {
        console.log(`from getPeopleInfo: ${error}`);
    }
}

const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { EMAIL, EMAIL_PASS, SECRET_KEY } = process.env
        const userEmail = req.body.userEmail
        const user = await User.findOne({ userEmail: userEmail })
        if (user) {

            const token = jwt.sign({ userEmail }, SECRET_KEY!, { expiresIn: '1h' })

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,
                    pass: EMAIL_PASS
                }
            });

            const emailTemplate = (name: string, resetLink: string) => `
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Regards,<br> <b>PJM</b> </p>
  `;

            const mailOptions = {
                from: 'Project Management',
                to: userEmail,
                subject: 'Password Reset',
                html: emailTemplate(user.fullName! || user.userName!, `http://localhost:5173/?token=${token}`)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending password reset email:', error);
                } else {
                    console.log('Password reset email sent:', info.response);
                }
            });
        }
        res.status(200).send('Email Sent')

    } catch (error) {
        console.log(`from forgotPassword: ${error}`);
    }
}

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { userPassword, token } = req.body
        const hashedPassword = await bcrypt.hash(userPassword, 10)
        let userEmail: string

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY!, { complete: true }) as JwtPayload
            if (decodedToken) {
                userEmail = decodedToken.payload.userEmail;
            } else {
                userEmail = ''
                console.log(`from resetPassword: Invalid token format`);
            }

        } catch (error) {
            return res.json('invalid token')
        }

        const response = await User.findOneAndUpdate({ userEmail: userEmail }, { userPassword: hashedPassword })
        if (response) {
            res.status(200).send('Password Changed')
        } else {
            res.status(404).send('User not Found')
        }

    } catch (error) {
        console.log(`from resetPassword: ${error}`);
    }
}

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('connect.sid')
}

export {
    getUserData,
    getPeopleInfo,
    forgotPassword,
    resetPassword,
    logoutUser
}