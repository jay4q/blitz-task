import { projectDir, controllerDir, deployDir, tcbAuthPath } from './constants.mjs'
import { config } from 'dotenv'
import fsExtra from 'fs-extra'
import { resolve } from 'path'
import prompts from 'prompts'

const { readdir, writeJSON, pathExists, copyFile, readJSON } = fsExtra

/** 获取 .env.deploy 环境参数 */
function getDeployEnv() {
  const deployEnv = config({
    path: path.resolve(projectDir, '.env.deploy'),
  })?.parsed

  const { TCB_SECRET_ID, TCB_SECRET_KEY } = deployEnv || {}

  if (!TCB_SECRET_ID || !TCB_SECRET_KEY) {
    throw new Error(`请配置 .env.deploy 环境变量`)
  }

  return { secretId: TCB_SECRET_ID, secretKey: TCB_SECRET_KEY }
}

/**
 * 选择部署至哪个环境
 *
 * 研线（dev）or产线（prod）
 */
async function getDeployEnvSuffix() {
  const list = await readdir(projectDir)
  const envList = list
    .filter((v) => {
      return v.startsWith('.env.') && !v.includes('.example') && v !== '.env.deploy'
    })
    .map((v) => {
      return v.replace(/^\.env\./, '')
    })

  const questions = [
    {
      type: 'select',
      name: 'envName',
      message: '请选择部署环境',
      choices: envList.map((v) => {
        return { title: v, value: v }
      }),
    },
  ]

  const { envName } = await prompts(questions, {
    onCancel: () => {
      process.exit()
    },
  })

  return envName
}

/** 获取对应环境的环境变量 */
async function getEnv(suffix) {
  const env = config({
    path: path.resolve(projectDir, `.env.${suffix}`),
  })?.parsed

  if (!env?.TCB_ENVID) {
    throw new Error(`请配置 .env.${envName} 文件环境变量`)
  }

  return env
}

/** 获取要部署的云函数名 */
async function getDeployFunctionName() {
  const list = await readdir(controllerDir)

  const questions = [
    {
      type: 'select',
      name: 'funcName',
      message: '请选择需要部署的云函数名',
      choices: list.map((v) => {
        return { title: v, value: v }
      }),
    },
  ]

  const { funcName } = await prompts(questions, {
    onCancel: () => {
      process.exit()
    },
  })

  return funcName
}

/** 确保要部署的云函数目录下 cloudbaserc.json 文件存在 */
async function ensureCloudbaserc(funcName) {
  const cloudbasercSrcPath = resolve(controllerDir, funcName, 'cloudbaserc.json')
  const cloudbasercDistPath = resolve(deployDir, 'cloudbaserc.json')

  const isExists = await pathExists(cloudbasercSrcPath)

  if (isExists) {
    await copyFile(resolve(projectDir, `./controller/${funcName}/cloudbaserc.json`), cloudbasercDistPath)
  } else {
    console.log(chalk.redBright('自动生成 cloudbaserc.json'))

    await writeJSON(cloudbasercDistPath, {
      version: '2.0',
      envId: '{{env.TCB_ENVID}}',
      functionRoot: './functions',
      functions: [
        {
          name: funcName,
          timeout: 20,
          runtime: 'Nodejs12.16',
          installDependency: false,
          handler: 'index.main',
          memorySize: 256,
          envVariables: {
            TZ: 'Asia/Shanghai',
          },
        },
      ],
    })
  }
}

/** 登录腾讯云 */
async function tcbLogin(secretId, secretKey) {
  try {
    const { credential } = await readJSON(tcbAuthPath)

    if (credential.secretKey === secretKey && credential.secretId === secretId) {
      console.log('登录状态相同, 跳过登录')
      return
    }
  } catch (e) {}

  await $`tcb logout`
  await $`tcb login --apiKeyId ${secretId} --apiKey ${secretKey}`
  await $`tcb env list`
}

export { projectDir, getDeployEnv, getDeployEnvSuffix, getDeployFunctionName, ensureCloudbaserc, getEnv, tcbLogin }
