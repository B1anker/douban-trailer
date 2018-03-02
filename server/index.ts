const chalk = require('chalk')
import Koa = require('koa')
import { join } from 'path'
import R = require('ramda')
import { connect, initAdmin, initSchemas } from './database/init'

const MIDDLEWARES: string[] = ['router']
const app: Koa = new Koa()
const port: number = 3000

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}

async function start () {
  await connect()
  initSchemas()
  await initAdmin()

  await useMiddlewares(app)
  const server = app.listen(port, () => {
    console.log(
      process.env.NODE_ENV === 'development'
        ? `Open ${chalk.green('http://localhost:' + port)}`
        : `App listening on port ${port}`
    )
  })
}

start()
