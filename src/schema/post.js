import { gql } from 'apollo-server'

const postSchema = gql`
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post
    feed(offset: Int, limit: Int): [Post!]
  }

  extend type Mutation {
    createPost(title: String!, content: String!, thumbnail: String): Post!
    updatePost(id: ID!, title: String!, content: String!): Post!
    deletePost(id: ID!): Post,
    likeUnLikePost(postId: ID!): Like!
    comment(postId: ID!, text: String!): Comment
  }

  scalar Date

  type Post {
    id: ID!
    title: String!
    content: String!
    thumbnail: String
    author: User!,
    likes: [Like],
    likesCount: Int,
    comments: [Comment],
    createdAt: Date,
    updatedAt: Date
  }

  type Like {
    post: Post!
    likedBy: User!
  }

  type Comment {
    id: ID!,
    text: String!,
    post: Post!,
    commentedBy: User!,
    createdAt: Date
  }
`
export default postSchema
