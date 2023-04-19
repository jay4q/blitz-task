import { getDeployFunctionName } from './util.mjs'
import { chalk } from 'zx'

const funcName = await getDeployFunctionName()

if (!!funcName) {
  await $`export NODE_ENV=development && ts-node --require tsconfig-paths/register ./controller/${funcName}/dev.ts`
} else {
  console.log(chalk.red(`🤔️🤔️🤔️ 请输入需要调试的云函数名，应当以 task 开头`))
}
