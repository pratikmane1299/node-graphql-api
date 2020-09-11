import mongoose from 'mongoose'

import User from './user'
import Post from './post'
import Favourite from './favouritePosts'
import Comment from './comment'

const connectDB = () => {
  const connectionString = `mongodb://db:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

const models = { User, Post, Favourite, Comment }

export default models

export { connectDB }
