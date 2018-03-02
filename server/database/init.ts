const glob = require('glob')
const mongoose = require('mongoose')
const path = require('path')
const db = 'mongodb://localhost/douban-trailer';

(mongoose as any).Promise = global.Promise

export const initSchemas = () => {
  glob.sync((path.resolve(__dirname, './schema', '**/*.ts'))).forEach(require)
}

export const initAdmin = () => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

export const connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧')
      }
    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        reject(err)
        throw new Error('数据库挂了吧')
      }
      console.log(err)
    })
    mongoose.connection.once('open', err => {
      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}
