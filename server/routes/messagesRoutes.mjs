import express from 'express'
import { addMessage, getAllMessage } from '../controllers/messagesController'

const router = express.Router()

router.post('/addMessage', addMessage)
router.get('/allMessages', getAllMessage)


export { router }


