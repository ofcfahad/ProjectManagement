"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.resetPassword = exports.forgotPassword = exports.getPeopleInfo = exports.getUserData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../database/Schemas/User"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Get UserData by id
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token; // get's token from request body
        if (token) {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, {
                    complete: true,
                });
                const userId = decodedToken.payload.userId; // userId from token payload
                var user = yield User_1.default.findById(userId); // get User by userId
                if (user === null || user === void 0 ? void 0 : user.userPassword) {
                    user.userPassword = undefined; // removes password
                }
                res.status(200).json(user); // sends user as json
            }
            catch (error) {
                return res.json('invalid token');
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getUserData = getUserData;
const getPeopleInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIds = req.body.userIds;
        const users = [];
        for (const userId of userIds) {
            try {
                const user = yield User_1.default.findById(userId);
                if (user) {
                    user.githubId = undefined;
                    user.googleId = undefined;
                    user.userEmail = undefined;
                    user.userPassword = undefined;
                    user.preferences = undefined;
                }
                users.push(user);
            }
            catch (error) {
                console.log(error);
            }
        }
        res.status(200).json({ users });
    }
    catch (error) {
        console.log(`from getPeopleInfo: ${error}`);
    }
});
exports.getPeopleInfo = getPeopleInfo;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { EMAIL, EMAIL_PASS, SECRET_KEY } = process.env;
        const userEmail = req.body.userEmail;
        const user = yield User_1.default.findOne({ userEmail: userEmail });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ userEmail }, SECRET_KEY, { expiresIn: '1h' });
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,
                    pass: EMAIL_PASS,
                },
            });
            const emailTemplate = (name, resetLink) => `
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
                html: emailTemplate(user.fullName || user.userName, `http://localhost:5173/?token=${token}`),
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending password reset email:', error);
                }
                else {
                    console.log('Password reset email sent:', info.response);
                }
            });
        }
        res.status(200).send('Email Sent');
    }
    catch (error) {
        console.log(`from forgotPassword: ${error}`);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userPassword, token } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(userPassword, 10);
        let userEmail;
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, { complete: true });
            if (decodedToken) {
                userEmail = decodedToken.payload.userEmail;
            }
            else {
                userEmail = '';
                console.log('from resetPassword: Invalid token format');
            }
        }
        catch (error) {
            return res.json('invalid token');
        }
        const response = yield User_1.default.findOneAndUpdate({ userEmail: userEmail }, { userPassword: hashedPassword });
        if (response) {
            res.status(200).send('Password Changed');
        }
        else {
            res.status(404).send('User not Found');
        }
    }
    catch (error) {
        console.log(`from resetPassword: ${error}`);
    }
});
exports.resetPassword = resetPassword;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('connect.sid');
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=User.js.map