import mongoose from 'mongoose'

import User from './user'
import Post from './post'
import Favourite from './favouritePosts'

const connectDB = () => {
  const connectionString = `mongodb://db:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

const models = { User, Post, Favourite }

export default models

export { connectDB }
