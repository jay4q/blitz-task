import { homedir } from 'os'
import { resolve } from 'path'

const tcbAuthPath = resolve(homedir(), '.config/.cloudbase/auth.json')

const projectDir = resolve(__dirname, '../')
const controllerDir = resolve(projectDir, 'controller')
const deployDir = resolve(projectDir, 'dist')
const deployFunctionDir = resolve(deployDir, 'functions')

export { tcbAuthPath, projectDir, controllerDir, deployDir, deployFunctionDir }
