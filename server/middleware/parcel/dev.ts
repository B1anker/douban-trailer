import serve = require('koa-static')
import views = require('koa-views')
import Bundler = require('parcel-bundler')
import { resolve } from 'path'

const r = path => resolve(__dirname, path)

const bundler = new Bundler(r('../../../client/index.html'), {
  publicUrl: '/',
  watch: true,
  cache: true
})

export const dev = async app => {
  await bundler.bundle()
  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')), {
    extendsion: 'html'
  })
  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}

