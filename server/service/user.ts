import mongoose = require('mongoose')

const User = mongoose.model('User')


export const checkPassword = async (email: string, password: number) => {
  let match = false
  const user: any = await User.findOne({ email })

  if (user) {
    match = await user.comparePassword(password, user.password)
  }
  return {
    match,
    user
  }
}
