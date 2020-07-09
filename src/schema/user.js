import { gql } from 'apollo-server'

const userSchema = gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(username: String!, password: String!): Token
    login(username: String!, password: String!): Token
    addPostToFavourites(postId: ID!): Post
  }

  type User {
    id: ID!
    username: String!
    avatar_url: String
    posts: [Post!]
    favourite_posts: [Post!]
  }

  type Token {
    token: String!
  }
`
export default userSchema
