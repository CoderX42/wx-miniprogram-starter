# Changelog

所有对 wx-miniprogram-starter 的重要变更都会记录在此文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
此项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)（语义化版本规范）。

## [Unreleased]

## [0.1.0] - 2024-01-XX

### 新增

- **packages/core** — 跨技术栈纯 JS 库
  - `HttpClient` — 拦截器风格 HTTP 客户端（`useRequest` / `useResponse` / `useError`）
  - `Adapter` — 平台请求适配器（`createAdapter` / `detectRequest` / `createUploadAdapter` / `createDownloadAdapter`）
  - `Auth` — 登录态基类（token 管理 + `ensureLogin` 并发控制）
  - `Storage` — 命名空间存储（同步/异步双 API + 自动 JSON 序列化）
  - `Emitter` — 事件总线（`on/once/emit/off/all/least/batch/clear`）
  - `EventConstants` — 通用事件名常量（HTTP_*/AUTH_*/NETWORK_*/THEME_*/APP_*）
  - `Router` — 路由辅助（`navigateTo/redirectTo/switchTab/reLaunch/navigateBack` + 200ms 节流）
  - `Formatter` — 数据格式化（日期/金额/数字/相对时间/脱敏）
  - `Validator` — 数据校验（手机/邮箱/身份证/URL/范围 + 链式 API）
  - `Env` — 环境判断（`isDev/isTrial/isRelease/isTest/isWeixin/isUni`）
  - Jest 测试覆盖核心模块（emitter、storage、formatter、validator）

- **templates/mp-native** — 原生小程序模板
  - 页面基类 `createPage()` + 组件基类 `createComponent()`
  - 3 个核心 behavior：`plugin` / `safearea` / `form`
  - 6 个核心组件：`page-title` / `safe-area` / `empty` / `loading` / `error-block` / `popup`
  - 4 个 demo 页面：`index` / `demo-api` / `demo-components` / `demo-form`
  - `utils/`：HTTP 客户端、API 定义、Auth 继承、环境配置
  - `styles/`：设计令牌（CSS 变量）、字体（4 个 PingFang）、动画 keyframes
  - `config/`：dev/trial/prod 多环境
  - `scripts/`：`new-page.js` / `new-component.js` / `cdn-image.js` / `iconfont-sync.js` / `deploy.sh`
  - `project.config.json`（基础库 3.10.1+）

- **templates/mp-uniapp** — uni-app + Vue 3 模板
  - 全局 mixin + 3 个 mixin：`plugin` / `safearea` / `form`
  - 6 个 Vue 组件（easycom 自动注册）
  - 4 个 demo 页面
  - `utils/`：HTTP（uni.request 适配）、API、Auth
  - `store/`：Pinia 状态管理（user store 示例）
  - `styles/`：tokens.scss + animations.scss
  - `config/`：dev/trial/prod
  - `scripts/`：`new-page.js` / `new-component.js`
  - `manifest.json`（`vueVersion: "3"`）

- **docs/** — VitePress 文档站
  - 首页 + 5 篇指南（getting-started / architecture / core-concepts / conventions / implementation-plan）
  - 10 篇 Core API 文档（overview / http / auth / storage / emitter / router / formatter / validator / event-constants / env）
  - 5 篇原生模板文档（overview / behaviors / components / environment / scripts）
  - 5 篇 uni-app 模板文档（overview / mixins / components / environment / scripts）
  - 3 篇工具文档（iconfont / cdn-image / deploy）

- **CI/CD**
  - `.github/workflows/ci.yml` — lint + test + template validation
  - `.github/workflows/docs.yml` — VitePress build & deploy to GitHub Pages

### 设计原则

- 不耦合任何业务（无业务词汇）
- 不耦合任何 UI 库内部（Vant Weapp / wot-design-uni 仅作为 peer 依赖）
- 跨技术栈共用 core 库
- 约定优于配置
- 零历史包袱（不从任何老项目抽离，逐字从零写）

[Unreleased]: https://github.com/your-org/wx-miniprogram-starter/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/wx-miniprogram-starter/releases/tag/v0.1.0
