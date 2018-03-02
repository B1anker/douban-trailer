import glob = require('glob')
import Router = require('koa-router')
import _ = require('lodash')
import path = require('path')
import R = require('ramda')

const routeMap = new Map()
const pathPrefix = Symbol('prefix')

const isArray = (c) => _.isArray(c) ? c : [c]

const resolvePath = R.unless(
  R.startsWith('/'),
  R.curryN(2, R.concat)('/')
)

export default class Route {
  private app: any
  private apiPath: string
  private router: Router


  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }

  public init () {
    glob.sync((path.resolve(this.apiPath, '**/*.ts'))).forEach(require)
    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[pathPrefix])
        router[method](prefix + path, ...callback)
      }
    )(routeMap)
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normailzePath = (path) => path.startsWith('/') ? path : `/${path}`

const router = (conf) => (target, key, descriptor) => {
  conf.path = normailzePath(conf.path)

  routeMap.set({
    target,
    ...conf
  }, target[key])
}

export const Controller = (path) => (target) => (target.prototype[pathPrefix] = path)

export const get = (path) => router({
  method: 'get',
  path
})

export const post = (path) => router({
  method: 'post',
  path
})

export const put = (path) => router({
  method: 'put',
  path
})

export const del = (path) => router({
  method: 'del',
  path
})

export const use = (path) => router({
  method: 'use',
  path
})

export const all = (path) => router({
  method: 'all',
  path
})
