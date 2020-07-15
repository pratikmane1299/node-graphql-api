import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'

import { getUserId } from './../util.js'

export default {
  Query: {
    users: async (_, __, { models }) => {
      return await models.User.find({})
    },
    user: async (_, { id }, { models }) => {
      return await models.User.findOne({ _id: id })
    }
  },
  Mutation: {
    signUp: async (_, { username, password }, { models, secret, req, port }) => {
      const avatar_url = req.protocol + '://' + req.hostname + ':' + port + '/assets/avatar-person.png'
      const user = await models.User.create({
        username,
        password,
        avatar_url
      })

      const token = jwt.sign({ id: user._id, username }, secret)

      return {
        id: user._id,
        username,
        avatar_url,
        token
      }
    },
    login: async (_, { username, password }, { models, secret }) => {
      const user = await models.User.findOne({ username: username })
      if (!user) return

      const isValid = await user.comparePasswords(password)
      if (!isValid) throw new AuthenticationError('Incorrect Password')

      const token = jwt.sign({ id: user._id, username }, secret, {
        expiresIn: '1h'
      })

      return {
        id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        token
      }
    },
    addPostToFavourites: async (_, { postId }, { req, models, secret }) => {
      const userId = await getUserId(req, secret, models)

      const post = await models.Post.findOne({ _id: postId })

      if (!post) {
        throw Error('Post Not Found')
      }

      await models.User.updateOne(
        { _id: userId },
        { $push: { favourite_posts: { _id: postId } } }
      )

      return post
    }
  },
  User: {
    posts: async (user, args, { models }, info) => {
      return await models.Post.find({ author: user.id })
    },
    favourite_posts: async (user, args, { models }, info) => {
      const data = await models.User
        .findOne({ _id: user.id })
        .populate('favourite_posts')
      return data.favourite_posts
    }
  }
}
