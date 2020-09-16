import { UserInputError } from 'apollo-server'
import { getUser } from './../util.js'

export default {
  Query: {
    comments: async (_, { postId }, { req, secret, models }) => {
      return await models.Comment
        .find({ post: postId })
        .sort({ createdAt: -1 })
    }
  },
  Mutation: {
    comment: async (_, { postId, text }, { req, secret, models }) => {
      const user = await getUser(req, secret, models)

      const comment = await models.Comment.create({
        text,
        post: postId,
        commentedBy: user.id
      })

      return comment
    },
    deleteComment: async (_, { commentId }, { req, secret, models }) => {
      const user = await getUser(req, secret, models)

      const comment = await models.Comment.findOne({ _id: commentId })

      if (!comment) {
        throw new UserInputError('Comment Not Found')
      }

      if (String(user.id) !== String(comment.commentedBy)) {
        throw new Error('Not Authorized')
      }

      return await models.Comment.findOneAndDelete({ _id: commentId })
    }
  },
  Comment: {
    commentedBy: async (comment, _, { models }) => {
      return await models.User.findOne({ _id: comment.commentedBy })
    }
  }
}
