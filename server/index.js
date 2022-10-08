import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { router as userRoutes } from './routes/userRoutes.mjs'
import { router as messagesRoutes } from './routes/messagesRoutes.mjs'
import { Server } from 'socket.io'

const app = express()
dotenv.config()

app.use(cors())
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
    origin: 'http://localhost:5173',
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
    console.log(data);
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-received', data.message)
    }
  })
})
