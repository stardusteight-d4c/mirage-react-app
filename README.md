# Mirage Chat | Realtime Chat with Web Sockets

![banner](banner.png)

> Construction of a web chat with `bilateral communication` between server and client through `Web Sockets`, login and logout system and user sessions.
> In this application I used `Vercel` to upload the front-end and `Amazon Lightsail` to upload the back-end via `Cloud Computing` inside a `Docker` container
> hosted in a remote repository on `DockerHub`. To add dynamics to the front, the `Styled Components` library was used, which allows creating
> styles and pass styling props as React component props. There are also several checks performed on the form both on the server-side and on the
> client-side, all with visual feedback using `react-toastify`.

:arrow_right: Express | Creating an Application Programming Interface (API) with ES6 Modules <br />
:arrow_right: Mongoose and MongoDB - Configure the Database <br />
:arrow_right: Web Sockets - Socket.io <br />
:arrow_right: Localstorage and Sessions <br />
:arrow_right: Styled Components Props <br />
:arrow_right: Docker and Containers <br />
:arrow_right: Cloud Computing - Amazon Lighsail <br />

###### Behance layout inspirations

 - `behance.net/gallery/153862375/Daily-UI-013`
 - `behance.net/gallery/154466699/Your-Car-Status`

<br />

## Express | Creating an Application Programming Interface (API) with ES6 Modules

Express.js is a framework for Node.js that provides minimal resources for `building web servers`. It was released as free and open source software under the MIT License. It is one of the most popular server frameworks in Node.js.

##### Basic file structure

```
server
.
├── node_modules
├── controllers
│   ├── messagesController.js
│   └── usersController.js
├── models
│   ├── messageModel.js
│   └── userModel.js
├── routes
│   ├── messagesRoutes.js
│   └── userRoutes.js
├── index.js
├── package.json
├── package-lock.json
├── Dockerfile
├─ .dockerignore
├─ .gitignore
└── vercel.json 
```
* vercel.json - in case you want to deploy the server on vercel, but there is no support for Web Sockets.


### Starting the application

First we must create the `folder` that will contain the `server code`, create a `package.json` file to manage the application and its dependencies and install the `express` dependency. `nodemon` to automatically restart the server when file changes are detected in the directory. `cors` package to provide a `Connect/Express middleware` that can be used to enable `CORS` with various options. And `dotenv` to load `environment variables` from a `.env` file to `process.env`.

* CORS (Cross-origin Resource Sharing) is a mechanism used by browsers to `share resources between different origins`.

 - `mkdir server && cd server`
 - `npm init`
 - `npm install express --save`
 - `npm i nodemon cors dotenv`

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon --experimental-modules --es-module-specifier-resolution=node index.js"
  },
  "author": "stardusteight-d4c",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.1",
    "nodemon": "^2.0.20"
  }
}
```

For `type` we set the value `module` so that we can use the `ES6 modules`, and `index.js` as the `main` file of the application that contains the code that will `initialize and run the express application`.

In the `index.js` file we must import `express` to start creating an Express application, as well as `cors` and `dotenv` for configurations.

```js
// index.js

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express()
dotenv.config()

// set Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN)
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  app.use(cors())
  next()
})

// a new body object containing the parsed data is populated in request object after middleware (i.e. req.body)
app.use(express.json())

// starts a UNIX socket and listens for connections in a given path.
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listeing on PORT: ${process.env.PORT}`)
})
```

### Routes 

Routing refers to determining `how an application responds to a client request via a specific endpoint`, which is a `URI (or path)` and a specific `HTTP request method` (GET, POST, and so on).

`Each route can have one or more manipulation functions`, which `are executed when the route is matched`.

The route definition accepts the following structure:

```js
app.METHOD(PATH, HANDLER)
```

Where:

 - `app` is an instance of express.
 - `METHOD` is an HTTP request method.
 - `PATH` is a path on the server.
 - `HANDLER` is the function executed when the route is matched.

To follow a good file structure in our application, it is a good practice to create a directory called `routes` and in it we separate the files that deal with the `routing of a certain domain` as `user` and `messages`:

```js
// routes/userRoutes.js

import express from 'express'
// import the handlers from controllers directory
import { register, login, chooseAvatar, getAllUsers } from '../controllers/usersController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/chooseAvatar/:id', chooseAvatar)
router.get('/allUsers/:id', getAllUsers)

export { router }
```

And so perform the imports in the application's gateway file:

```js
// index.js

import { router as userRoutes } from './routes/userRoutes.js'
import { router as messagesRoutes } from './routes/messagesRoutes.js'

// ...

app.use('/api/auth', userRoutes)
app.use('/api/messages', messagesRoutes)
```

### Controllers

Controllers is a set of functions that are used to `process each request` made in a given `endpoint` of the application routing performed in the `routes` directory, following the same logic it is a good practice to separate these `processors/handlers` in a directory called ` controllers` and separate for each domain:

```js
// controllers/usersController.js

import userModel from '../model/userModel.js'
import brcypt from 'bcrypt'

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const usernameCheck = await userModel.findOne({ username })
    const emailCheck = await userModel.findOne({ email })
    if (usernameCheck) {
      return res.json({
        msg: 'O nome de usuário já está em uso',
        status: false,
      })
    }
    if (emailCheck) {
      return res.json({ msg: 'O Email já está em uso', status: false })
    }
    const hashedPassword = await brcypt.hash(password, 10)
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
    })
    delete user.password
    return res.json({ status: true, user })
  } catch (error) {
    next(error)
  }
}

// ...
```

### Models

Models are an `abstraction of the data in your database` MongoDB, which is represented as a document. Because of this abstraction, you can use `Mongoose` schemas to build a plan of `how you want the added data to look and behave`. Everything in Mongoose starts with a Schema, each schema maps to a MongoDB collection and defines the shape of documents within that collection. A model is basically the definition of how your data should be structured, and following the same logic as the `routes` and `controllers` directory, a directory called `models` is commonly used to define the model for each domain of your application.

```js
// models/userModel.js

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    require: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: '',
  },
})

export default mongoose.model("Users", userSchema) 
```
*<i>expressjs.com</i> <br />
*<i>expressjs.com/pt-br/starter/basic-routing</i> <br />
<br />

## Mongoose and MongoDB - Configure the Database
