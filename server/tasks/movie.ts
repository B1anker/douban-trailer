import * as cp from 'child_process'
import { resolve } from 'path'

~(async function () {
  const script = resolve(__dirname, '../crawler/trailer-list')
  const child = cp.fork(script, [])
  let invoke = false

  child.on('error', (err) => {
    if (invoke) {
      return
    }
    invoke = true
    console.log(err)
  })

  child.on('exit', (code) => {
    if (invoke) {
      return
    }
    invoke = false
    const err = code === 0 ? null : new Error('exit code' + code)
    console.log(err)
  })

  child.on('message', (data) => {
    const result = data.result
    console.log(result)
  })
})()