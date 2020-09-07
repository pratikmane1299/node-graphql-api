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
  thumbnail: {
    type: String
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
}, {
  timestamps: true
})

const post = new mongoose.model('Post', postSchema)

export default post
