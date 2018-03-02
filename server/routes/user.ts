import mongoose = require('mongoose')
import { Controller, post } from '../lib/decorator'
import {
  checkPassword
} from '../service/user'

@Controller('/api/v0/user')
export class UserController {
  @post('/')
  public async login (ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)

    if (!matchData.user) {
      return (ctx.boxy = {
        success: false,
        errMsg: '用户不存在'
      })
    }

    if (matchData.match) {
      return (ctx.boxy = {
        success: true
      })
    }

    return (ctx.boxy = {
      success: false,
      errMsg: '密码不正确'
    })
  }
}
