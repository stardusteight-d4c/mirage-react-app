import express from 'express'
import { register, login, chooseAvatar, getAllUsers } from '../controllers/usersController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/chooseAvatar/:id', chooseAvatar)
router.get('/allUsers/:id', getAllUsers)

export { router }


