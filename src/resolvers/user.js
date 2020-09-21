import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers';

import { createToken, getUser, isAuthenticated } from './../util.js'

export default {
  Query: {
    users: async (_, __, { models }) => {
      return await models.User.find({})
    },
    user: async (_, { id }, { models }) => {
      return await models.User.findOne({ _id: id })
    },
    me: combineResolvers(
      isAuthenticated,
      async (_, __, { req, models }) => {
        const user = await models.User.findOne({ _id: req.user.id })
  
        if (!user) throw new AuthenticationError('User Not Found')
  
        return user;
      }
    )
  },
  Mutation: {
    signUp: async (_, { username, password }, { models, secret, req, port }) => {
      const avatar_url = req.protocol + '://' + req.hostname + ':' + port + '/assets/avatar-person.png'
      const user = await models.User.create({
        username,
        password,
        avatar_url
      })

      const token = createToken(user)

      return {
        id: user._id,
        username,
        avatar_url,
        token
      }
    },
    login: async (_, { username, password }, { models }) => {
      const user = await models.User.findOne({ username: username })
      if (!user) return

      const isValid = await user.comparePasswords(password)
      if (!isValid) throw new AuthenticationError('Incorrect Password')

      const token = createToken(user)

      return {
        id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
        token
      }
    },
    addPostToFavourites: combineResolvers(
      isAuthenticated,
      async (_, { postId }, { req: { user }, models}) => {
        const post = await models.Post.findOne({ _id: postId })
  
        if (!post) {
          throw Error('Post Not Found')
        }
  
        await models.Favourite.create({
          user: user.id,
          post: postId
        })
  
        return post
      }
    ),
    removePostFromFavourites: combineResolvers(
      isAuthenticated,
      async (_, { postId }, { req: { user }, models}) => {
  
        const result = await models.Favourite.findOneAndDelete({
          user: user.id,
          post: postId
        })
  
        return result.post
      }
    )
  },
  User: {
    posts: async (user, { offset = 0, limit = 8 }, { models }, info) => {
      return await models.Post.find({ author: user.id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    },
    favourite_posts: async (user, { offset = 0, limit = 8 }, { models }, info) => {
      const data = await models.Favourite
        .find({ user: user.id }, 'post')
        .populate('post')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
      return data.map(d => d.post)
    },
    totalPosts: async (user, _, { models }) => {
      return await models.Post.find({ author: user.id }).countDocuments()
    }
  }
}
