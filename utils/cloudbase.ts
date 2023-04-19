import { CloudBase, Database, ICloudBaseConfig, init } from '@cloudbase/node-sdk'
import { constConfig } from './config'

let _app: CloudBase
let _db: Database.Db

/** 获取云开发应用实例 */
export const getCloudApp = () => {
  if (!_app) {
    let config: ICloudBaseConfig = { env: constConfig.tcbEnv }

    if (!constConfig.isOnline) {
      config = {
        ...config,
        secretId: constConfig.secretId,
        secretKey: constConfig.secretKey,
      }
    }

    _app = init(config)
  }

  return _app
}

/** 获取云开发数据库实例 */
export const getDatabase = () => {
  if (!_db) {
    const app = getCloudApp()
    _db = app.database()
  }

  return _db
}
