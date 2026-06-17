# 架构总览

## 分层

```
┌─────────────────────────────────────────────────┐
│  业务层（用户编写）                                │
│  pages/, components/, store/                    │
└──────────────────┬──────────────────────────────┘
                   │  this.api / useUserStore
┌──────────────────▼──────────────────────────────┐
│  模板层（复制后修改）                              │
│  behaviors/  mixins/                            │
│  pages-base.js  component-base.js               │
│  utils/api.js  utils/http.js                    │
└──────────────────┬──────────────────────────────┘
                   │  import
┌──────────────────▼──────────────────────────────┐
│  Core 层（不动）                                  │
│  @wx-starter/core                                  │
│  emitter, http, auth, storage, router,          │
│  formatter, validator, env, event-constants     │
└──────────────────┬──────────────────────────────┘
                   │ 适配
┌──────────────────▼──────────────────────────────┐
│  平台层                                          │
│  wx.request / uni.request / wx.getStorageSync  │
└─────────────────────────────────────────────────┘
```

## 三个核心原则

### 1. 业务层不直接依赖平台 API

页面/组件中**不**直接出现 `wx.request` / `uni.request`，而是通过 `this.api.xxx()` 或 `useXxxStore()` 访问。

这样同一份业务代码（理论上）可以跨技术栈运行（实际中模板的页面结构还是绑定了平台，但逻辑可以共享）。

### 2. Core 库不耦合任何 UI 库

Vant Weapp / wot-design-uni 仅作为 peer 依赖出现在模板的 `package.json` 中。

Core 库代码不 import 它们的组件，不调用它们的 API。

### 3. 模板层提供「甜语法」

模板在 core 之上包一层语法糖，让业务写起来更顺手：

| core | 模板层封装 | 业务写起来 |
|------|-----------|----------|
| `http.request()` | `behaviors/plugin` 注入 `this.api` | `this.api.user.info()` |
| `emitter.on('event', cb)` | 同上注入 `this.emitter` | `this.emitter.on(this.event.AUTH_EXPIRED, ...)` |
| `auth.ensureLogin()` | 同上注入 `this.$auth` | `this.$auth.ensureLogin()` |

## 模块依赖图

```
emitter ───┐
           │
event-constants ───┐
           │       │
           ▼       ▼
       http ◀──── auth
           │       │
           ▼       │
       storage ◀───┘
           │
           ▼
        router

formatter   validator
   (纯函数)   (纯函数)
```

- `http` 依赖 `emitter`（错误事件）
- `auth` 依赖 `storage`（token 持久化）
- `storage` 独立（命名空间 + sync/async）
- `router` 独立（路径解析 + 平台跳转）
- `formatter` / `validator` 无依赖（纯函数）

## 跨技术栈是如何做到的

`core/HttpClient` 不直接调用 `wx.request` 或 `uni.request`，而是通过**适配器**：

```javascript
// packages/core/src/http/adapter.js
export function createAdapter(request) {
  return (options) => new Promise((resolve, reject) => {
    request({ ...options, success: resolve, fail: reject });
  });
}
```

原生模板传入 `wx.request`，uni-app 模板传入 `uni.request`，业务层完全无感。

类似的，`storage` 通过检测全局 `wx` / `uni` 自动选择同步或异步 API。

## 目录约定

每个业务页面/组件按目录组织：

```
pages/
├── index/
│   ├── index.js        # 入口
│   ├── index.json      # 配置
│   ├── index.wxml      # 模板
│   └── index.wxss      # 样式
```

一个目录 = 一个完整模块，便于移动、删除、复用。

详见 [开发约定](/guide/conventions)。
