import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectToMongo from './database/db';
import { getAllProjects, deleteProject, createProject, getSearchedProjects } from './controllers/Project';
import { authenticateUser, createNewUser, notVerified } from './controllers/Login';
import { sendOTP, verifyOTP } from './controllers/MFA';
import { authenticateGithub, authenticateGoogle, callbackGithub, callbackGoogle } from './controllers/SocialAuth';
import { findUserNames, forgotPassword, getUserData, logoutUser, resetPassword, updateEmail } from './controllers/User';
import checkSession from './middlewares/checkSession';
import session from 'express-session';
import passport from 'passport';
import { disableSocialAuth } from '../../developerSettings'
import { createNewChat, getChatMessages, getUserChats } from './controllers/Chats';
import io from './controllers/socket';

const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const app = express();
const port = 5000;
connectToMongo();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

io.listen(4000);

if (!disableSocialAuth) {

  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'userSessions'
  });

  store.on('error', (error: Error) => {
    console.error('MongoDB Session Store Error:', error);
  });

  app.use(
    session({
      secret: process.env.SECRET_KEY!,
      store: store,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

}

app.listen(port, () => {
  console.log(`running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('hey');
});

//User
app.use('/api/getUserData', checkSession, getUserData);
app.use('/api/forgotPassword', forgotPassword);
app.use('/api/resetPassword', resetPassword);
app.use('/api/updateEmail', checkSession, updateEmail);
app.use('/api/findUserNames', checkSession, findUserNames);
app.use('/api/logout', logoutUser);
//Login
app.use('/api/authenticateUser', authenticateUser);
app.use('/api/register', createNewUser);
app.use('/api/notVerified', notVerified);
//MFA
app.use('/api/sendOTP', sendOTP);
app.use('/api/verifyOTP', verifyOTP);

// Social Auth
if (!disableSocialAuth) {

  //Github
  app.get('/api/auth/github', authenticateGithub);
  app.get('/api/auth/callback/github', callbackGithub);
  //Google
  app.get('/api/auth/google', authenticateGoogle);
  app.get('/api/auth/callback/google', callbackGoogle);

}

//Project
app.use('/api/projectsData', checkSession, getAllProjects);
app.use('/api/searchedProjectsData', checkSession, getSearchedProjects);
app.post('/api/createProject', checkSession, createProject);
app.use('/api/deleteProject', checkSession, deleteProject);

//Chat
app.use('/api/getUserChats', checkSession, getUserChats);
app.use('/api/getChatMessages', checkSession, getChatMessages);
app.use('/api/createNewChat', checkSession, createNewChat);