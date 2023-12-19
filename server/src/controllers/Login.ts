import { Request, Response } from 'express';
import User from '../database/Schemas/User';
import bcrypt from 'bcryptjs';
import { createToken } from './functions';

const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { userName, userPassword } = req.body;

    const user = await User.findOne({
      $or: [
        { userName: userName },
        { userEmail: userName },
      ],
    });

    if (user && await bcrypt.compare(userPassword, user.userPassword)) {
      if (user.mfa) {
        res.status(200).json({ message: 'success', mfa: user.mfa, email: user.userEmail });
      } else {
        const token = createToken({ userId: user._id });
        res.status(200).json({ message: 'success', mfa: user.mfa, token: token });
      }
    } else {
      res.status(401).json({ message: 'Username or password incorrect' });
    }
  } catch (error) {
    console.log("🚀 ~ file: Login.ts:25 ~ authenticateUser ~ error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createNewUser = async (req: Request, res: Response) => {
  try {
    const { userName, userPassword } = req.body.user;

    const existingUser = await User.find({ userName: userName });

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'oops! Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({
      userName,
      userPassword: hashedPassword,
      preferences: { theme: 'light', toolTipisVisible: true },
    });
    await newUser.save();

    return res.status(201).json({ message: 'User registered', token: createToken({ userId: newUser._id }) });
  } catch (error) {
    console.log("🚀 ~ file: Register.ts:31 ~ createNewUser ~ error:", error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const notVerified = async (req: Request, res: Response) => {
  const { userName, userPassword } = req.body;

  try {
    const user = await User.findOne({ userName });
    const userId = user?._id;

    if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
      await User.findByIdAndUpdate(userId, { verified: false });

      res.status(200).json({ message: 'welcome aboard', token: createToken({ userId }) });
    } else {
      res.status(500).send('well guess something is gone wrong');
    }
  } catch (error) {
    console.log(`from notVerified: ${error}`);
  }
};


export {
  authenticateUser,
  createNewUser,
  notVerified,
};