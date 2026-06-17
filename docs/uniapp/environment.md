# 环境配置

uni-app 模板支持 dev / trial / prod 三套环境，与原生模板对齐。

## 目录结构

```
mp-uniapp/
└── config/
    ├── dev.js       # 开发版
    ├── trial.js     # 体验版
    ├── prod.js      # 正式版
    └── index.js     # 自动选择
```

## config/{dev,trial,prod}.js

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
// utils/http.js
import config from '@/config';
import { createHttpClient, createAdapter } from '@wx-starter/core';

const http = createHttpClient({
  baseURL: config.apiBase,
  adapter: createAdapter(uni.request),
});

export default http;
```

## 配置 env 检测

`main.js` 中调用 `configureEnv`：

```javascript
// main.js
import { configureEnv } from '@wx-starter/core';

configureEnv({
  getAccountInfoSync: () => uni.getAccountInfoSync(),
  platform: () => uni.getSystemInfoSync().platform,
});
```

之后 `isDev()` / `isTrial()` / `isRelease()` 即可用。

## manifest.json

uni-app 的多端配置：

```json
{
  "name": "my-app",
  "appid": "",
  "description": "",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {},
    "distribute": {
      "android": {
        "permissions": []
      },
      "ios": {},
      "sdkConfigs": {}
    }
  },
  "quickapp": {},
  "mp-weixin": {
    "appid": "wx1234567890abcdef",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {}
  },
  "vueVersion": "3"
}
```

### 关键字段

| 字段 | 说明 |
|------|------|
| `vueVersion` | 必须为 `"3"`（使用 Vue 3） |
| `mp-weixin.appid` | 微信小程序 appid |
| `mp-weixin.setting.es6` | 启用 ES6 转译 |
| `mp-weixin.setting.postcss` | 启用 postcss |
| `transformPx` | 是否将 px 转 rpx（推荐 `false`，uni-app 自动处理） |

## pages.json

页面路由 + easycom 配置：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^page-title$": "@/components/page-title/page-title.vue",
      "^safe-area$": "@/components/safe-area/safe-area.vue",
      "^empty$": "@/components/empty/empty.vue",
      "^loading$": "@/components/loading/loading.vue",
      "^error-block$": "@/components/error-block/error-block.vue",
      "^popup$": "@/components/popup/popup.vue"
    }
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationStyle": "custom"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "My App",
    "navigationBarBackgroundColor": "#FFFFFF",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#1AAD19",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      }
    ]
  }
}
```

### easycom

`easycom` 自动注册组件，避免每次手动 import：

```json
{
  "easycom": {
    "autoscan": true,  // 自动扫描 components/ 目录
    "custom": {
      "^page-title$": "@/components/page-title/page-title.vue"  // 自定义规则
    }
  }
}
```

**自动扫描规则**（`autoscan: true` 时）：

- 目录：`src/components/`
- 命名：`<name>/<name>.vue`

所以 `src/components/empty/empty.vue` 自动注册为 `<empty />`。

### 页面样式

每个页面可以单独配置导航栏：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationStyle": "custom",  // 隐藏原生导航栏，使用 page-title
        "enablePullDownRefresh": true
      }
    }
  ]
}
```

## uni.scss

全局 SCSS 变量：

```scss
/* uni.scss */

/* 主色 */
$uni-color-primary: #1aad19;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;

/* 文字 */
$uni-text-color: #303133;
$uni-text-color-inverse: #fff;
$uni-text-color-grey: #909399;
$uni-text-color-placeholder: #c0c4cc;

/* 背景 */
$uni-bg-color: #ffffff;
$uni-bg-color-grey: #f8f8f8;

/* 边框 */
$uni-border-color: #ebebeb;

/* 字号 */
$uni-font-size-sm: 24rpx;
$uni-font-size-base: 28rpx;
$uni-font-size-lg: 32rpx;

/* 行高 */
$uni-line-height-sm: 36rpx;
$uni-line-height-base: 48rpx;
$uni-line-height-lg: 56rpx;

/* 间距 */
$_s8: 8rpx;
$_s16: 16rpx;
$_s24: 24rpx;
$_s32: 32rpx;
```

## HBuilderX 运行配置

在 HBuilderX 中：

1. 工具栏 → 运行 → 运行到小程序模拟器 → 微信开发者工具
2. 第一次运行会提示填写 appid（在 `manifest.json` 中）
3. 修改代码后会自动热重载

## 命令行运行

```bash
# 安装 @dcloudio/uvm（uni-app 版本管理）
npm install -g @dcloudio/uvm

# 编译开发版（微信小程序）
npm run dev:mp-weixin

# 编译生产版
npm run build:mp-weixin
```

输出在 `dist/dev/mp-weixin/` 或 `dist/build/mp-weixin/`，用微信开发者工具打开。

## 下一步

- [核心组件](/uniapp/components) — 6 个 Vue 组件
- [Mixins](/uniapp/mixins) — Vue mixin
- [构建脚本](/uniapp/scripts) — 脚手架生成
