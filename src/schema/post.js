import { gql } from 'apollo-server'

const postSchema = gql`
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(title: String!, content: String!, thumbnail: String): Post!
    updatePost(id: ID!, title: String!, content: String!): Post!
    deletePost(id: ID!): Post
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    thumbnail: String
    author: User!
  }
`
export default postSchema
