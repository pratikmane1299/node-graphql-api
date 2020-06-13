import { getUserId } from './../util.js'
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value
    },
    serialize(value) {
      return new Date(Number(value))
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
  Query: {
    posts: async (_, __, { models }) => {
      return await models.Post.find({}).sort({ createdAt: -1 })
    },
    post: async (_, { id }, { models }) => {
      return await models.Post.findOne({ _id: id }, '_id title content thumbnail')
    },
  },
  Mutation: {
    createPost: async (_, { title, content, thumbnail }, { models, req, secret }) => {
      const userId = await getUserId(req, secret, models)

      const post = await models.Post.create({
        title,
        content,
        thumbnail,
        author: userId
      })

      await models.User.updateOne(
        { _id: userId },
        { $push: { posts: { _id: post._id } } }
      )

      return {
        id: post._id,
        title,
        content,
        thumbnail
      }
    },
    deletePost: async (_, { id }, { req, secret, models }) => {
      const userId = await getUserId(req, secret, models)

      await models.Post.deleteOne({ _id: id })

      await models.User.updateOne(
        { _id: userId },
        { $pull: { posts: { _id: id } } }
      )
    },
    updatePost: async (_, { id, title, content }, { req, secret, models }) => {
      const userId = getUserId(req, secret, models)

      await models.Post.updateOne({ _id: id }, { title: title, content: content })

      return {
        id,
        title,
        content
      }
    }
  },
  Post: {
    author: async (post, args, { models }) => {
      const user = await models.User.findOne({ posts: post.id }, 'id username')

      return {
        id: user._id,
        username: user.username
      }
    }
  }
}
