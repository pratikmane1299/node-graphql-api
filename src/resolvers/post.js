import { getUser } from './../util.js'
import { model } from 'mongoose';
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
      return await models.Post.findOne({ _id: id })
    },
    feed: async (_, { offset = 0, limit = 5 }, { models }) => {
      return await models.Post.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit)
    }
  },
  Mutation: {
    createPost: async (_, { title, content, thumbnail }, { models, req, secret }) => {
      const user = await getUser(req, secret, models)

      const post = await models.Post.create({
        title,
        content,
        thumbnail,
        author: user.id
      })

      await models.User.updateOne(
        { _id: user.id },
        { $push: { posts: { _id: post._id } } }
      )

      return {
        id: post._id,
        title,
        content,
        thumbnail,
        createdAt: post.createdAt
      }
    },
    deletePost: async (_, { id }, { req, secret, models }) => {
      const user = await getUser(req, secret, models)

      await models.Post.deleteOne({ _id: id })

      await models.User.updateOne(
        { _id: user.id },
        { $pull: { posts: { _id: id } } }
      )
    },
    updatePost: async (_, { id, title, content }, { req, secret, models }) => {
      const user = getUser(req, secret, models)

      await models.Post.updateOne({ _id: user.id }, { title: title, content: content })

      return {
        id,
        title,
        content
      }
    },
    likeUnLikePost: async (_, { postId }, { req, secret, models }) => {
      const user = await getUser(req, secret, models)

      const post = await models.Post.findOne({ _id: postId }, '_id title content thumbnail likes')
      const userId = String(user._id)

      if (post.likes.find(like => String(like.likedBy) === userId)) {
        post.likes = post.likes.filter(like => String(like.likedBy) !== userId)
      } else {
        post.likes.push({ likedBy: user._id })
      }

      await post.save();

      return {
        post,
        likedBy: user
      }
    }
  },
  Post: {
    author: async (post, args, { models }) => {
      const user = await models.User.findOne({ posts: post.id })

      return {
        id: user._id,
        username: user.username,
        avatar_url: user.avatar_url
      }
    },
    likes: async (post, _, { models }) => {
      const res = await models.Post
        .findOne({ _id: post.id }, 'likes')
        .populate({ path: 'likes', populate: { path: 'likedBy', select: '_id username avatar_url' } })

      return res.likes.map(l => {
        return {
          likedBy: l.likedBy
        }
      })

    },
    likesCount: (post) => {
      return post.likes.length
    },
    comments: async (post, _, { models }) => {
      return await models.Comment
        .find({ post: post.id })
        .sort({ createdAt: -1 })
    },
    commentsCount: async (post, _, { models }) => {
      return await models.Comment.estimatedDocumentCount({ post: post.id })
    }
  }
}
