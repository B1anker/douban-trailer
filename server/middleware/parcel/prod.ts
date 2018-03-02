import serve = require('koa-static')
import views = require('koa-views')
import Bundler = require('parcel-bundler')
import { resolve } from 'path'

const r = path => resolve(__dirname, path)

export const prod = async app => {
  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')), {
    extendsion: 'html'
  })
  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}

