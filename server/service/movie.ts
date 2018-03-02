import mongoose = require('mongoose')

const Movie = mongoose.model('Movie')

interface Query {
  movieTypes: any
  year: number
}

export const getAllMovies = async (type: string, year: number) => {
  const query: any = {}

  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }

  if (year) {
    query.year = year
  }

  const movies = await Movie.find(query)
  return movies
}

export const getMovieDetial = async (id: number | string) => {
  const movie = await Movie.findOne({_id: id})
  return movie
}

export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}