# 原生模板总览

`templates/mp-native` 是基于 WXML/JS 的原生小程序模板，依赖 Vant Weapp。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | 微信原生（glass-easel 渲染层） |
| 样式 | 微信原生 WXSS + style v2 |
| 基础库 | 3.10.1+ |
| UI 库 | [Vant Weapp](https://vant.pro/vant-weapp/) 1.11.7（peer 依赖） |
| 计算属性 | [miniprogram-computed](https://github.com/wechat-miniprogram/computed) |
| 核心库 | `@wx-starter/core` |

## 目录结构

```
mp-native/
├── miniprogram/
│   ├── app.js                       # 应用入口
│   ├── app.json                     # pages, window, tabBar
│   ├── app.wxss                     # @import tokens + fonts
│   ├── pages-base.js                # createPage() 页面基类
│   ├── component-base.js            # createComponent() 组件基类
│   ├── pages/                       # 业务页面
│   │   ├── index/
│   │   ├── demo-api/
│   │   ├── demo-components/
│   │   └── demo-form/
│   ├── components/                  # 6 个核心组件
│   │   ├── page-title/
│   │   ├── safe-area/
│   │   ├── empty/
│   │   ├── loading/
│   │   ├── error-block/
│   │   └── popup/
│   ├── behaviors/                   # 3 个核心 behavior
│   │   ├── plugin.js
│   │   ├── safearea.js
│   │   └── form.js
│   ├── utils/                       # 工具（消费 core）
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── env.js
│   │   └── http.js
│   └── styles/
│       ├── tokens.wxss
│       ├── fonts.wxss
│       └── animations.wxss
├── config/                          # 环境配置
│   ├── dev.js
│   ├── trial.js
│   └── prod.js
├── scripts/                         # 构建脚本
│   ├── new-page.js
│   ├── new-component.js
│   ├── cdn-image.js
│   ├── iconfont-sync.js
│   └── deploy.sh
├── project.config.json              # 微信开发者工具配置
├── package.json
└── README.md
```

## 快速开始

```bash
# 1. 安装依赖
cd templates/mp-native
npm install

# 2. 修改 project.config.json 中的 appid

# 3. 微信开发者工具打开本目录
# （设置 miniprogramRoot: "miniprogram"）
```

## 核心特性

### 页面基类（pages-base.js）

所有页面通过 `createPage()` 而非 `Page()` 创建：

```javascript
import createPage from '../pages-base';

createPage({
  data: {
    list: [],
  },
  onLoad() {
    this.fetchList();
  },
  async fetchList() {
    const res = await this.api.order.list();
    this.setData({ list: res.data });
  },
});
```

**自动注入**：

- `this.api` — API 端点（来自 `behaviors/plugin`）
- `this.emitter` — 事件总线
- `this.event` — 事件常量
- `this.menuInfo` / `windowInfo` / `safeTop` — 安全区（来自 `behaviors/safearea`）
- 分享方法（`onShareAppMessage` / `onShareTimeline`）
- PV 统计（`onShow` 触发，可关闭）

**选项**：

```javascript
createPage({
  useForm: true,      // 注入 formMixin（inputChange / pickerChange / uploadFile）
  useSafearea: true,  // 注入 safeareaMixin（默认 true）
  ignoreCount: true,  // 关闭 PV 统计
  // ...
});
```

### 组件基类（component-base.js）

所有组件通过 `createComponent()` 创建：

```javascript
import createComponent from '../component-base';

createComponent({
  properties: {
    title: String,
  },
  data: {},
  methods: {},
});
```

### 6 个核心组件

通过 `app.json` 中 `usingComponents` 全局注册：

```json
{
  "usingComponents": {
    "page-title": "/components/page-title/page-title",
    "safe-area": "/components/safe-area/safe-area",
    "empty": "/components/empty/empty",
    "loading": "/components/loading/loading",
    "error-block": "/components/error-block/error-block",
    "popup": "/components/popup/popup"
  }
}
```

WXML 中直接使用：

```html
<page-title title="用户主页" back="true" />
<safe-area>
  <empty text="暂无数据" wx:if="{{!loading && list.length === 0}}" />
</safe-area>
```

详见 [核心组件](/native/components)。

### 3 个核心 behavior

详见 [Behaviors](/native/behaviors)。

## 业务编写流程

### 1. 创建新页面

```bash
node scripts/new-page.js user-profile
# 自动创建 miniprogram/pages/user-profile/{user-profile.js,json,wxml,wxss}
```

修改 `src/pages.json` 注册：

```json
{
  "pages": [
    "pages/index/index",
    "pages/user-profile/user-profile"
  ]
}
```

### 2. 编写页面逻辑

```javascript
// pages/user-profile/user-profile.js
import createPage from '../pages-base';

createPage({
  useForm: true,
  data: {
    profile: null,
  },
  async onLoad(query) {
    const res = await this.api.user.detail(query.id);
    this.setData({ profile: res.data });
  },
});
```

### 3. 编写 API

```javascript
// utils/api.js
import http from './http';

export const user = {
  detail: (id) => http.get(`/user/${id}`),
  update: (data) => http.post('/user/update', data),
};
```

## 下一步

- [Behaviors](/native/behaviors) — 核心能力注入
- [核心组件](/native/components) — 6 个通用组件
- [环境配置](/native/environment) — dev/trial/prod 切换
- [构建脚本](/native/scripts) — CDN、iconfont、部署
