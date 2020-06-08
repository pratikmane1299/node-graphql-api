import mongoose from 'mongoose'
import bycrypt from 'bcrypt'

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
  posts: [
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
  return await bycrypt.hash(this.password, saltRounds)
}

userSchema.methods.comparePasswords = async function (password) {
  return await bycrypt.compare(password, this.password)
}

const User = new mongoose.model('User', userSchema)

export default User
