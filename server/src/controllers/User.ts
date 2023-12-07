import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../database/Schemas/User';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { getUserIdfromToken } from './functions';
import { invalidateToken } from '../middlewares/checkSession';

//Get UserData by id
const getUserData = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    try {
      const userId = getUserIdfromToken(token); // userId from token payload

      var user = await User.findById(userId); // get User by userId
      if (user?.userPassword) {
        user.userPassword = undefined; // removes password
      }

      res.status(200).json(user); // sends user as json
    } catch (error) {
      return res.json('invalid token');
    }

  } catch (error) {
    console.log("🚀 ~ file: User.ts:27 ~ getUserData ~ error:", error)
    res.status(500).json({ message: 'Server Error' });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { EMAIL, EMAIL_PASS, SECRET_KEY } = process.env;
    const userEmail = req.body.userEmail;

    const user = await User.findOne({ userEmail: userEmail });
    if (user) {
      const token = jwt.sign({ userEmail }, SECRET_KEY!, { expiresIn: '1h' });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: EMAIL_PASS,
        },
      });

      const emailTemplate = (name: string, resetLink: string) => `
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Regards,<br> <b>PJM</b> </p>
      `;

      const url = `http://localhost:5173/reset?token=${token}`

      const mailOptions = {
        from: 'Project Management',
        to: userEmail,
        subject: 'Password Reset',
        html: emailTemplate(user.fullName! || user.userName!, url),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending password reset email:', error);
        } else {
          console.log('Password reset email sent:', info.response);
        }
      });
    }
    res.status(200).send('Email Sent');

  } catch (error) {
    console.log("🚀 ~ file: User.ts:77 ~ forgotPassword ~ error:", error)
    res.status(500).json({ message: 'Server Error' });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { userPassword, token } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY!, { complete: true }) as JwtPayload;
      const userEmail = decodedToken.payload.userEmail;

      const response = await User.findOneAndUpdate({ userEmail: userEmail }, { userPassword: hashedPassword }, { new: true });
      if (response.userPassword == hashedPassword) {
        res.status(200).send('Password Changed');
      } else {
        res.status(404).send('User not Found');
      }

    } catch (error) {
      console.log("🚀 ~ file: User.ts:99 ~ resetPassword ~ error:", error)
      return res.status(401).send('Invalid token');
    }

  } catch (error) {
    console.log("🚀 ~ file: User.ts:104 ~ resetPassword ~ error:", error)
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateEmail = async (req: Request, res: Response) => {
  const { userName, userPassword, userEmail } = req.body;

  try {
    const user = await User.findOne({ userName });
    const userId = user?._id;

    if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
      await User.findByIdAndUpdate(userId, { userEmail: userEmail, verified: true });

      res.status(200).json({ message: 'email updated' });
    } else {
      res.status(500).send('well guess something is gone wrong');
    }

  } catch (error) {
    console.log(`from updateEmail: ${error}`);
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    invalidateToken(token);
    res.status(200).send('Logged out successfully');
  } catch (error) {
    console.log("🚀 ~ file: User.ts:120 ~ logoutUser ~ error:", error)
    res.status(500).json({ message: 'Server Error' });
  }
};

const findUserNames = async (req: Request, res: Response) => {
  try {
    const userName = req.body.userName

    const users = await User.find({ userName: { $regex: userName, $options: 'i' } });

    var userNames: { user_id: string; user_name: string; avatar_url: string }[] = [];

    for (let i = 0; i < users.length; i++) {
      userNames.push({ user_id: users[i]._id.toString(), user_name: users[i].userName, avatar_url: users[i].userProfilePicture });
    }

    res.status(200).json(userNames);
  } catch (error) {
    console.log("🚀 ~ file: User.ts:139 ~ findUserNames ~ error:", error)
    res.status(500).json({ message: 'Server Error' });
  }
}

const excludedFields = {
  githubId: 0,
  googleId: 0,
  userPassword: 0,
  preferences: 0
};

export {
  getUserData,
  forgotPassword,
  resetPassword,
  updateEmail,
  logoutUser,
  findUserNames,
  excludedFields,
};