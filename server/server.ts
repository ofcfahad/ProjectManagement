import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import connectToMongo from './database/db'
import { getAllProjects, deleteProject, createProject, getSearchedProjects, deleteManyProjects } from './controllers/Project'
import { createNewUser, notVerified, sendOTP, updateEmail, verifyOTP } from './controllers/Register'
import { authenticateUser, getUserEmail, sendAOTP, verifyAOTP } from './controllers/Login';
import { authenticateGithub, authenticateGoogle, callbackGithub, callbackGoogle } from './controllers/SocialAuth'
import { forgotPassword, getPeopleInfo, getUserData, resetPassword } from './controllers/User'
import checkSession from './middlewares/checkSession'
import session from 'express-session'
import passport from 'passport';
require('dotenv').config()


const app = express()
const port = 5000
connectToMongo()

app.use(bodyParser.json());
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
  console.log(`running on port ${port}`)
})

app.get('/', (req, res) => {
  res.send('hey')
})

//User
app.use('/api/getUserData', getUserData)
app.use('/api/getPeopleInfo', checkSession, getPeopleInfo)
app.use('/api/forgotPassword', forgotPassword)
app.use('/api/resetPassword', resetPassword)
//Register
app.use('/api/register', createNewUser)
app.use('/api/sendOTP', sendOTP)
app.use('/api/verifyOTP', verifyOTP)
app.use('/api/updateEmail', updateEmail)
app.use('/api/notVerified', notVerified)
//Login
app.use('/api/authenticateUser', authenticateUser)
app.use('/api/getUserEmail', getUserEmail)
app.use('/api/sendAuthenticationOTP', sendAOTP)
app.use('/api/verifyAuthenticationOTP', verifyAOTP)
//Github
app.get('/api/auth/github', authenticateGithub)
app.get('/api/auth/callback/github', callbackGithub)
//Google
app.get('/api/auth/google', authenticateGoogle)
app.get('/api/auth/callback/google', callbackGoogle)

//Project
app.use('/api/projectsData', checkSession, getAllProjects);
app.use('/api/searchedProjectsData', checkSession, getSearchedProjects);
app.post('/api/createProject', checkSession, createProject);
app.use('/api/deleteProject', checkSession, deleteProject);
app.use('/api/deleteManyProjects', checkSession, deleteManyProjects);