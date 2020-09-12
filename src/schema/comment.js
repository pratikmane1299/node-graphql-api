import { gql } from 'apollo-server'

const commentSchema = gql`
  extend type Query {
    comments(postId: ID!): [Comment]
  }

  extend type Mutation {
    comment(postId: ID!, text: String!): Comment
  }

  type Comment {
    id: ID!,
    text: String!,
    post: Post!,
    commentedBy: User!,
    createdAt: Date
  }
`

export default commentSchema