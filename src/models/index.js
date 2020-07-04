import mongoose from 'mongoose'

import User from './user'
import Post from './post'

const connectDB = () => {
  return mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

const models = { User, Post }

export default models

export { connectDB }
