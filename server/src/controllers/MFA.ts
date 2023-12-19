import { Request, Response } from 'express';
import User from '../database/Schemas/User';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import { createToken, getUserIdbyEmail } from './functions';

const savedOtps: { [key: string]: { otp: string, otpExpirationTime: number } } = {};

const emailTemplate = (otp: string, otpExpirationTime: number) => `Dear Recipient,
<br />
  We noticed that you requested a One-Time Password (OTP) code to access our system. 
<br /> 
  Here is your OTP <strong id="otp"> ${otp} </strong> 
<br /> 
  We want to remind you that for security reasons, OTP codes are valid only for <strong>${Number((otpExpirationTime - Date.now()) / (1000 * 60)).toFixed(0)}</strong> minutes. After the expiration time, your OTP code will no longer be valid, and you will need to request a new one to access our system. 
<br /> 
  If you have not requested an OTP code, please ignore this email and contact our support team immediately. 
<br /> 
  Thank you for choosing our service. We value your security, and we want to ensure that your information is always protected. 
<br /> 
  Best regards,
<br />
 <strong> PJM </strong>
 `

const sendOTP = async (req: Request, res: Response) => {
    const { userEmail } = req.body;

    const user = await User.findOne({ userEmail: userEmail });
    if (!user) {
        return res.status(404).json({ message: 'User with Email not found' });
    }

    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
    const otpExpirationTime = Date.now() + 5 * 60 * 1000;
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
        subject: 'OTP for Email Authentication',
        html: emailTemplate(otp, otpExpirationTime),
    };

    transporter.sendMail(mailOptions, (error: any, info: { response: string; }) => {
        if (error) {
            console.log("🚀 ~ file: MFA.ts:62 ~ transporter.sendMail ~ error:", error)
            res.status(500).send('Error sending OTP');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email Sent');
        }
    });
};

const verifyOTP = async (req: Request, res: Response) => {
    const { userName, userEmail, userPassword, otp } = req.body;

    if (!savedOtps || !savedOtps.hasOwnProperty(userEmail) || savedOtps[userEmail].otp !== otp || Number(savedOtps[userEmail].otpExpirationTime) < Date.now()) {
        res.status(400).send('Expired or Invalid OTP');
    } else {
        if (userName) {

        }
        const userId = await getUserIdbyEmail(userEmail, userPassword);

        res.status(200).json({ message: 'OTP verified', token: createToken({ userId }) });
    }
};

export {
    sendOTP,
    verifyOTP,
};