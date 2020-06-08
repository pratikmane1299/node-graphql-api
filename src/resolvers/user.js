import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'

export default {
  Query: {
    users: async (_, __, { models }) => {
      return await models.User.find({}, '_id username')
    },
    user: async (_, { id }, { models }) => {
      return await models.User.findOne({ _id: id }, '_id username')
    }
  },
  Mutation: {
    signUp: async (_, { username, password }, { models, secret }) => {
      const user = await models.User.create({
        username,
        password
      })

      const token = jwt.sign({ id: user._id, username }, secret)

      return { token }
    },
    login: async (_, { username, password }, { models, secret }) => {
      const user = await models.User.findOne({ username: username })
      if (!user) return

      const isValid = await user.comparePasswords(password)
      if (!isValid) throw new AuthenticationError('Incorrect Password')

      const token = jwt.sign({ id: user._id, username }, secret, {
        expiresIn: '1h'
      })

      return { token }
    }
  },
  User: {
    posts: async (user, args, { models }, info) => {
      return await models.Post.find({ author: user.id })
    }
  }
}
