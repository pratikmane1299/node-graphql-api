import mongoose from 'mongoose'

import User from './user'
import Post from './post'

const connectDB = () => {
  return mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

const models = { User, Post }

export default models

export { connectDB }
