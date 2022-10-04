import express from 'express'
import { register, login, chooseAvatar } from '../controllers/usersController'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/chooseAvatar/:id', chooseAvatar)

export { router }


