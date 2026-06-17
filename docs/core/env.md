# Env 环境判断

`@wx-starter/core` 提供环境判断工具，包括运行平台、版本、调试模式等。

## 设计目标

- **跨平台** — 同一份代码在 `wx` 和 `uni` 下运行
- **统一 API** — 不直接用 `__DEV__` / `process.env.NODE_ENV` 等散落的全局
- **可配置** — 模板可以覆盖默认检测逻辑

## 快速开始

```javascript
import { isDev, isTrial, isRelease, isWeixin, isUni, configureEnv } from '@wx-starter/core';

if (isDev()) {
  console.log('开发环境');
}

if (isWeixin()) {
  console.log('运行在微信中');
}
```

## API

### 环境配置

#### `configureEnv(options)`

在 App 启动时配置环境检测函数：

```javascript
// app.js
import { configureEnv } from '@wx-starter/core';

configureEnv({
  getAccountInfoSync: () => wx.getAccountInfoSync(),
  platform: () => wx.getSystemInfoSync().platform,
});
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `getAccountInfoSync` | function | 返回 `{ miniProgram: { envVersion } }` |
| `platform` | function | 返回 `'devtools' / 'ios' / 'android' / ...` |

### 运行时判断

#### `isDev()`

开发版（`envVersion === 'develop'`）：

```javascript
if (isDev()) {
  // 显示调试工具
  // 注入模拟用户
}
```

#### `isTrial()`

体验版（`envVersion === 'trial'`）。

#### `isRelease()`

正式版（`envVersion === 'release'`）。

#### `isTest()`

开发版 + 体验版：

```javascript
if (isTest()) {
  // 测试环境行为
}
```

### 平台判断

#### `isWeixin()`

是否运行在微信中（`wx` 全局存在）。

#### `isUni()`

是否运行在 uni-app 中（`uni` 全局存在）。

#### `isH5()`

是否运行在 h5（浏览器）。

### 平台检测

#### `detectRequest()`

自动检测平台请求函数：

```javascript
import { detectRequest, createAdapter } from '@wx-starter/core';

const adapter = createAdapter(detectRequest());
// wx.request / uni.request
```

#### `detectStorage()`

自动检测平台存储（一般不直接调用，`createStorage` 内部使用）。

## 配置流程

原生模板中，`app.js` 的 `onLaunch` 调用 `configureEnv`：

```javascript
// app.js
import { configureEnv } from '@wx-starter/core';

App({
  onLaunch() {
    configureEnv({
      getAccountInfoSync: () => wx.getAccountInfoSync(),
      platform: () => wx.getSystemInfoSync().platform,
    });

    // 之后的 isDev / isTrial / isRelease 才有效
  },
});
```

uni-app 模板中，`main.js` 调用：

```javascript
// main.js
import { configureEnv } from '@wx-starter/core';

configureEnv({
  getAccountInfoSync: () => uni.getAccountInfoSync(),
  platform: () => uni.getSystemInfoSync().platform,
});
```

## 完整示例

```javascript
// app.js
import { configureEnv, isDev, isTest } from '@wx-starter/core';
import auth from './utils/auth';
import { apiBase } from './utils/env';

App({
  onLaunch() {
    configureEnv({
      getAccountInfoSync: () => wx.getAccountInfoSync(),
      platform: () => wx.getSystemInfoSync().platform,
    });

    if (isDev()) {
      auth.setToken('fake-token');
      auth.setUserInfo({ name: 'Dev User' });
    }
  },
});
```

```javascript
// utils/api.js
import { isTest } from '@wx-starter/core';

export const apiBase = isTest()
  ? 'https://api-test.example.com'
  : 'https://api.example.com';
```

## 测试

```javascript
// __tests__/env.test.js
import { configureEnv, isDev, isTrial, isRelease } from '@wx-starter/core';

test('env 判断', () => {
  configureEnv({
    getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
  });
  expect(isDev()).toBe(true);
  expect(isTrial()).toBe(false);
  expect(isRelease()).toBe(false);
});
```

## 下一步

- [HTTP 客户端](/core/http) — `detectRequest()` 自动选平台
- [Storage 存储](/core/storage) — 自动选 wx / uni
- [Auth 鉴权](/core/auth) — 配合 `isDev()` 注入 mock 用户
