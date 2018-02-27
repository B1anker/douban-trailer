const fly = require('flyio')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const result = fly.get(url)
  return result
}

~(async function () {
  const movies = [{
    doubanId: 27192249,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2508618353.jpg',
    title: '海月姬',
    rate: 6.9
  },
  {
    doubanId: 27065652,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2462122972.jpg',
    title: '99.9：刑事专业律师 第二季',
    rate: 8.5
  }]

  movies.map(async (movie, index) => {
    const movieData = await fetchMovie(movie)
    console.log(movieData)
  })

})()