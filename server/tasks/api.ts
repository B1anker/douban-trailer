import fly = require('flyio')
import mongoose = require('mongoose')

const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie (movie) {
  const url = `http://api.douban.com/v2/movie/${movie.doubanId}`
  const result = await (fly as any).get(url)
  return result.data
}

const run = async () => {
  const movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })

  movies.forEach(async (movie: any) => {
    const movieData: any = await fetchMovie(movie)
    if (movieData) {
      const tags = movieData.tags || []
      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2999
        for (let i = 0, len = movie.movieTypes.length; i < len; i++) {
          const type = movie.movieTypes[i]
          let cat: any = await Category.findOne({
            name: type
          })
          if (!cat) {
            cat = new Category({
              name: type,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }
          await cat.save()
          if (!movie.category) {
            movie.category = []
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        const dates = movieData.attrs.pubdate || []
        const pubdates = []

        dates.forEach((date) => {
          if (date && date.split('(').length > 0) {
            const parts = date.split('(')
            let country: string = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }

            pubdates.push({
              date: new Date(parts[0]),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }

      tags.forEach((tag) => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  })
}

run()