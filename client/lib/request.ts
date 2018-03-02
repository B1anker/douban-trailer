import axios from 'axios'

import { message } from 'antd'

const defaultAxiosConf = {
  timeout: 5000
}

const fetch = (params = {}, fn = (flag: boolean) => {}) => {
  return axios({ ...defaultAxiosConf, ...params })
    .then(res => {
      const { success, data, err, code } = res.data
      if (code === 401) {
        window.location.href = '/'
        return
      }
      if (success) {
        fn(false)
        return data
      }
      throw err
    })
    .catch(err => {
      fn(false)
      message.error(String(err || '网络错误'))
    })
}

export default (param) => {
  const type = typeof param

  if (type === 'function') {
    param(true)
    return (obj) => fetch(obj, param) as any
  }

  if (type === 'object' && type !== null) {
    return fetch(param) as any
  }
}