import { resolve } from 'path'
import { check, fix } from 'prettier-tslint'

console.log(check(resolve(__dirname, '../server/tasks/qiniu.ts')))
console.log(fix(resolve(__dirname, '../server/tasks/qiniu.ts')))
console.log(check(resolve(__dirname, '../server/tasks/qiniu.ts')))
