import { gql } from 'apollo-server'

const userSchema = gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(username: String!, password: String!): AuthResponse
    login(username: String!, password: String!): AuthResponse
    addPostToFavourites(postId: ID!): Post
    removePostFromFavourites(postId: ID!): ID
  }

  type User {
    id: ID!
    username: String!
    avatar_url: String
    posts: [Post!]
    favourite_posts(offset: Int, limit: Int): [Post!]
  }

  type AuthResponse {
    id: ID!
    username: String!
    avatar_url: String!
    token: String!
  }
`
export default userSchema
