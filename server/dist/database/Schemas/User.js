"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const s = String;
const UserSchema = new mongoose_1.default.Schema({
    githubId: s,
    googleId: s,
    userName: {
        type: s,
        unique: true,
    },
    fullName: s,
    userEmail: {
        type: s,
        sparse: true,
    },
    verified: Boolean,
    userProfilePicture: s,
    userPassword: s,
    userGithubLink: s,
    preferences: {
        theme: s,
        toolTipisVisible: Boolean,
    },
});
const User = mongoose_1.default.model('appUsers', UserSchema, 'appUsers');
exports.default = User;
//# sourceMappingURL=User.js.map