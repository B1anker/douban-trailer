import React = require('react')
import { render } from 'react-dom'
import {
  BrowserRouter
} from 'react-router-dom'
import App from './app'

const app = document.getElementById('app')

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  app
)
const hot = (module as any).hot
if (hot) {
  hot.dispose(function () {
    // 模块即将被替换时
    console.log('module will be replaced')
  })

  hot.accept(function () {
    // 模块或其依赖项之一刚刚更新时
    console.log('module update')
  })
}
