"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./database/db"));
const Project_1 = require("./controllers/Project");
const Register_1 = require("./controllers/Register");
const Login_1 = require("./controllers/Login");
const SocialAuth_1 = require("./controllers/SocialAuth");
const User_1 = require("./controllers/User");
const checkSession_1 = __importDefault(require("./middlewares/checkSession"));
const express_session_1 = __importDefault(require("express-session"));
const MongoDBStore = require('connect-mongodb-session')(express_session_1.default);
const passport_1 = __importDefault(require("passport"));
require('dotenv').config();
const disableSocialAuth = false;
const app = (0, express_1.default)();
const port = 5000;
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
if (!disableSocialAuth) {
    // Configure MongoDB session store
    const store = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: 'userSessions' // Collection to store sessions
    });
    store.on('error', (error) => {
        console.error('MongoDB Session Store Error:', error);
    });
    app.use((0, express_session_1.default)({
        secret: process.env.SECRET_KEY,
        store: store,
        resave: false,
        saveUninitialized: false,
    }));
    // Initialize Passport and session middleware
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
}
app.listen(port, () => {
    console.log(`running on port ${port}`);
});
app.get('/', (req, res) => {
    res.send('hey');
});
//User
app.use('/api/getUserData', User_1.getUserData);
app.use('/api/getPeopleInfo', checkSession_1.default, User_1.getPeopleInfo);
app.use('/api/forgotPassword', User_1.forgotPassword);
app.use('/api/resetPassword', User_1.resetPassword);
//Register
app.use('/api/register', Register_1.createNewUser);
app.use('/api/sendOTP', Register_1.sendOTP);
app.use('/api/verifyOTP', Register_1.verifyOTP);
app.use('/api/updateEmail', Register_1.updateEmail);
app.use('/api/notVerified', Register_1.notVerified);
//Login
app.use('/api/authenticateUser', Login_1.authenticateUser);
app.use('/api/getUserEmail', Login_1.getUserEmail);
app.use('/api/sendAuthenticationOTP', Login_1.sendAOTP);
app.use('/api/verifyAuthenticationOTP', Login_1.verifyAOTP);
// Social Auth
if (!disableSocialAuth) {
    //Github
    app.get('/api/auth/github', SocialAuth_1.authenticateGithub);
    app.get('/api/auth/callback/github', SocialAuth_1.callbackGithub);
    //Google
    app.get('/api/auth/google', SocialAuth_1.authenticateGoogle);
    app.get('/api/auth/callback/google', SocialAuth_1.callbackGoogle);
}
//Project
app.use('/api/projectsData', checkSession_1.default, Project_1.getAllProjects);
app.use('/api/searchedProjectsData', checkSession_1.default, Project_1.getSearchedProjects);
app.post('/api/createProject', checkSession_1.default, Project_1.createProject);
app.use('/api/deleteProject', checkSession_1.default, Project_1.deleteProject);
app.use('/api/deleteManyProjects', checkSession_1.default, Project_1.deleteManyProjects);
//# sourceMappingURL=index.js.map