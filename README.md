# Project Management

This is a full-stack web application built using the MERN stack, which includes
**MongoDB**, **Express.js**, **React.js**, and **Node.js**.

## Table of Contents

#### [Description](#description)

#### [Technologies Used](#technologies)

#### [Installation](#installation)

#### [Usage](#usage)

#### [Credits](#credits)

#### [License](#license)

## Description <a name="description"></a>

This MERN stack application is a simple CRUD (Create, Read, Update, Delete) application that allows users to perform basic operations on a collection of data. Users can view a list of items, add new items, update existing items, and delete items. The application is built using modern web technologies and follows best practices for web development.

## Technologies Used <a name="technologies"></a>

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

#### Frontend

[axios](https://axios-http.com/)

[tailwind css](https://tailwindcss.com/)

[emotion](https://emotion.sh/)
  
[chakra ui](https://www.chakra-ui.com/)

[headless ui](https://headlessui.com/)

[ant design](https://ant.design/)

[framer motion](https://www.framer.com/motion/)

[mui](https://mui.com/)

[bootstrap](https://getbootstrap.com/)

[d3-ease](https://www.npmjs.com/package/d3-ease)

[react-icons](https://react-icons.github.io/react-icons/)

[js-cookie](https://www.npmjs.com/package/js-cookie)

[react-otp-input](https://www.npmjs.com/package/react-otp-input)

[react-resizable](https://www.npmjs.com/package/react-resizable)

[react-move](https://www.npmjs.com/package/react-move)

[react-tooltip](https://www.npmjs.com/package/react-tooltip)

[react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar)

[react-use](https://www.npmjs.com/package/react-use)

[useanimations](https://react.useanimations.com/)

</ul>

#### Backend

[express-session](https://www.npmjs.com/package/express-session)

[connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)

[express-validator](https://express-validator.github.io/docs/)

[jsonwebtoken](https://jwt.io/)

[passportjs](https://www.passportjs.org/)

[mongoose](https://mongoosejs.com/)

[nodemailer](https://nodemailer.com/)

[nodemon](https://www.npmjs.com/package/nodemon)

[bcryptjs](https://www.npmjs.com/package/bcryptjs)

[randomstring](https://www.npmjs.com/package/randomstring)

[sanitize-html](https://www.npmjs.com/package/sanitize-html)

[validator](https://www.npmjs.com/package/validator)

[dotenv](https://www.npmjs.com/package/dotenv)

[cors](https://www.npmjs.com/package/cors)

[body-parser](https://www.npmjs.com/package/body-parser)

## Installation <a name="installation"></a>

To install and run this MERN stack application on your local machine, you need to have Node.js and MongoDB installed.

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

  Create a .env file and paste the file contents from .env-example. don't forget to replace the <> values to your own

  Install dependencies:

``` bash
npm install
```

Start the Server:

``` bash
npm run start
```

</details>

<details>
 <summary>Client</summary>

  Navigate to client directory:

  ``` bash
cd client
  ```

  Create a .env file and paste the file contents from .env-example. replace <> with your server url

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

## Usage <a name="usage"></a>

Once you have the application running, first you'll have to authenticate with your creadentials. Once authenticated you can use it to perform basic CRUD operations on a collection of data. You can view a list of items, add new items, update existing items, and delete items.

## Credits <a name="credits"></a>

This MERN stack application was built by Fahad as a demonstration of modern web development practices.

## License <a name="license"></a>

This project is licensed under the *GNU GENERAL PUBLIC LICENSE*
