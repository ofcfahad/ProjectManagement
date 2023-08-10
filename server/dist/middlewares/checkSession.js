"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkSession = (req, res, next) => {
    const sessionCookie = req.headers.authorization;
    const secret = process.env.SECRET_KEY;
    if (sessionCookie && jsonwebtoken_1.default.verify(sessionCookie, secret)) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.default = checkSession;
//# sourceMappingURL=checkSession.js.map