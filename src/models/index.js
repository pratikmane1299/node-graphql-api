import mongoose from 'mongoose'

import User from './user'
import Post from './post'
import Favourite from './favouritePosts'

const connectDB = () => {
  return mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

const models = { User, Post, Favourite }

export default models

export { connectDB }
