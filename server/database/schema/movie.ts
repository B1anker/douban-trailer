import mongoose = require('mongoose')

const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types

const movieSchema = new Schema({
  doubanId: {
    type: Number,
    unique: true,
    required: true
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  summary: String,
  video: String,
  videoKey: String,
  poster: String,
  posterKey: String,
  cover: String,
  coverKey: String,
  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  tags: Array,
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

movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieSchema)