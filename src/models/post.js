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
  // createdAt: {
  //   type: Date,
  //   default: Date.now()
  // },
  // updatedAt: {
  //   type: Date,
  //   default: Date.now()
  // }
}, {
  timestamps: true
})

const post = new mongoose.model('Post', postSchema)

export default post
