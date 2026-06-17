# wx-miniprogram-starter

通用微信小程序项目骨架。从零架构，业务无关，跨技术栈（原生 + uni-app）共用 core 库。

## 特性

- 🚀 **core 库** — 跨技术栈纯 JS：`HttpClient`（拦截器风格）、`Storage`（命名空间）、`Auth`（登录态）、`EventEmitter`、`Router`、`Formatter`、`Validator`
- 📱 **原生小程序模板** — 基于 WXML/JS，依赖 Vant Weapp
- 🎨 **uni-app 模板** — Vue 3 + Pinia + wot-design-uni
- 🧩 **6 个核心组件** — `page-title`、`safe-area`、`empty`、`loading`、`error-block`、`popup`（两套实现）
- 🎨 **设计令牌** — CSS 变量（颜色 / 字号 / 间距 / 圆角）+ 4 字体系统（PFM/PFR/PFS/PFL）
- 🔧 **工具链** — 多倍图 CDN 处理、iconfont 同步、部署脚本、页面/组件生成器
- 📚 **VitePress 文档站** — 架构、API、迁移指南、最佳实践

## 目录结构

```
wx-miniprogram-starter/
├── packages/
│   └── core/                # 跨技术栈纯 JS 库
├── templates/
│   ├── mp-native/           # 原生小程序模板
│   └── mp-uniapp/           # uni-app + Vue 3 模板
├── docs/                    # VitePress 文档站
└── .github/                 # GitHub Actions
```

## 快速开始

### 1. 克隆仓库

```bash
git clone <repo-url> wx-miniprogram-starter
cd wx-miniprogram-starter
npm install
```

### 2. 验证 core 库

```bash
npm run core:test
```

### 3. 启动文档站

```bash
npm run docs:dev
# 访问 http://localhost:5173
```

### 4. 使用模板创建新项目

#### 原生小程序

```bash
cp -r templates/mp-native my-new-app
cd my-new-app
# 修改 project.config.json 的 appid
# 修改 config/{dev,trial,prod}.js 的 API 端点
# 用微信开发者工具导入项目根目录
```

#### uni-app

```bash
cp -r templates/mp-uniapp my-new-app
cd my-new-app
npm install
# 用 HBuilderX 打开 src 目录
# 修改 manifest.json 的 appid
```

## 设计原则

- **不耦合业务** — 骨架不带任何业务词汇
- **不耦合 UI 库内部** — Vant/wot-design-uni 仅作为 peer 依赖
- **跨技术栈共用** — 同一份 `emitter/http/storage` 在两个模板下运行
- **约定优于配置** — 目录、命名、API 路径都遵循明确规则
- **零历史包袱** — 不从任何老项目抽离，逐字从零写

## 文档

完整文档见 [docs/](docs/)：

- [快速开始](docs/guide/getting-started.md)
- [架构总览](docs/guide/architecture.md)
- [核心概念](docs/guide/core-concepts.md)
- [代码规范](docs/guide/conventions.md)
- [Core API](docs/core/overview.md)
- [原生模板](docs/native/overview.md)
- [uni-app 模板](docs/uniapp/overview.md)
- [工具链](docs/tools/iconfont.md)

完整实现规划见 [PLAN.md](PLAN.md)。

## License

MIT
