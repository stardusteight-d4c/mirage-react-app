import express from 'express'
import { addMessage, getAllMessage, getLastMessage } from '../controllers/messagesController.js'

const router = express.Router()

router.post('/addMessage', addMessage)
router.get('/allMessages', getAllMessage)
router.get('/lastMessage', getLastMessage)


export { router }


