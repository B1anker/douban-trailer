const Koa = require('koa')

const app = new Koa()
const port = 3000

app.use((ctx, next) => {
  ctx.body = 'Hello World!'
})

app.listen(port, (err) => {
  if (!err) {
    console.log('listen on: ' + port)
  } else {
    console.log(err)
  }
})

