# Project Management

This is a full-stack web application built using the MERN stack, which includes
**MongoDB**, **Express.js**, **React.js**, and **Node.js**.

**Table of Contents**
Description
Technologies Used
Installation
Usage
Credits
License

**Description**
This MERN stack application is a simple CRUD (Create, Read, Update, Delete) application that allows users to perform basic operations on a collection of data. Users can view a list of items, add new items, update existing items, and delete items. The application is built using modern web technologies and follows best practices for web development.

**Technologies Used**
The following technologies and libraries were used to build this MERN stack application:

<div style="display: flex; flex-direction: row; ">

  <a href="https://www.mongodb.com/" style="display: flex; margin: 0 20px; ">
    <img src="https://img.icons8.com/?size=512&id=74402&format=png" alt="MongoDB" width="70" >
  </a>
  
  <a href="https://www.expressjs.com/" style="display: flex; margin: 0 20px;">
    <img src="https://www.mementotech.in/assets/images/icons/express.png" alt="ExpressJs" width="70" >
  </a>
  
  <a href="https://www.react.dev/" style="display: flex; margin: 0 20px;">
    <img src="https://s3.amazonaws.com/media-p.slid.es/uploads/260703/images/4152529/react-logo.png" alt="ReactJs" width="70" >
  </a>
  
  <a href="https://www.nodejs.org/" style="display: flex; margin: 0 20px;">
    <img src="https://avatars.githubusercontent.com/u/9950313?s=280&v=4" alt="NodeJs" width="70" >
  </a>

</div>

**Frontend**:
ChakraUi
Emotion
HeadlessUi
HeroIcons
Mui
Ramonak => progressbar
antd
axios
bootstrap
d3-ease
framer-motion
js-cookie
react-beautiful-dnd
react-circular-progressbar
react-move
react-otp-input
react-resizeable
react-tooltip
react-use
react-useanimations
tailwindcss

**Backend**:
axios
express-session
passportjs
bcryptjs
express-validator
jsonwebtoken
mongodb
mongoose
nodemailer
randomstring
nodemon

**Installation**
To install and run this MERN stack application on your local machine, you need to have Node.js and MongoDB installed.
FlatIcons

Clone the repository:

``` bash
git clone https://github.com/fahadbt/projectmanagement.git
```

Navigate to the project directory:

``` bash
cd projectmanagement
```

<details>
  <summary>Server</summary>

  Navigate to server directory:

  ``` bash
cd server
  ```

  Create a .env file with the following template:

```
MONGO_URI = <mongodburi>
EMAIL = <fornodemailerauth>
EMAIL_PASS = <fornodemailerauth>
SECRET_KEY = <secretkeytosignandverifyjwttokens>

# credentials for social auth
GITHUB_CLIENT_ID=<githuboauthclientid>
GITHUB_CLIENT_SECRET=<githuboauthclientsecret>
CALLBACK_URL='http://yourserverurl/api/auth/callback'
GOOGLE_CLIENT_ID=<.........>
GOOGLE_CLIENT_SECRET=<...........>

```

  Replace the <> values

  Install dependencies:

``` bash
npm install
```

Start the Server:

``` bash
nodemon server.ts
```

</details>

<details>
  <summary>Client</summary>

  Navigate to client directory:

  ``` bash
cd client
  ```

  Create a .env file and add:

  ```
  REACT_APP_SERVER_URL=<>
  ```

  Replace <> with your server url

  Install dependencies:

``` bash
npm install
```

Start the App:

``` bash
npm run dev
```

</details>

After starting app and server:

Open your browser and navigate to <http://localhost:5173> to view the application.

**Usage**
Once you have the application running, you can use it to perform basic CRUD operations on a collection of data. You can view a list of items, add new items, update existing items, and delete items.

**Credits**
This MERN stack application was built by Fahad as a demonstration of modern web development practices.

**License**
This project is licensed under the *GNU GENERAL PUBLIC LICENSE*
