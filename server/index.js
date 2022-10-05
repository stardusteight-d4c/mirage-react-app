import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { router as userRoutes } from './routes/userRoutes.mjs'
import { router as messagesRoutes } from './routes/messagesRoutes.mjs'

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
