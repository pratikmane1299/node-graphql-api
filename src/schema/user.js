import { gql } from 'apollo-server'

const userSchema = gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(username: String!, password: String!): Token
    login(username: String!, password: String!): Token
  }

  type User {
    id: ID!
    username: String!
    posts: [Post!]
  }

  type Token {
    token: String!
  }
`
export default userSchema
