import mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    defualt: 0
  },
  lockUntil: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) {
        return next(error)
      }
      this.password = hash
      next()
    })
  })
  next()
})

userSchema.methods = {
  comparePassword (fromClient, fromDatabase) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(fromClient, fromDatabase, (err, isMatch) => {
        if (!err) {
          resolve(isMatch)
        } else {
          reject(err)
        }
      })
    })
  },

  incLoginAttempts (user) {
    return new Promise ((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
      } else {
        const updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          (updates as any).$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) {
            resolve(true)
          } else {
            reject(err)
          }
        })
      }
    })
  }
}

mongoose.model('User', userSchema)