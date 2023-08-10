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
exports.callbackGoogle = exports.authenticateGoogle = exports.callbackGithub = exports.authenticateGithub = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_github2_1 = require("passport-github2");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../database/Schemas/User"));
const { CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
//Login With Github
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${CALLBACK_URL}/github`,
    scope: ['user:email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const user = yield User_1.default.findOne({ userEmail: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value });
        if (user) {
            return done(null, user);
        }
        const newUser = new User_1.default({
            githubId: profile.id,
            userName: profile.username,
            fullName: profile.displayName,
            userEmail: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value,
            userProfilePicture: (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
            userGithubLink: profile.profileUrl,
        });
        yield newUser.save();
        done(null, newUser);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
const something = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (user) {
            const findUser = yield User_1.default.findOne(user);
            return findUser === null || findUser === void 0 ? void 0 : findUser._id;
        }
        console.log('from something: no user');
    }
    catch (error) {
        console.log(`from something: ${error}`);
    }
});
const authenticateGithub = passport_1.default.authenticate('github');
exports.authenticateGithub = authenticateGithub;
function callbackGithub(req, res) {
    passport_1.default.authenticate('github', { failureRedirect: '/' })(req, res, () => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const userId = yield something(user);
            const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '7d' });
            // Return a client-side script that closes the window and sets the token in the main window's local storage
            res.send(`
          <script>
            window.opener.postMessage({ type: 'github-auth-success', token: '${token}' }, '*');
            window.close();
          </script>
        `);
        }
        catch (err) {
            res.status(500).send({ message: 'Internal server error' });
        }
    }));
}
exports.callbackGithub = callbackGithub;
//Login With Google
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${CALLBACK_URL}/google`,
    scope: ['user:email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    // This function will be called when the user authorizes App
    try {
        const user = yield User_1.default.findOne({ userEmail: (_d = profile.emails) === null || _d === void 0 ? void 0 : _d[0].value });
        if (user) {
            return done(null, user);
        }
        else {
            // If the user does not exist, create a new user
            const newUser = new User_1.default({
                googleId: profile.id,
                fullName: profile.displayName,
                userEmail: (_e = profile.emails) === null || _e === void 0 ? void 0 : _e[0].value,
                userProfilePicture: (_f = profile.photos) === null || _f === void 0 ? void 0 : _f[0].value,
            });
            yield newUser.save();
            return done(null, newUser);
        }
    }
    catch (error) {
        return done(error);
    }
})));
const authenticateGoogle = passport_1.default.authenticate('google', { scope: ['profile', 'email'] });
exports.authenticateGoogle = authenticateGoogle;
function callbackGoogle(req, res) {
    passport_1.default.authenticate('google', { failureRedirect: '/' })(req, res, () => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const userId = yield something(user);
            const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '7d' });
            // Return a client-side script that closes the window and sets the token in the main window's local storage
            res.send(`
              <script>
                window.opener.postMessage({ type: 'google-auth-success', token: '${token}' }, '*');
                window.close();
              </script>
            `);
        }
        catch (err) {
            res.status(500).send({ message: 'Internal server error' });
        }
    }));
}
exports.callbackGoogle = callbackGoogle;
//# sourceMappingURL=SocialAuth.js.map