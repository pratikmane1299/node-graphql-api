import 'dotenv/config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema'
import resolvers from './resolvers'
import models, { connectDB } from './models'

const app = express()
const port = process.env.PORT || 5000

const graphqlServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: (req) => {
    // const me = getMe(req)
    return {
      ...req,
      models,
      secret: process.env.SECRET
    }
  }
})

graphqlServer.applyMiddleware({ app })

connectDB().then(async () => {
  /* await Promise.all([
    models.User.deleteMany({}),
    models.Post.deleteMany({})
  ]) */
  console.log('connected to DB')
})

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port}/graphql`)
})
