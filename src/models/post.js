import mongoose, { Model } from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
})

const post = new mongoose.model('Post', postSchema)

export default post
