# @wx-starter/core

跨技术栈核心库 — 在微信小程序和 uni-app 中提供一致的工具 API。

## 模块

| 模块 | 导出 | 用途 |
|------|------|------|
| Emitter | `EventEmitter`, `emitter` (单例) | 事件总线，支持 on/off/once/emit/all/least/batch |
| EventConstants | `BusEvent` | HTTP / Auth / Theme 等通用事件名常量 |
| Env | `configureEnv`, `isDev`, `isTrial`, ... | 环境与平台判断 |
| Storage | `createStorage(ns)` | 命名空间 + sync/async API + JSON 序列化 |
| Auth | `Auth` (基类) | token 管理 + `ensureLogin()` 钩子 |
| Router | `navigateTo`, `redirectTo`, ... | 跨平台路由辅助 |
| Formatter | `formatDate`, `formatMoney`, `formatNumber`, ... | 日期/金额/数字格式化 |
| Validator | `isPhone`, `isEmail`, `createValidator`, ... | 通用字段校验 |
| HTTP | `HttpClient` | 拦截器风格 HTTP 客户端 |

## 安装

在原生小程序或 uni-app 项目中：

```bash
npm install @wx-starter/core
```

然后在 `project.config.json` 设置 `"packNpmManually": false`，开发者工具会自动构建 `miniprogram_npm`。

## 用法

### HTTP Client

```javascript
import { HttpClient, emitter, BusEvent } from '@wx-starter/core';

const http = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 20000,
});

// 全局拦截器
http.useRequest((config) => {
  const token = wx.getStorageSync('token');
  if (token) config.header.Authorization = `Bearer ${token}`;
  return config;
});

http.useResponse((data) => {
  if (data?.code === 401) {
    emitter.emit(BusEvent.AUTH_EXPIRED, data);
  }
  return data;
});

export default http;
```

### 事件总线

```javascript
import { emitter, BusEvent } from '@wx-starter/core';

// 订阅
const off = emitter.on(BusEvent.AUTH_LOGIN, ({ token }) => {
  console.log('user logged in:', token);
});

// 一次性订阅
emitter.once('first:visit', () => {
  console.log('first visit');
});

// 发布
emitter.emit('custom:event', { payload: 1 });
emitter.emit(BusEvent.AUTH_LOGIN, { token: 'xxx' });

// 取消订阅
off();
```

### Storage

```javascript
import { createStorage } from '@wx-starter/core';

const userStorage = createStorage('user');

userStorage.set('token', 'xxx');
userStorage.get('token'); // 'xxx'

userStorage.setJSON('profile', { name: 'foo', age: 18 });
userStorage.getJSON('profile'); // { name: 'foo', age: 18 }

userStorage.remove('token');
userStorage.clear(); // 清空全部
```

### Auth

```javascript
import { Auth } from '@wx-starter/core';
import http from './http';

class AppAuth extends Auth {
  async doLogin() {
    const { code } = await wx.login();
    const res = await http.post('/session/login', { code });
    return { token: res.data.token, userInfo: res.data.user };
  }
}

export const auth = new AppAuth({ namespace: 'auth' });

// 任意位置使用
await auth.ensureLogin();
const token = auth.getToken();
```

### Router

```javascript
import { navigateTo, redirectTo, switchTab, navigateBack, buildPath } from '@wx-starter/core';

// 路径拼接
const url = buildPath('/pages/detail/detail', { id: 123, source: 'home' });
// '/pages/detail/detail?id=123&source=home'

// 路由跳转
await navigateTo('/pages/detail/detail', { id: 123 });
await redirectTo('/pages/login/login');
await switchTab('/pages/index/index');
navigateBack();
```

### Formatter

```javascript
import { formatDate, formatMoney, timeAgo, maskPhone } from '@wx-starter/core';

formatDate(new Date(), 'YYYY-MM-DD HH:mm'); // '2024-01-05 14:30'
formatMoney(12345); // '¥123.45'
timeAgo(new Date(Date.now() - 5 * 60 * 1000)); // '5分钟前'
maskPhone('13800138000'); // '138****8000'
```

### Validator

```javascript
import { isPhone, createValidator } from '@wx-starter/core';

isPhone('13800138000'); // true

// 链式校验
const v = createValidator(form.phone)
  .required('手机号必填')
  .isPhone('手机号格式错误');

if (!v.isValid) {
  showError(v.errors[0]);
  return;
}
```

### Env

```javascript
import { configureEnv, isDev, isRelease } from '@wx-starter/core';

// 初始化
configureEnv({
  getAccountInfoSync: () => wx.getAccountInfoSync(),
  platform: 'weixin',
});

if (isDev()) {
  console.log('development mode');
}
```

## 测试

```bash
npm test
```

## License

MIT
