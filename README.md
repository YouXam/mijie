# Mijie

Mijie 是一个网络解谜游戏网站，提供了非常多样的游戏形式，解谜爱好者可以使用 Mijie 举办丰富多彩的解谜游戏。

支持流程图、排行榜、公告、提交记录等多种功能。

> 本项目最初是为了在 2023 年北京邮电大学百团大战中举办的解谜游戏“哈士奇再现”而开发的。在那之后，2024 年百团大战的解谜游戏 “哈士奇的复仇”、哈士奇壬寅年解谜游戏和癸卯年解谜游戏也使用了 Mijie。

## 预览

基础的提交答案类题目：

![basic](./images/problem_1.png)

也可以使用 Vue.js 来编写题面：

![captcha](./images/problem_2.png)

## 部署

1. Clone 本项目
2. 安装 [Bun](https://bun.sh/), [Node.js](https://nodejs.org)
3. 安装后端依赖
    ```bash
    bun install
    ```
4. 安装前端依赖
    ```bash
    cd frontend && pnpm install
    ```
5. 修改前端配置文件 `frontend/src/constants.js`
6. 构建前端
    ```bash
    pnpm run build
    ```
7. 创建 `.env` 文件，填入环境变量，见[环境变量](#环境变量)
8. 启动
    ```bash
    bun start
    ```
9. 访问 `http://localhost:3000`

### 环境变量

1. `MONGODB_URI`：MongoDB 连接 URL
2. `JWT_SECRET`：JWT 密钥
3. `PORT`：监听端口
4. `GLOT_IO_API_KEY`：Glot.io API 密钥
5. `ABLY_ADMIN_KEY`：Ably Admin 密钥。若为空，则无法显示公告提醒、自动刷新排行榜
6. `ABLY_PUBLIC_KEY`：Ably Public 密钥
7. `CLOUDFLARE_API_KEYS`：Cloudflare API 密钥，用于调用 Cloudflare AI
8. `ZHIPU_API_KEY`：智谱 API 密钥，用于调用智谱 AI。当 `CLOUDFLARE_API_KEYS` 不为空时，此项无效，会优先使用 Cloudflare AI
9. `TURNSTILE_KEY`：Turnstile Key
10. `TURNSTILE_SECRET`：Turnstile Secret。若为空，则不启用 Turnstile