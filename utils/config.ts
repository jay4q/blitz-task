import { config } from 'dotenv'
import { pathExistsSync } from 'fs-extra'
import { resolve } from 'path'

const IS_ONLINE = process.env.TENCENTCLOUD_RUNENV === 'SCF'

/** 本地用环境变量 */
const localEnv = (() => {
  if (IS_ONLINE) {
    return { secretId: undefined, secretKey: undefined }
  }

  // 本地用环境变量刚好和部署用环境变量一致
  const deployEnv = config({
    path: resolve(__dirname, '../.env.deploy'),
  })?.parsed

  const { TCB_SECRET_ID, TCB_SECRET_KEY } = deployEnv || {}

  if (!TCB_SECRET_ID || !TCB_SECRET_KEY) {
    throw new Error('❌缺少环境变量｜请检查 .env.deploy 是否配置')
  }

  return { secretId: TCB_SECRET_ID, secretKey: TCB_SECRET_KEY }
})()

/**
 * 本地开发用环境变量后缀
 *
 * 名称：dev | prod
 */
const localEnvSuffix = (() => {
  if (IS_ONLINE) {
    return undefined
  }

  const { NODE_ENV } = process.env

  let name = NODE_ENV
  switch (NODE_ENV) {
    case 'dev':
    case 'development':
      name = 'dev'
      break

    case 'prod':
    case 'production':
      name = 'prod'
      break

    default:
      name = NODE_ENV
      break
  }

  const isExists = pathExistsSync(resolve(__dirname, `../.env.${name}`))
  if (!isExists) {
    throw new Error(`❌ 缺少环境变量｜请检查 .env.${name} 文件是否配置`)
  }

  return name
})()

/** 环境变量 */
const envPath = resolve(__dirname, IS_ONLINE ? '.env' : `../.env.${localEnvSuffix}`)
const env = config({
  path: envPath,
})?.parsed

if (!env) {
  throw new Error(`❌ 缺少环境变量｜请检查 ${envPath} 文件是否配置`)
}

export const constConfig = {
  /** 是否为线上云函数环境 */
  isOnline: IS_ONLINE,
  /** 腾讯云开发｜环境ID */
  tcbEnv: env?.TCB_ENVID || '',
  /** 腾讯云开发｜编程访问ID */
  secretId: localEnv.secretId,
  /** 腾讯云开发｜编程访问KEY */
  secretKey: localEnv.secretKey,
}
