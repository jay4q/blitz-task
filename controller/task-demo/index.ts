import { getDatabase } from 'utils/cloudbase'

export const main = async (event?: any, context?: any) => {
  console.log('<====== 云函数入参 =====>')
  console.log(event)
  console.log('<=====================>')

  // 开启事务
  const manager = await getDatabase().startTransaction()

  try {
    await manager.commit()

    // 记录结果
    return {
      code: 200,
      message: '消息处理完毕',
    }
  } catch (e) {
    console.warn(e)
    await manager.rollback(-100)
    // 记录结果
    return {
      code: 400,
      message: '消息处理失败',
    }
  }
}
