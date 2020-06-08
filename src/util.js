import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

import { User } from './models/user'

const createToken = async (user) => {
  const { _id, username } = user
  return jwt.sign({ id: _id, username }, process.env.SECRET, {
    expiresIn: 3600
  })
}

const getUserId = async (req, secret, models) => {
  // console.log(req)
  const token = req.headers.authorization.split(' ')[1]
  if (!token) throw new AuthenticationError('Unauthorized, JWT token not found')
  try {
    const { id } = await jwt.verify(token, secret)

    const user = await models.User.findOne({ _id: id })

    if (!user) throw new AuthenticationError('Unauthorized')

    return id
  } catch (e) {
    throw new AuthenticationError('Invalid JWT token')
  }
}

export { createToken, getUserId }
