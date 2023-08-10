import User from '../database/Schemas/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';


const createNewUser = async (req: Request, res: Response) => {
  try {
    const { userName, fullName, userPassword, userEmail, userProfilePicture, userGithubLink } = req.body.user;
    
    const existingUser = await User.find({ userName: userName });
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'oops! Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({ userName: userName, fullName: fullName, userPassword: hashedPassword, userEmail: userEmail, userProfilePicture: userProfilePicture, userGithubLink: userGithubLink, preferences: { theme: 'light', toolTipisVisible: true } });
    await newUser.save();
    return res.status(201).json({ message: 'Well Well you got it!' });
  } catch (error) {
    console.error(`from createNewUser: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

interface SavedOTP {
  otp: string,
  otpExpirationTime: number
}

const savedOtps: { [key: string]: SavedOTP } = {};


const sendOTP = async (req: Request, res: Response) => {
  const { userEmail } = req.body;

  const existingUser = await User.findOne({ userEmail: userEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'it seems the Email you provided is already bieng used, please try another address' });
  }

  const otp = randomstring.generate({ length: 6, charset: 'numeric' });
  const otpExpirationTime = Date.now() + 1 * 60 * 1000;
  const { EMAIL, EMAIL_PASS } = process.env;

  savedOtps[userEmail] = {
    otp,
    otpExpirationTime,
  };

  // Configure Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'Project Management',
    to: userEmail,
    subject: 'OTP for email authentication',
    html: `Dear Recipient,
<br />
  We noticed that you requested a One-Time Password (OTP) code to access our system. 
<br /> 
  Here is your OTP <strong id="otp"> ${otp} </strong> 
<br /> 
  We want to remind you that for security reasons, OTP codes are valid only for <strong>${Number((otpExpirationTime - Date.now() + 1) / 1000)}</strong> seconds. After the expiration time, your OTP code will no longer be valid, and you will need to request a new one to access our system. 
<br /> 
  If you have not requested an OTP code, please ignore this email and contact our support team immediately. 
<br /> 
  Thank you for choosing our service. We value your security, and we want to ensure that your information is always protected. 
<br /> 
  Best regards,
<br />
 <strong> PJM </strong>
 <br />
 Generated by <strong> ChatGPT </strong>
 <script>
 var otp = document.getElementById('otp');
 
 otp.onclick = function() {
   navigator.clipboard.writeText(otp.innerText)
     .then(() => {
       alert('OTP copied to clipboard!');
     })
     .catch((error) => {
       console.error('Failed to copy OTP: ', error);
     });
 };
 </script>`,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending OTP');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email Sent');
    }
  });
};

const verifyOTP = (req: Request, res: Response) => {
  const { userEmail, otp } = req.body;

  if (!savedOtps || savedOtps[userEmail].otp !== otp || Number(savedOtps[userEmail].otpExpirationTime) < Date.now()) {
    res.status(400).send('Invalid or Expired OTP');
  } else {
    res.status(200).send('OTP verified');
  }
};

const updateEmail = async (req: Request, res: Response) => {
  const { userName, userPassword, userEmail } = req.body;

  try {
    const user = await User.findOne({ userName });
    const userId = user?._id;

    if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
      await User.findByIdAndUpdate(userId, { userEmail: userEmail, verified: true });
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign({ userId }, secret!, { expiresIn: '7d' });
      res.status(200).json({ message: 'welcome aboard', token });
    } else {
      res.status(500).send('well guess something is gone wrong');
    }

  } catch (error) {
    console.log(`from updateEmail: ${error}`);
  }
};

const notVerified = async (req: Request, res: Response) => {
  const { userName, userPassword } = req.body;

  try {
    const user = await User.findOne({ userName });
    const userId = user?._id;

    if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
      await User.findByIdAndUpdate(userId, { verified: false });
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign({ userId }, secret!, { expiresIn: '7d' });
      res.status(200).json({ message: 'welcome aboard', token });
    } else {
      res.status(500).send('well guess something is gone wrong');
    }
  } catch (error) {
    console.log(`from notVerified: ${error}`);
  }
};


export {
  //checkUserName,
  createNewUser,
  sendOTP,
  verifyOTP,
  updateEmail,
  notVerified,
};