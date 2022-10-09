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

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.json({
        msg: 'Senha ou nome de usuário incorretos',
        status: false,
      })
    }
    const isPasswordValid = await brcypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({
        msg: 'Senha ou nome de usuário incorretos',
        status: false,
      })
    }
    delete user.password
    return res.json({ status: true, user })
  } catch (error) {
    next(error)
  }
}

export const chooseAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatarImage = req.body.image
    const userData = await userModel.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    })
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel
      .find({ _id: { $ne: req.params.id } })
      .select(['email', 'username', 'avatarImage', '_id'])
    return res.json(users)
  } catch (error) {
    next(error)
  }
}
