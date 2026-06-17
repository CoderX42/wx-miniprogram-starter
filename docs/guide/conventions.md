# 开发约定

本文档定义 wx-miniprogram-starter 派生项目的统一约定，目的是让多个项目看起来像一个人写的。

## 目录命名

- 全部小写
- 单词间用 `-` 分隔（kebab-case）
- 一个目录 = 一个完整模块（page 或 component）

```
pages/
├── user-profile/      # 用户主页
├── order-detail/      # 订单详情
└── demo-api/          # API 演示
```

## 文件命名

原生小程序（4 个文件）：

```
pages/user-profile/
├── user-profile.js    # 逻辑入口
├── user-profile.json  # 页面配置
├── user-profile.wxml  # 模板
└── user-profile.wxss  # 样式
```

uni-app（单文件）：

```
pages/user-profile/
└── user-profile.vue   # template + script + style 三段式
```

## JS 风格

- 模块系统：ES Modules（`import` / `export`）
- 变量：`const` > `let` > 不使用 `var`
- 字符串：单引号
- 缩进：2 空格
- 分号：不写（参考项目 `.prettierrc`）

## API 定义约定

`utils/api.js` 按业务模块组织：

```javascript
// utils/api.js
import { apiBase } from './env';

export const user = {
  info() {
    return { url: `${apiBase}/user/info`, method: 'GET' };
  },
  login(data) {
    return { url: `${apiBase}/user/login`, method: 'POST', data };
  },
};

export const order = {
  list(params) {
    return { url: `${apiBase}/order/list`, method: 'GET', params };
  },
  detail(id) {
    return { url: `${apiBase}/order/${id}`, method: 'GET' };
  },
};
```

页面中：

```javascript
const res = await this.api.user.info();
const list = await this.api.order.list({ status: 'paid' });
```

## 样式规范

### 颜色

**必须使用 CSS 变量**，禁止硬编码：

```css
/* ✅ 推荐 */
.title { color: var(--color-primary); }
.text { color: var(--color-text-secondary); }

/* ❌ 禁止 */
.title { color: #1aad19; }
```

变量定义在 `styles/tokens.wxss`（原生）或 `styles/tokens.scss`（uni-app）。

### 字体

**严格使用 4 种字体类别**：

| 类别 | 用途 | CSS 变量 |
|------|------|---------|
| PFM (Medium) | 正文 | `font-family: "PFM"` |
| PFR (Regular) | 辅助说明 | `font-family: "PFR"` |
| PFS (Semibold) | 标题 | `font-family: "PFS"` |
| PFL (Light) | 注释/极弱信息 | `font-family: "PFL"` |

### 间距

使用 8 倍数：

```css
/* ✅ 推荐 */
padding: 16rpx 24rpx;
margin-top: 32rpx;

/* ❌ 不推荐 */
padding: 13rpx 27rpx;
```

> 注：uni-app 模板用 SCSS 变量 `$_s16`、`$_s24`、`$_s32` 等。

## 组件命名

业务组件：用 `-` 分隔的描述性名称

```
components/
├── page-title/        # 通用
├── empty/             # 通用
├── user-card/         # 业务
├── order-item/        # 业务
└── coupon-list/       # 业务
```

## 事件命名

参考 [事件常量](/core/event-constants)：

```javascript
// core 中已定义
export const BusEvent = {
  AUTH_EXPIRED: 'auth:expired',
  HTTP_FAIL: 'http:fail',
  THEME_CHANGED: 'theme:changed',
  // ...
};
```

业务事件自行扩展：

```javascript
emitter.emit('cart:updated', { count: 3 });
emitter.emit('order:paid', { orderId: 'xxx' });
```

格式：`<domain>:<verb>`（全小写、冒号分隔）。

## Git 提交

约定（可选）：

```
feat: 新增用户主页
fix: 修复 token 过期跳转问题
refactor: 重构 HttpClient
docs: 补充 Auth 文档
chore: 升级依赖
```

## 错误处理

HTTP 错误统一在响应拦截器处理，业务代码只关心成功路径：

```javascript
// utils/http.js
http.useResponse((response) => {
  if (response.statusCode === 401) {
    emitter.emit(BusEvent.AUTH_EXPIRED);
    return Promise.reject(new Error('unauthorized'));
  }
  if (response.statusCode >= 500) {
    Notify({ type: 'danger', message: '服务异常' });
    return Promise.reject(new Error('server error'));
  }
  return response;
});

// 页面中
async onLoad() {
  try {
    const res = await this.api.user.info();
    this.setData({ user: res.data });
  } catch (e) {
    // 拦截器已处理过 401/500，这里只需处理业务错误码
    if (e.code === 'USER_NOT_FOUND') {
      this.setData({ empty: true });
    }
  }
}
```

## 不要做的事

- ❌ 在页面里直接调 `wx.request` / `uni.request`
- ❌ 硬编码颜色、字体、URL
- ❌ 在 component 内手动 `getApp().globalData.xxx`
- ❌ 写跨页面的 `globalData` 字段（用 emitter）
- ❌ 写 `var`、`==`、`console.log` 调试代码（提交前删掉）

## 下一步

- API 详细说明？👉 [Core 总览](/core/overview)
