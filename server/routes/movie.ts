import mongoose = require('mongoose')
import { Controller, get } from '../lib/decorator'
import {
  getAllMovies,
  getMovieDetial,
  getRelativeMovies
} from '../service/movie'

@Controller('/api/v0/movies')
export class MovieController {
  @get('/')
  public async getMovies (ctx, next) {
    const Movie = mongoose.model('Movie')
    console.log(ctx.query)
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)
    ctx.body = {
      success: true,
      data: movies
    }
  }

  @get(':id')
  public async getMovieDetial (ctx, next) {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await getMovieDetial(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}
