import dayjs from 'dayjs'

export const isArrayEmpty = (arr?: any[]) => !Array.isArray(arr) || arr.length === 0

export const sysTime = {
  createdAt: () => {
    const createTime = dayjs().unix()
    return {
      deleted_at: 0,
      created_at: createTime,
      updated_at: createTime,
    }
  },
  updatedAt: () => {
    return {
      updated_at: dayjs().unix(),
    }
  },
  deletedAt: () => {
    const deleteTime = dayjs().unix()
    return {
      deleted_at: deleteTime,
      updated_at: deleteTime,
    }
  },
}
