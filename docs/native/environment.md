# 环境配置

原生模板支持 dev / trial / prod 三套环境，自动根据微信开发者工具的编译版本切换。

## 目录结构

```
miniprogram/
└── config/
    ├── dev.js       # 开发版
    ├── trial.js     # 体验版
    ├── prod.js      # 正式版
    └── index.js     # 自动选择
```

## config/{dev,trial,prod}.js

每个文件导出一个配置对象：

```javascript
// config/dev.js
export default {
  env: 'dev',
  apiBase: 'https://api-dev.example.com',
  cdnBase: 'https://cdn-dev.example.com',
  debug: true,
};
```

```javascript
// config/trial.js
export default {
  env: 'trial',
  apiBase: 'https://api-trial.example.com',
  cdnBase: 'https://cdn-trial.example.com',
  debug: true,
};
```

```javascript
// config/prod.js
export default {
  env: 'prod',
  apiBase: 'https://api.example.com',
  cdnBase: 'https://cdn.example.com',
  debug: false,
};
```

## config/index.js

根据 `envVersion` 自动选择：

```javascript
// config/index.js
import { isDev, isTrial } from '@wx-starter/core';
import dev from './dev';
import trial from './trial';
import prod from './prod';

let cached = null;

function load() {
  if (cached) return cached;
  if (isDev()) cached = dev;
  else if (isTrial()) cached = trial;
  else cached = prod;
  return cached;
}

export default load();
```

## 在代码中使用

```javascript
// utils/api.js
import config from '../config';

export const apiBase = config.apiBase;
export const cdnBase = config.cdnBase;
```

```javascript
// utils/http.js
import config from '../config';
import { createHttpClient, createAdapter } from '@wx-starter/core';
import wx from '../env';

const http = createHttpClient({
  baseURL: config.apiBase,
  adapter: createAdapter(wx.request),
});
```

## envVersion 检测

`@wx-starter/core` 的 `isDev()` / `isTrial()` / `isRelease()` 通过 `wx.getAccountInfoSync()` 判断：

```javascript
// app.js
import { configureEnv, isDev } from '@wx-starter/core';

App({
  onLaunch() {
    configureEnv({
      getAccountInfoSync: () => wx.getAccountInfoSync(),
      platform: () => wx.getSystemInfoSync().platform,
    });

    if (isDev()) {
      console.log('开发环境');
    }
  },
});
```

## 微信开发者工具的环境

微信开发者工具中：

- **开发版** — 编译后预览
- **体验版** — 上传后扫码体验
- **正式版** — 提交审核后发布

`wx.getAccountInfoSync().miniProgram.envVersion` 返回 `'develop' / 'trial' / 'release'`。

## 调试开关

每个环境的 `debug` 字段可用于：

```javascript
// app.js
import config from './config';

App({
  onLaunch() {
    if (config.debug) {
      // 开启调试
      wx.setEnableDebug({ enableDebug: true });
      // 显示 vConsole
      // ...
    }
  },
});
```

## 多后端

如果项目有多个后端服务（如商家端、用户端、管理端），可以在 config 中分别定义：

```javascript
// config/dev.js
export default {
  env: 'dev',
  userApi: 'https://user-api-dev.example.com',
  adminApi: 'https://admin-api-dev.example.com',
  cdnBase: 'https://cdn-dev.example.com',
};
```

```javascript
// utils/http.js
import config from '../config';
import { createHttpClient, createAdapter } from '@wx-starter/core';

export const userHttp = createHttpClient({
  baseURL: config.userApi,
  adapter: createAdapter(wx.request),
});

export const adminHttp = createHttpClient({
  baseURL: config.adminApi,
  adapter: createAdapter(wx.request),
});
```

## project.config.json

微信开发者工具的项目配置：

```json
{
  "miniprogramRoot": "miniprogram/",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "compileHotReLoad": true,
    "useCompilerModule": true
  },
  "libVersion": "3.10.1",
  "appid": "your-appid-here",
  "projectname": "my-app"
}
```

| 字段 | 说明 |
|------|------|
| `miniprogramRoot` | 小程序源码根目录 |
| `setting.es6` | 启用 ES6 → ES5 转译 |
| `setting.enhance` | 启用增强编译（async/await 支持） |
| `setting.compileHotReLoad` | 热重载 |
| `libVersion` | 基础库最低版本 |
| `appid` | 小程序 appid（**不要提交到 git**，用 `project.private.config.json`） |

## project.private.config.json

本地私有配置（每个开发者不同）：

```json
{
  "appid": "wx1234567890abcdef",
  "projectname": "my-app-local"
}
```

`.gitignore` 应包含此文件。

## 下一步

- [构建脚本](/native/scripts) — CDN、iconfont、部署
- [核心库 HTTP](/core/http) — 多环境 baseURL 配置
