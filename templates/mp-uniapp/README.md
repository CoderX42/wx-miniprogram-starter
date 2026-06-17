# mp-uniapp-template

uni-app + Vue 3 模板 — 依赖 wot-design-uni + Pinia。

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 修改 src/manifest.json 中的 appid

# 3. 用 HBuilderX 打开本目录，或运行：
npm run dev:mp
```

## 目录结构

```
mp-uniapp/
├── src/
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 创建 app 实例、注册 Pinia、全局 mixin
│   ├── manifest.json           # 多端配置
│   ├── pages.json              # 路由 + easycom 自动注册
│   ├── uni.scss                # 全局 SCSS 变量
│   ├── pages/                  # 业务页面
│   │   ├── index/
│   │   ├── demo-api/
│   │   ├── demo-components/
│   │   └── demo-form/
│   ├── components/             # 6 个核心组件（Vue SFC）
│   │   ├── page-title/
│   │   ├── safe-area/
│   │   ├── empty/
│   │   ├── loading/
│   │   ├── error-block/
│   │   └── popup/
│   ├── mixins/                 # 替代 behaviors
│   │   ├── plugin.js           # 全局 mixin，注入 $api/$emitter/$event
│   │   ├── safearea.js
│   │   └── form.js
│   ├── utils/
│   │   ├── http.js             # HttpClient 实例化
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── env.js
│   ├── store/                  # Pinia stores
│   │   ├── index.js
│   │   └── user.js             # 用户状态示例
│   └── styles/
│       ├── tokens.scss
│       └── animations.scss
├── config/
│   ├── dev.js
│   ├── trial.js
│   ├── prod.js
│   └── index.js                # 环境自动选择
├── scripts/
│   ├── new-page.js
│   └── new-component.js
├── package.json
└── README.md
```

## 核心特性

### 全局 mixin（plugin.js）

自动注入到所有页面/组件：

- `this.$api` — API 端点对象
- `this.$emitter` — 事件总线
- `this.$event` — 事件常量
- `this.$call(e)` / `this.$back()` / `this.$preview(src)` / `this.$clipboard(text)` / `this.$toast(title)`

### 3 个 mixin

| Mixin | 注入 |
|-------|------|
| `plugin` | `$api` / `$emitter` / `$event` + 通用方法 |
| `safearea` | `menuInfo` / `windowInfo` / `safeTop` |
| `form` | `onInput(field, e)` / `onPicker(field, rangeKey, e)` |

### 6 个核心组件

通过 easycom 自动注册，直接使用：

```vue
<template>
  <page-title title="标题" :back="true" />
  <safe-area>
    <empty text="暂无数据" />
    <loading v-if="loading" type="page" />
    <error-block v-if="error" @retry="onRetry" />
    <popup :show="show" position="center" @close="show = false" />
  </safe-area>
</template>
```

### Pinia 状态管理

```javascript
import { useUserStore } from '@/store/user';

export default {
  computed: {
    user() {
      return useUserStore();
    },
  },
  methods: {
    login() {
      this.user.setUser('token-xxx', { name: 'foo' });
    },
  },
};
```

### HTTP 客户端

```javascript
const data = await this.$api.user.info();
```

## 开发流程

### 创建新页面

```bash
node scripts/new-page.js user-profile --with-form
```

### 创建新组件

```bash
node scripts/new-component.js my-button --use-safearea
```

## License

MIT
