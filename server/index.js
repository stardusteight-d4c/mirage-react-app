import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { router as userRoutes } from './routes/userRoutes.js'
import { router as messagesRoutes } from './routes/messagesRoutes.js'
import { Server } from 'socket.io'

const app = express()
dotenv.config()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN)
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  app.use(cors())
  next()
})
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/messages', messagesRoutes)

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

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listeing on PORT: ${process.env.PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
})

global.onlineUsers = new Map()

// Connection with web socket
io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    console.log(data)
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-received', data.message)
    }
  })
})
