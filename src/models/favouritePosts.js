import mongoose from 'mongoose'

const favouritesSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const favourites = new mongoose.model('Favourite', favouritesSchema)

export default favourites