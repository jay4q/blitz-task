# 腾讯云开发｜云函数｜模板

为腾讯云开发提供工程化的定时任务/触发器/回调等非前端调用云函数模板，支持以下特性：

1. 💅 使用 typescript 进行开发
2. 😊 支持本地连接云开发环境调试
3. 🚀 一行命令，即可将指定云函数部署至指定的云开发环境

若需要服务于前端的云函数模板，可以参考[blitz-func](https://github.com/jay4q/blitz-func)，

## 🤔️ 开发要求

- 每个云函数对应 `controller/` 根目录下的一个子文件
- 每个云函数文件夹，至少有 3 个文件（🉑️以 `controller/task-demo` 为例）：
  - `index.ts`：云函数入口。保证函数格式为 `export const main = async (event, context) => {}`
  - `dev.ts`：本地测试云函数（不会部署至线上环境）
  - `cloudbaserc.json`：云函数的配置。复制 `cloudbaserc.example.json` 为 `cloudbaserc.json` 并将 `{{DATA.X}}` 这类变量替换为所需的配置。其中，触发器名称和云函数名称保持一致即可
- 复制 `.env.example` 并配置 `.env.dev` 或 `.env.prod`，分别对应研线用和产线用环境变量

## 💻 开始开发

- 确保：复制 `.env.example` 为 `.env.dev` 或 `.env.prod` 并配置好必填的环境变量
- 执行 `yarn dev` 即可本地调试函数

## ⏰ 注意事项

- 云函数目前只支持**单个部署**，暂不支持批量部署

## 🚀 部署

- 确保：已安装 [cloudbase/cli](https://docs.cloudbase.net/cli-v1/install) 并已登录对应的云开发环境
- 确保：复制 `.env.deploy.example` 为 `.env.deploy` 并配置好必填的环境变量
- 确保：复制 `.env.example` 为 `.env.dev` 或 `.env.prod` 并配置好所需的环境变量
- 确保：已为对应云函数配置好 `cloudbaserc.json` 文件
- 执行 `yarn deploy` 选择需要部署的云函数以及对应的环境变量，即可将云函数部署至腾讯云开发

## 📚 参考文档

- [zx](https://github.com/google/zx)
- [ncc](https://github.com/vercel/ncc)
- [ts-node](https://github.com/TypeStrong/ts-node)
- [触发器规则](https://docs.cloudbase.net/cli-v1/functions/trigger)

## 📝 Todo

- [ ] feat: 🚀 封装一批常用的云开发数据库操作
