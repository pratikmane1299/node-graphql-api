import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

import { skip } from 'graphql-resolvers'

const createToken = async (user) => {
  const { _id, username } = user
  return jwt.sign({ id: _id, username }, process.env.SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256'
  })
}

const getMe = req => {
  const authorization = req.headers['authorization']
  
  if (authorization) {
    try {
      const token = authorization.split(' ')[1]
      return jwt.verify(token, process.env.SECRET)
    } catch {
      throw new AuthenticationError('Invalid JWT Token')
    }
  }
};

const isAuthenticated = (parent, args, { req: { user } }) => {
  if (!user) {
    throw new AuthenticationError('Not Authenticated')
  }
  skip
}

export { createToken, getMe, isAuthenticated }
