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
:arrow_right: LocalStorage and Sessions <br />
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

Mongoose is a JavaScript object-oriented programming library that `creates a connection between MongoDB` and the `Node.js JavaScript runtime environment`.

MongoDB is a schema-free `NoSQL document database`. This means that it stores JSON documents and that their structure can vary, as there is no rigid structure like SQL databases. This is one of the advantages of using NoSQL, as it `speeds up application development` and `reduces the complexity of implementations`.

To create the database you can create a `MongoDB Atlas` account which provides customers with a fully managed service on Google's trusted and globally scalable infrastructure. With Atlas, you manage a `cloud database` simply and quickly, with just a few clicks in the UI. After creating the database, a `Connection String URI` will be available that can be used to `establish the connection with your database`, it is not necessary to define the initial schemas, are automatically created in the database as per MongoDB functions.

###### Connection String URI Format

 - `MONGO_URL='mongodb+srv://<username>:<password>@<cluster>.aana2aw.mongodb.net/?retryWrites=true&w=majority`

In addition to `MongoDB Altas` on the web, you can download `MongoDB Compass` to access and manage the database from your own desktop with a graphical interface, just have access to the `Connection String URI`.

```js
// index.js

import mongoose from 'mongoose'

// ...
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Successfully Connection')
  })
  .catch((err) => {
    console.log(err.message)
  })
```

### Defining your schema

Everything in Mongoose starts with a `Schema`. Each schema maps to a MongoDB collection and defines the `shape of the documents` within that collection.

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

To use our schema definition, we need to convert our `userSchema` into a `Model` we can work with. To do so, we pass it into `mongoose.model(modelName, schema)`:

 - `const User = mongoose.model('User', userSchema)`
 
In this case I exported as `default` so just import the file and use `userModel`

### Handling data and returning responses

Query constructor used for `building queries`. You do not need to instantiate a Query directly. Instead use `Model` functions like `Model.find()`.

```js
// controllers/usersControllers.js

export const login = async (req, res, next) => {
  try {
    // get the request body and destructure username and password
    const { username, password } = req.body
    // looks for the username value from the request in the username key ({username: username})
    const user = await userModel.findOne({ username })
    // if yes, return the user's document, if not, return a JSON response with an appropriate message
    if (!user) {
      return res.json({
        msg: 'Senha ou nome de usuário incorretos',
        status: false,
      })
    }
    // check if the password that came in the request is the same as the one in the user document database
    const isPasswordValid = await brcypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({
        msg: 'Senha ou nome de usuário incorretos',
        status: false,
      })
    }
    delete user.password
    // if the login is successful, return the status 'true' with the user's document
    return res.json({ status: true, user })
  } catch (error) {
    next(error)
  }
}
```

And so, through the `requests` made in a certain API endpoint, we can `manipulate the data` that are in the database with a series of `conditions and queries`, and thus `send an adequate response to the client`, if such action is valid, and if so insert certain information in the database to `persist this data`.

*<i>mongoosejs.com/docs/api/query.html</i> <br />

<br />

## Web Sockets - Socket.io 

WebSocket is a technology that allows `bidirectional/bilateral communication` over full-duplex channels over a single `Transmission Control Protocol (TCP)` socket. It is designed to run on browsers and web servers that support HTML5, but can be used by any client or application server. The WebSocket API is being standardized by `W3C`; and the `WebSocket protocol` is being standardized by `IETF`. The Websocket protocol is a standalone, TCP-based protocol. Its only relationship to HTTP is that your handshake is interpreted by HTTP servers as an upgrade request.

### URL scheme

The `WebSocket protocol` specification defines two types of URL schemes: `ws`: and `wss`:, for unencrypted and encrypted connections, respectively. In addition to the naming scheme, the rest of the URL components are defined to use generic URI syntax.

### Socket.IO | Integrating Socket.IO into the Application

Socket.IO is a library that enables `low-latency`, `bidirectional` and `event-based communication` between a client and a server.

Socket.IO is composed of two parts:

 - A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io;
 - A client library that loads on the browser side socket.io-client.

During development, socket.io serves the client automatically for us, as we’ll see, so for now we only have to install one module:

 - `npm install socket.io`

That will install the module and add the dependency to `package.json`. Now let’s edit `index.js` to add it:

```js
// index.js

import { Server } from 'socket.io'

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listeing on PORT: ${process.env.PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN, // front-end application
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
})

// Connection with web socket
io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })
  
  // ...
```

Notice that I `initialize a new instance of socket.io` by passing the `server` (the HTTP server) object. Then I listen on the connection event for incoming sockets.

To load the `socket.io-client` that exposes an `io global` we need to install its library:

 - `npm i socket.io-client`

```jsx
// src/pages/Chat.jsx

import { hostServer } from '../utils/api-routes'
import { io } from 'socket.io-client'
// ...

const Chat = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	// ...
  // the useRef Hook allows you to persist values between renders
  const socket = useRef()
  
  useEffect(() => {
    async function handleCurrentUser() {
      if (!localStorage.getItem('mirage-app-user')) {
        navigate('/login')
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem('mirage-app-user'))
        )
      }
    }
    handleCurrentUser()
  }, [searching])

  useEffect(() => {
   if (currentUser) {
      socket.current = io(hostServer, {
        withCredentials: true,
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling'],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
      }) // CONNECT to web socket server
      socket.current.emit('add-user', currentUser._id) // emits the EVENT and passes the DATA
    }
  }, [currentUser])
```
* on the server there is already a socket listening for the `add-user` event

Now that we have access to the `online user ID` via web sockets, we can handle the `message sent` and `message received` events, called `send-msg` and `msg-received` respectively:

```js
// index.js

socket.on('send-msg', (data) => { // will receive a message and the data of this event
    console.log(data) 
    const sendUserSocket = onlineUsers.get(data.to) // get online user with 'to' id value from inside the 'data' object
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-received', data.message) // and so send to 'sendUserSocket' an emission of the 'msg-received' event passing the message data to the frontend
    }
  })
```

On the application front we can manipulate when these events will be triggered and what data we need to send, notice that the server expects a javascript object `data` with the properties `to` and `message` that must be sent from the front, and thus gets the user online with the `id` of `to` and sends only to `sendUserSocket` the `msg-received` event with the event data that should be rendered in the `data.message` front:

```json
{
  "to": "6342caaa84614zzz91f7b4a8",
  "from": "634aaa0dayyy4a3c18f0ffac",
  "message": "teste"
}
```
* web socket receiving data

```jsx
const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const displayMobile = useRecoilValue(displayMobileSelector)
  const scrollRef = useRef()

  // sending data to socket and to the database
  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    })
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  // getting data from socket
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-received', (msg) => {
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg })
      })
    }
  }, [])

  // updates the message array with the message received from the server
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])
  // ...
  
  // getting messages from the database
   useEffect(() => {
    async function sendMessage() {
      const response = await axios.get(allMessagesRoute, {
        params: {
          from: currentUser._id,
          to: currentChat._id,
        },
      })
      setMessages(response.data)
    }
    sendMessage()
  }, [currentChat])

// rendering the data
 return (
    <>
      {currentChat && (
        <Wrapper display={displayMobile}>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="user/avatar" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div ref={scrollRef} key={uuiv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? 'sended' : 'recieved'
                  }`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Wrapper>
      )}
    </>
  )
}
```
*<i>socket.io/get-started/chat</i> <br />

<br />

## LocalStorage and Sessions 

The `localStorage` property allows accessing a local Storage object. localStorage is similar to sessionStorage. The only difference is that while `data stored in localStorage does not expire`, data in sessionStorage is cleared when the page session expires — that is, when the page (tab or window) is closed.

In order to create a session for the user so that we can identify him with his credentials, we must establish a `persistent object` in his browser which will be placed in `localStorage` through `setItem` as soon as the user registers or enters the application. First we must pass the name of this `storage/object` which will be called `mirage-app-user`, and the second argument is the `data itself`. A check is also made to block such a route if the user already has a session created, the same process is done on the login page:

```jsx
// src/pages/Register.jsx

useEffect(() => {
  if (localStorage.getItem('mirage-app-user')) {
    navigate('/')
  }
}, [])

const handleSubmit = async (event) => {
  event.preventDefault()
  if (handleValidation()) {
    const { username, email, password } = values
    const { data } = await axios.post(registerRoute, {
      username,
      email,
      password,
    })
    if (data.status === false) {
      toast.error(data.msg, toastOptions)
    }
    if (data.status === true) {
      localStorage.setItem('mirage-app-user', JSON.stringify(data.user))
      navigate('/')
    }
  }
}
```

So on the chat page we can get the user's session credentials with `getItem`:

```jsx
// src/pages/Chat.jsx

useEffect(() => {
  async function handleCurrentUser() {
    if (!localStorage.getItem('mirage-app-user')) {
      navigate('/login')
    } else {
      setCurrentUser(
        await JSON.parse(localStorage.getItem('mirage-app-user'))
      )
    }
  }
  handleCurrentUser()
}, [])
```

If the user wants to end their session, just clear the localStorage:

```jsx
// src/components/Logout.jsx

export const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <Button onClick={() => handleLogout()}>
      <BiPowerOff />
    </Button>
  )
}
```
*<i>developer.mozilla.org/en-US/docs/Web/API/Window/localStorage</i> <br />


