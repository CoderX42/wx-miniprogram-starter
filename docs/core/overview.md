# Core 库总览

`@wx-starter/core` 是 wx-miniprogram-starter 的核心层，提供跨技术栈（原生小程序 + uni-app）的纯 JS 工具。

## 设计目标

- **零业务耦合** — 不写任何业务词汇
- **零 UI 库耦合** — 不 import Vant / wot-design-uni
- **零平台耦合** — 通过适配器抽象 `wx.request` / `uni.request`
- **可直接 import** — 原始 ESM 输出，小程序无需打包

## 模块清单

| 模块 | 路径 | 主要能力 |
|------|------|---------|
| [Emitter](/core/emitter) | `src/emitter.js` | 事件总线 `on/once/emit/off/all/least/batch` |
| [EventConstants](/core/event-constants) | `src/event-constants.js` | 通用事件名常量 |
| [HttpClient](/core/http) | `src/http/client.js` | 拦截器风格 HTTP 客户端 |
| [Adapter](/core/http#adapter) | `src/http/adapter.js` | 平台请求适配器 |
| [Auth](/core/auth) | `src/auth.js` | 登录态基类 |
| [Storage](/core/storage) | `src/storage.js` | 命名空间存储 |
| [Router](/core/router) | `src/router.js` | 路由辅助 |
| [Formatter](/core/formatter) | `src/formatter.js` | 日期/金额/数字格式化 |
| [Validator](/core/validator) | `src/validator.js` | 通用校验 |
| [Env](/core/env) | `src/env.js` | 环境判断 |

## 总入口

```javascript
// 默认导入
import core from '@wx-starter/core';
console.log(Object.keys(core));
// ['Emitter', 'emitter', 'BusEvent', 'createHttpClient', 'createAdapter',
//  'createStorage', 'Auth', 'createRouter', 'formatter', 'validator', 'env', 'version']

// 命名导入
import { createHttpClient, emitter, BusEvent } from '@wx-starter/core';
```

## 依赖关系

```
emitter ─────────────┐
                     │
http ───┐            │
        │            │
        ├─► emitter ◄┤
        │            │
auth ───┼─► storage  │
        │            │
        └────────────┤
                     │
router  ─────────────┤
                     │
formatter  (无依赖)    │
                     │
validator   (无依赖)   │
```

## 体积

原始 ESM 输出 + 单文件实现，无打包、无 tree-shaking 副作用。整库约 15KB（gzip 前），按需 import 后实际占用更低。

## 平台支持

| 平台 | Emitter | HttpClient | Storage | Auth | Router | Formatter/Validator |
|------|---------|------------|---------|------|--------|---------------------|
| 微信小程序 | ✅ | ✅ (wx.request) | ✅ (wx.storage) | ✅ | ✅ | ✅ |
| uni-app (mp) | ✅ | ✅ (uni.request) | ✅ (uni.storage) | ✅ | ✅ | ✅ |
| uni-app (h5) | ✅ | ✅ (uni.request) | ✅ (uni.storage) | ✅ | ⚠️ 部分 | ✅ |
| Node.js (测试) | ✅ | ✅ (mock adapter) | ✅ (mock driver) | ✅ | ⚠️ 部分 | ✅ |

## 测试

```bash
cd packages/core
npm test
```

核心模块均有 Jest 单测覆盖（emitter、storage、formatter、validator）。

## 下一步

按模块查看详细 API：

- [HTTP 客户端](/core/http) — 最常用
- [Auth 鉴权](/core/auth) — 登录相关
- [Emitter 事件总线](/core/emitter) — 跨组件通信
- [Storage 存储](/core/storage) — 本地持久化
- [Router 路由](/core/router) — 页面跳转
- [Formatter 格式化](/core/formatter) — 数据展示
- [Validator 校验](/core/validator) — 表单验证
- [事件常量](/core/event-constants) — 预定义事件名
