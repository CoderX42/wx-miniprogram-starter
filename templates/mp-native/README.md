# mp-native-template

原生小程序模板 — 基于 WXML/JS，依赖 Vant Weapp。

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 修改 project.config.json 中的 appid

# 3. 用微信开发者工具打开本目录，"工具" → "构建 npm"

# 4. 编译并预览
```

## 目录结构

```
mp-native/
├── miniprogram/
│   ├── app.js                  # 应用入口
│   ├── app.json                # 路由与全局配置
│   ├── app.wxss                # 全局样式（import tokens + fonts + animations）
│   ├── sitemap.json
│   ├── pages/                  # 业务页面
│   │   ├── index/
│   │   ├── demo-api/
│   │   ├── demo-components/
│   │   └── demo-form/
│   ├── components/             # 自研核心组件
│   │   ├── page-title/         # 顶部标题栏
│   │   ├── safe-area/          # 安全区容器
│   │   ├── empty/              # 空态
│   │   ├── loading/            # 加载
│   │   ├── error-block/        # 网络错误
│   │   └── popup/              # 弹窗（5 个方向）
│   ├── behaviors/              # 横切关注点
│   │   ├── plugin.js           # 注入 api/emitter/event + call/jump/back/...
│   │   ├── safearea.js
│   │   └── form.js             # input/picker/upload/delete
│   ├── pages-base.js           # createPage() 页面基类
│   ├── component-base.js       # createComponent() 组件基类
│   ├── utils/
│   │   ├── http.js             # HttpClient 实例化
│   │   ├── api.js              # API 端点定义
│   │   ├── auth.js             # 登录态（继承 core/Auth）
│   │   └── env.js              # 环境判断
│   └── styles/
│       ├── tokens.wxss         # 设计令牌
│       ├── fonts.wxss          # 4 字体
│       └── animations.wxss     # keyframes
├── config/
│   ├── dev.js                  # 开发环境
│   ├── trial.js                # 体验版
│   └── prod.js                 # 正式版
├── scripts/
│   ├── cdn-image.js            # 多倍图处理
│   ├── iconfont-sync.js        # iconfont 同步
│   ├── deploy.sh               # CDN 部署
│   ├── new-page.js             # 创建页面
│   └── new-component.js        # 创建组件
├── project.config.json
├── package.json
└── README.md
```

## 核心特性

### 页面基类

```javascript
const createPage = require('../../pages-base');

createPage({
  // 自动注入 pluginBehavior + computed
  useForm: true,    // 启用 form behavior
  useSafearea: true, // 启用 safearea behavior
  data: {},
  onLoad() {},
});
```

### 组件基类

```javascript
const createComponent = require('../../component-base');

createComponent({
  useSafearea: true,
  properties: {},
  data: {},
  methods: {},
});
```

### 6 个核心组件

| 组件 | 用途 | Props |
|------|------|-------|
| `page-title` | 顶部标题栏 | `title`, `back`, `background`, `color` |
| `safe-area` | 安全区容器 | `top`, `bottom`, `bg` |
| `empty` | 空态 | `text`, `image`, `buttonText` |
| `loading` | 加载 | `text`, `type: 'inline'\|'page'` |
| `error-block` | 网络错误 | `text`, `buttonText`, `showButton` |
| `popup` | 弹窗 | `show`, `position`, `mask`, `maskClose`, `zIndex` |

### HTTP 客户端

```javascript
// utils/http.js 已自动注入 token 和响应拦截器
// 直接使用
const data = await this.api.user.info();
```

### Behaviors

- `plugin`（自动注入）：`this.api` / `this.emitter` / `this.event` + `call/jump/back/showPreview/download/setClipboard/toast`
- `form`：`inputChange` / `pickerChange` / `uploadFile` / `uploadSuccess` / `deleteFile`
- `safearea`：`menuInfo` / `windowInfo` / `safeTop`

## 开发流程

### 创建新页面

```bash
node scripts/new-page.js user-profile --with-form
```

### 创建新组件

```bash
node scripts/new-component.js my-button --use-safearea
```

### 同步 iconfont

1. 在 https://www.iconfont.cn/ 下载 iconfont.css / iconfont.woff 等
2. 放到 `miniprogram/iconfont/`
3. 运行 `npm run iconfont`

### 处理多倍图

```bash
# 把图片放到 images/ 目录，命名格式：name@1x.png, name@2x.png, ...
npm run cdn-image
# 自动生成 miniprogram/cdn.js
```

## License

MIT
