import { Request, Response } from "express"
import User from "../database/Schemas/User"
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import randomstring from 'randomstring'
import jwt from 'jsonwebtoken'


const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { userName, userPassword } = req.body

        const user = await User.findOne({
            $or: [
                { userName: userName },
                { userEmail: userName }
            ]
        })

        if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
            res.status(200).json({ message: 'success' })
        } else {
            res.json({ message: 'username or password incorrect' })
        }
    } catch (error) {
        console.log(`from authenticateUser: ${error}`);
    }
}

const getUserEmail = async (req: Request, res: Response) => {
    try {
        const { userName, userPassword } = req.body

        const user = await User.findOne({
            $or: [
                { userName: userName },
                { userEmail: userName }
            ]
        })
        if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
            res.status(200).send(user.userEmail)
        } else res.status(404).send('some error')
    } catch (error) {
        console.log(`from getUserEmail: ${error}`);
    }
}

interface savedOtp {
    otp: string,
    otpExpirationTime: number
}

const savedOtps: { [key: string]: savedOtp } = {};

const sendAOTP = async (req: Request, res: Response) => {
    const { userEmail } = req.body;

    const user = await User.findOne({ userEmail: userEmail })
    if (!user) {
        return res.status(404).json({ message: 'it seems the Email you provided is not associated with your account' })
    }

    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
    const otpExpirationTime = Date.now() + 1 * 60 * 1000;
    const { EMAIL, EMAIL_PASS } = process.env

    savedOtps[userEmail] = {
        otp,
        otpExpirationTime
    };

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: EMAIL_PASS
        }
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
 </script>`

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

const verifyAOTP = async (req: Request, res: Response) => {
    const { userEmail, userPassword, otp } = req.body;

    if (!savedOtps || savedOtps[userEmail].otp !== otp || Number(savedOtps[userEmail].otpExpirationTime) < Date.now()) {
        res.status(400).send(`Expired or Invalid OTP`);
    } else {
        const userId = await getUserId(userEmail, userPassword)
        console.log(`from veifyAOTP:  ${userId}`);
        const secret = process.env.SECRET_KEY
        const token = jwt.sign({ userId }, secret!, { expiresIn: "7d" })
        console.log(`from veifyAOTP:  ${token}`);
        res.status(200).json({ message: 'welcome aboard', token });
    }
};

const getUserId = async (userEmail: string, userPassword: string) => {
    try {
        const user = await User.findOne({ userEmail })
        console.log(`from getUserId: ${user}`);

        if (user && await bcrypt.compare(userPassword, user.userPassword!)) {
            return user._id
        }
    } catch (error) {
        console.log(error);
    }
}




export {
    authenticateUser,
    getUserEmail,
    sendAOTP,
    verifyAOTP,
}