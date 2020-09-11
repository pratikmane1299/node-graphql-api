import { getUser } from './../util.js'

export default {
  Mutation: {
    comment: async (_, { postId, text }, { req, secret, models }) => {
      const user = await getUser(req, secret, models)

      const comment = await models.Comment.create({
        text,
        post: postId,
        commentedBy: user.id
      })

      return comment
    }
  },
  Comment: {
    commentedBy: async (comment, _, { models }) => {
      return await models.User.findOne({ _id: comment.commentedBy })
    }
  }
}
