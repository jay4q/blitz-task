import { deployDir, deployFunctionDir, projectDir } from './constants.mjs'
import { ensureCloudbaserc, getDeployEnv, getDeployEnvSuffix, getDeployFunctionName, getEnv, tcbLogin } from './utils.mjs'
import { chalk } from 'zx'

const { secretId, secretKey } = getDeployEnv(projectDir)

const funcName = await getDeployFunctionName()
const envName = await getDeployEnvSuffix()
const { TCB_ENVID } = await getEnv(envName)

console.log(chalk.green(`💅💅💅 准备部署云函数 【${funcName}】【${envName}】【${TCB_ENVID}】`))
await $`rm -rf ${deployDir}`
await $`ncc build ./controller/${funcName}/index.ts --minify --source-map --out ${deployFunctionDir}/${funcName}`

await ensureCloudbaserc(funcName)

await $`cp .env.${envName} ${deployDir}/.env`
await $`cp .env.${envName} ${deployFunctionDir}/${funcName}/.env` // ! 云函数也要环境变量，否则会使用默认环境
console.log(chalk.green('🎉🎉🎉 成功编译代码'))

await tcbLogin(secretId, secretKey)

await $`cd ${deployDir} && tcb fn deploy --mode prod ${funcName} --force`
console.log(chalk.green('🎉🎉🎉 成功部署云函数'))
