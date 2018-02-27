import * as nanoid from 'nanoid'
import config from '../config'
import Qiniu from '../utils/qiniu'

const qiniu = new Qiniu({
  bucket: config.qiniu.bucket,
  AK: config.qiniu.AK,
  SK: config.qiniu.SK
})

interface Movie {
  videoId: number
  doubanId: number
  videoLink: string
  cover: string
  poster: string
  pageLink: string
  key?: number | string
  videoKey?: string
  coverKey?: string
  posterKey?: string
}

const fetchNetworkResourceToArea = async (movies: Movie[]) => {
  movies.forEach(async (movie: Movie) => {
    if (movie.videoId && !movie.key) {
      try {
        console.log('开始传 video')
        const videoData = (await qiniu.fetchNetworkResourceToArea(
          movie.videoLink,
          'mp4'
        )) as any
        console.log('开始传 cover')
        const coverData = (await qiniu.fetchNetworkResourceToArea(
          movie.cover,
          'png'
        )) as any
        console.log('开始传 poster')
        const posterData = (await qiniu.fetchNetworkResourceToArea(
          movie.poster,
          'png'
        )) as any

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        console.log(movie)
      } catch (err) {
        console.log(err)
      }
    }
  })
}

fetchNetworkResourceToArea([
  {
    videoId: 226268,
    videoLink:
      'http://vt1.doubanio.com/201802271032/6e51a9308716ac4d24ba2c497dce265d/view/movie/M/302260268.mp4',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2510873350.jpg?',
    poster:
      'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2510906825.jpg',
    pageLink: 'https://movie.douban.com/trailer/226268/#content',
    doubanId: 27079310
  }
])
