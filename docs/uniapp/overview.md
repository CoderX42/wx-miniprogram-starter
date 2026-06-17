# uni-app 模板总览

`templates/mp-uniapp` 是基于 uni-app + Vue 3 的跨平台模板。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | uni-app（Vue 3） |
| 状态管理 | Pinia |
| UI 库 | [wot-design-uni](https://wot-design-uni.cn/)（peer 依赖） |
| 核心库 | `@wx-starter/core` |
| 构建 | HBuilderX 或 `@dcloudio/uvm` |

## 目录结构

```
mp-uniapp/
├── src/
│   ├── App.vue                     # 应用入口
│   ├── main.js                     # 创建 app 实例、注册 Pinia、全局 mixin
│   ├── manifest.json               # 多端配置
│   ├── pages.json                  # 路由 + easycom 自动注册
│   ├── uni.scss                    # 全局 SCSS 变量
│   ├── pages/
│   │   ├── index/
│   │   ├── demo-api/
│   │   ├── demo-components/
│   │   └── demo-form/
│   ├── components/                 # 6 个核心组件（Vue SFC）
│   │   ├── page-title/
│   │   ├── safe-area/
│   │   ├── empty/
│   │   ├── loading/
│   │   ├── error-block/
│   │   └── popup/
│   ├── mixins/                     # 替代 behaviors
│   │   ├── plugin.js               # 全局 mixin，注入 $api/$emitter/$event
│   │   ├── safearea.js
│   │   └── form.js
│   ├── utils/
│   │   ├── http.js                 # HttpClient 实例化
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── env.js
│   ├── store/                      # Pinia stores
│   │   ├── index.js
│   │   └── user.js                 # 示例 store
│   └── styles/
│       ├── tokens.scss
│       └── animations.scss
├── config/
│   ├── dev.js
│   ├── trial.js
│   └── prod.js
├── scripts/
│   ├── new-page.js
│   └── new-component.js
├── package.json
└── README.md
```

## 快速开始

### 方式一：HBuilderX（推荐）

1. 用 HBuilderX 打开 `templates/mp-uniapp/`
2. 修改 `src/manifest.json` 中的 `appid`
3. 工具栏选择「运行 → 运行到小程序模拟器 → 微信开发者工具」

### 方式二：命令行

```bash
# 1. 安装依赖
cd templates/mp-uniapp
npm install

# 2. 安装 uni-app CLI（如果未安装）
npm install -g @dcloudio/uvm

# 3. 编译运行
npm run dev:mp-weixin

# 输出在 dist/dev/mp-weixin/，用微信开发者工具打开
```

## 核心特性

### 全局 mixin（plugin.js）

`main.js` 注册全局 mixin，所有页面/组件自动获得：

- `this.$api` — API 端点
- `this.$emitter` — 事件总线
- `this.$event` — 事件常量
- `this.$call()` / `this.$back()` / `this.$preview()` / `this.$clipboard()` / `this.$toast()`

```vue
<script>
export default {
  methods: {
    onTap() {
      this.$api.user.info().then((res) => {
        console.log(res);
      });
    },
    onBack() {
      this.$back();
    },
  },
};
</script>
```

### 3 个 mixin

| Mixin | 注入 | 等价于原生 behaviors |
|-------|------|---------------------|
| `plugin` | `$api` / `$emitter` / `$event` + 通用方法 | `behaviors/plugin` |
| `safearea` | `menuInfo` / `windowInfo` / `safeTop` | `behaviors/safearea` |
| `form` | `onInput(field, e)` / `onPicker(field, rangeKey, e)` | `behaviors/form` |

详见 [Mixins](/uniapp/mixins)。

### 6 个核心组件

通过 `easycom` 自动注册（无需 import）：

```json
// pages.json
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
  }
}
```

```vue
<template>
  <page-title title="用户主页" :back="true" />
  <safe-area>
    <empty text="暂无数据" />
    <loading v-if="loading" type="page" />
    <error-block v-if="error" @retry="onRetry" />
    <popup :show="show" position="center" @close="show = false" />
  </safe-area>
</template>
```

详见 [核心组件](/uniapp/components)。

### Pinia 状态管理

```javascript
// store/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import auth from '@/utils/auth';

export const useUserStore = defineStore('user', () => {
  const token = ref(auth.getToken());
  const profile = ref(auth.getUserInfo());

  const isLoggedIn = computed(() => !!token.value);

  function setUser(t, p) {
    token.value = t;
    profile.value = p;
    auth.setToken(t);
    auth.setUserInfo(p);
  }

  function logout() {
    token.value = null;
    profile.value = null;
    auth.clear();
  }

  return { token, profile, isLoggedIn, setUser, logout };
});
```

```vue
<script setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
</script>

<template>
  <view>{{ userStore.profile.name }}</view>
</template>
```

### HTTP 客户端

与原生模板使用同一个 `@wx-starter/core` HttpClient，通过适配器接入 `uni.request`：

```javascript
// utils/http.js
import { createHttpClient, createAdapter } from '@wx-starter/core';
import config from '@/config';

const http = createHttpClient({
  baseURL: config.apiBase,
  adapter: createAdapter(uni.request),
});

export default http;
```

详见 [HTTP 客户端](/core/http)。

## 业务编写流程

### 1. 创建新页面

```bash
node scripts/new-page.js user-profile
# 自动创建 src/pages/user-profile/user-profile.vue
```

修改 `src/pages.json` 注册：

```json
{
  "pages": [
    { "path": "pages/index/index" },
    { "path": "pages/user-profile/user-profile" }
  ]
}
```

### 2. 编写页面

```vue
<!-- src/pages/user-profile/user-profile.vue -->
<template>
  <view class="container">
    <page-title title="用户主页" :back="true" />
    <safe-area>
      <view v-if="loading" class="loading">
        <loading type="page" />
      </view>
      <view v-else-if="!profile" class="empty">
        <empty text="用户不存在" />
      </view>
      <view v-else class="profile">
        <text>{{ profile.name }}</text>
      </view>
    </safe-area>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';

const profile = ref(null);
const loading = ref(true);

onLoad(async (query) => {
  const res = await api.user.detail(query.id);
  profile.value = res.data;
  loading.value = false;
});
</script>
```

### 3. 编写 API

```javascript
// utils/api.js
import http from './http';

export default {
  user: {
    detail: (id) => http.get(`/user/${id}`),
    update: (data) => http.post('/user/update', data),
  },
  order: {
    list: (params) => http.get('/order/list', { params }),
  },
};
```

## 下一步

- [Mixins](/uniapp/mixins) — 3 个核心 mixin
- [核心组件](/uniapp/components) — 6 个 Vue 组件
- [环境配置](/uniapp/environment) — dev/trial/prod 切换
- [构建脚本](/uniapp/scripts) — 脚手架生成
