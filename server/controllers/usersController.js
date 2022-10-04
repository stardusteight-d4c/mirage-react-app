import userModel from '../model/userModel.mjs'
import brcypt from 'bcrypt'

const User = userModel()

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const usernameCheck = await userModel.findOne({ username })
    console.log('usernameCheck', usernameCheck);
    const emailCheck = await userModel.findOne({ email })
    if (usernameCheck) {
      return res.json({ msg: 'username already used', status: false })
    }
    if (emailCheck) {
      return res.json({ msg: 'Email already used', status: false })
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

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.json({ msg: 'Incorrect username or password', status: false })
    }
    const isPasswordValid = brcypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({ msg: 'Incorrect username or password', status: false })
    }
    delete user.password
    return res.json({ status: true, user })
  } catch (error) {
    next(error)
  }
}
