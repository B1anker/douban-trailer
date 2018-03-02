import * as nanoid from 'nanoid'
import * as qiniu from 'qiniu'

interface QiniuConfig {
  bucket: string
  AK: string
  SK: string
}

interface ListOptions {
  limit?: number
  prefix?: string
  marker?: string
  delimiter?: string
}

export default class Qiniu {
  private bucket: string
  private AK: string
  private SK: string
  private mac: qiniu.auth.digest.Mac
  private cfg: qiniu.conf.Config
  private uploadToken: string
  private putPolicy: qiniu.rs.PutPolicy
  private bucketManager: qiniu.rs.BucketManager

  constructor (config: QiniuConfig) {
    this.bucket = config.bucket
    this.AK = config.AK
    this.SK = config.SK
    this.mac = new qiniu.auth.digest.Mac(this.AK, this.SK)
    this.cfg = new qiniu.conf.Config()
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.cfg)
    this.setUploadToken()
  }


  /**
   * 上传文件
   * @param {String} [url] [文件路径]
   * @param {String} [format] [文件格式]
   */
  public uploadFile (url: string, format: string) {
    const filename = nanoid() + '.' + format
    return new Promise((resolve, reject) => {
      const formUploader: qiniu.form_up.FormUploader = new qiniu.form_up.FormUploader(
        this.cfg
      )
      const putExtra: qiniu.form_up.PutExtra = new qiniu.form_up.PutExtra()
      formUploader.putFile(
        this.uploadToken,
        filename,
        url,
        putExtra,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err)
          } else {
            if (respInfo.statusCode === 200) {
              resolve(respBody)
            } else {
              reject({
                code: respInfo.statusCode,
                body: respBody
              })
            }
          }
        }
      )
    })
  }

  /**
   * 修改文件MimeType
   * @param {String} [key] [文件名]
   * @param {String} [newType] [新的MimeType]
   */
  public changeMime (key: string, newMime: string) {
    return new Promise((resolve, reject) => {
      this.bucketManager.changeMime(this.bucket, key, newMime, (err, respBody, respInfo) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            code: respInfo.statusCode,
            data: respBody
          })
        }
      })
    })
  }

  /**
   * 修改文件存储类型
   * @param {String} [key] [文件名]
   * @param {Number} [newType] [新的文件存储类型, //newType=0表示普通存储，newType为1表示低频存储]
   */
  public changeSaveType (key: string, newType: number) {
    return new Promise((resolve, reject) => {
      this.bucketManager.changeType(this.bucket, key, newType, (err, respBody, respInfo) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            code: respInfo.statusCode,
            data: respBody
          })
        }
      })
    })
  }

  /**
   * 移动或重命名文件
   * @param {String} [destBucket] [目标bucket]
   * @param {String} [srcKey] [源文件名]
   * @param {String} [destKey] [目标文件名]
   */
  public move (srcKey: string, destKey: string, destBucket?: string) {
    destBucket = destBucket || this.bucket
    return new Promise ((resolve, reject) => {
      const options = {
        force: true
      }
      this.bucketManager.move(this.bucket, srcKey, destBucket, destKey, options, function (
        err, respBody, respInfo) {
        if (err) {
          reject(err)
        } else {
          resolve({
            code: respInfo.statusCode,
            data: respBody
          })
        }
      })
    })
  }

  /**
   * 抓取网络资源到空间
   * @param {String | String[]} [url] [目标文件网络地址]
   * @param {String | String[]} [key] [存放空间的文件名]
   */
  public fetchNetworkResourceToArea (url: string, format: string) {
    const filename = nanoid() + '.' + format
    return new Promise((resolve, reject) => {
      this.bucketManager.fetch(url, this.bucket, filename, (err, respBody, respInfo) => {
        if (err) {
          reject(err)
        } else {
          if (respInfo.statusCode === 200) {
            resolve({ key: filename })
          } else {
            reject(respInfo)
          }
        }
      })
    })
  }

  /**
   * 批量获取文件信息
   * @param {String | String[]} [key] [文件名]
   */
  public info (key: string | string[]) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        key = [key]
      }
      const statOperations = key.map((k) => qiniu.rs.statOp(this.bucket, k))
      this.bucketManager.batch(statOperations, (err, body, info) => {
        if (err) {
          reject(err)
        } else {
          if (parseInt((info.statusCode / 100).toString(), 10) === 2) {
            resolve(body)
          } else {
            reject({
              code: info.statusCode,
              data: body
            })
          }
        }
      })
    })
  }

  /**
   * options 批量获取指定前缀的文件信息
   * @param {String} [prefix] [列举的文件前缀]
   * @param {String} marker [上一次列举返回的位置标记，作为本次列举的起点信息]
   * @param {Number} limit [每次返回的最大列举文件数量]
   * @param {String} delimiter [指定目录分隔符]
   */
  public list (options: ListOptions = {}) {
    options = {
      ...{
        limit: 10,
        prefix: ''
      },
      ...options
    }
    return new Promise((resolve, reject) => {
      this.bucketManager.listPrefix(this.bucket, options, function (
        err,
        body,
        info
      ) {
        if (err) {
          reject(err)
        }
        if (info.statusCode === 200) {
          // 如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
          // 指定options里面的marker为这个值
          const nextMarker = body.marker
          const commonPrefixes = body.commonPrefixes
          const items = body.items
          resolve({
            nextMarker,
            commonPrefixes,
            items
          })
        } else {
          reject({
            code: info.statusCode,
            data: body
          })
        }
      })
    })
  }

  /**
   * 批量删除文件
   * @param {String | String[]} [key] [文件名]
   */
  public del (keys: string | string[]) {
    return new Promise((resolve, reject) => {
      if (typeof keys === 'string') {
        keys = [keys]
      }
      const deleteOperations = keys.map((k) => qiniu.rs.deleteOp(this.bucket, k))
      this.bucketManager.batch(deleteOperations, function (
        err,
        respBody,
        respInfo
      ) {
        if (err) {
          reject(err)
        } else {
          // 200 is success, 298 is part success
          if (parseInt((respInfo.statusCode / 100).toString(), 10) === 2) {
            resolve(respBody)
          } else {
            reject(err)
          }
        }
      })
    })
  }  

  /**
   * 打印list查询到的结果
   * @param {Object} [data] [数据]
   */
  public printList (data) {
    console.log(`nextMarker: ${data.nextMarker || null}`)
    console.log(`commonPrefixes: ${data.commonPrefixes || null}`)
    data.items.forEach((item) => {
      console.log(
        item.key +
          '\t' +
          item.fsize +
          '\t' +
          item.hash +
          '\t' +
          item.mimeType +
          '\t' +
          item.putTime +
          '\t' +
          item.type
      )
    })
  }

  /**
   * 打印info查询到的结果
   * @param {Array} [items] [数据]
   */
  public printInfo (items) {
    items.forEach(function (item) {
      if (item.code === 200) {
        console.log(
          item.data.fsize +
            '\t' +
            item.data.hash +
            '\t' +
            item.data.mimeType +
            '\t' +
            item.data.putTime +
            '\t' +
            item.data.type
        )
      } else {
        console.log(item.code + '\t' + item.data.error)
      }
    })
  }

  /**
   * 设置上传token
   */
  private setUploadToken (options: qiniu.rs.PutPolicyOptions = {}) {
    options = { ...{ scope: this.bucket }, ...options }
    this.putPolicy = new qiniu.rs.PutPolicy(options)
    this.uploadToken = this.putPolicy.uploadToken(this.mac)
    return this.uploadToken
  }
}
