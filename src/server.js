import 'dotenv/config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema'
import resolvers from './resolvers'
import models, { connectDB } from './models'
import path from 'path'
import { getMe } from './util'
const app = express()

const port = process.env.PORT || 3000

const graphqlServer = new ApolloServer({ 
  typeDefs: schema,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      return {
        req,
        models,
        port
      }
    }

    if (req) {
      const user = getMe(req)
      req.user = user || null
      return {
        req,
        models,
        port
      }   
    }
  }
})

app.use(express.static(path.join(__dirname, 'public')))

graphqlServer.applyMiddleware({ app })

connectDB().then(async () => {
  // await Promise.all([
  //   models.User.deleteMany({}),
  //   models.Post.deleteMany({})
  // ])
  console.log('connected to DB')
})

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port}/graphql`)
})
