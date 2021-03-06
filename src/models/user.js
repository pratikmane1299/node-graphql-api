import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20
  },
  avatar_url: String,
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }
  ],
  favourite_posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }
  ]
})

userSchema.pre('save', async function () {
  this.password = await this.generatePasswordHash()
})

userSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10
  return await bcrypt.hash(this.password, saltRounds)
}

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = new mongoose.model('User', userSchema)

export default User
