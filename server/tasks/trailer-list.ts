import cp = require('child_process')
import mongoose = require('mongoose')
import { resolve } from 'path'

const Movie = mongoose.model('Movie')

const run = async () => {
  const script = resolve(__dirname, '../crawler/trailer-list')
  const child = cp.fork(script, [])
  let invoke = false

  child.on('error', (err) => {
    if (invoke) {
      return
    }
    invoke = true
    console.log(err)
  })

  child.on('exit', (code) => {
    if (invoke) {
      return
    }
    invoke = true
    const err = code === 0 ? null : new Error('exit code' + code)
    if (err) {
      console.log(err)
    }
  })

  child.on('message', (data) => {
    const result = data.result
    result.forEach(async (item) => {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })
      if (!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
  })
}

run()
