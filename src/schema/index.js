import { gql } from 'apollo-server'

import userSchema from './user'
import postSchema from './post'
import commentSchema from './comment'

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default [linkSchema, userSchema, postSchema, commentSchema]
