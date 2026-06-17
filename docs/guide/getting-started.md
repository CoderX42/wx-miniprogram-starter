# 快速开始

本指南帮助你在 5 分钟内从零跑起一个 `wx-miniprogram-starter` 派生的项目。

## 前置条件

- Node.js 18+
- 微信开发者工具（最新稳定版）
- （可选）HBuilderX（仅 uni-app 模板需要）

## 方式一：复制模板

最直接的方式是把模板目录复制一份，改 appid 后开始写业务：

```bash
# 1. 克隆骨架仓库
git clone <your-repo-url> wx-miniprogram-starter
cd wx-miniprogram-starter

# 2. 选择模板
# 原生小程序：
cp -r templates/mp-native ../my-app
# uni-app：
cp -r templates/mp-uniapp ../my-app

# 3. 安装依赖
cd ../my-app
npm install
```

原生模板用微信开发者工具打开 `my-app/` 即可运行。
uni-app 模板用 HBuilderX 打开 `my-app/`，或运行 `npm run dev:mp` 启动命令行构建。

## 方式二：在 workspace 中开发

骨架自身是 npm workspaces 结构，你可以把两个模板作为独立工作区开发：

```bash
# 根目录
cd wx-miniprogram-starter
npm install
```

此时 `packages/core` 会被链接到两个模板的 `node_modules/@wx-starter/core`，修改 core 源码会立即反映到两个模板中。

## 第一个请求

以原生模板为例，调用一个接口：

```javascript
// pages/index/index.js
import CustomPage from '../custom-page';

CustomPage({
  data: {
    userInfo: null,
  },
  async onLoad() {
    const res = await this.api.user.info();
    this.setData({ userInfo: res.data });
  },
});
```

`this.api` 来自 `behaviors/plugin.js` 的自动注入，背后是 `core/HttpClient` 的实例。

## 下一步

- [架构总览](/guide/architecture) — 理解分层
- [核心概念](/guide/core-concepts) — EventEmitter、HttpClient、Auth、Storage
- [开发约定](/guide/conventions) — 命名、目录、代码规范
- [Core API 文档](/core/overview) — 详细的 API 参考
