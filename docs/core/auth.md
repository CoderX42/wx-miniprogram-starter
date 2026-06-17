# Auth 鉴权

`@wx-starter/core` 提供 `Auth` 基类，模板继承它绑定具体登录流程（`wx.login` / `uni.login`）。

## 设计目标

- **存储抽象** — 内存 + Storage 双层缓存
- **并发控制** — `ensureLogin()` 防止重复调用
- **基类可继承** — 业务项目继承它，绑定 `wx.login` / `uni.login`

## 快速开始

```javascript
import { Auth } from '@wx-starter/core';
import { createHttpClient, createAdapter } from '@wx-starter/core';
import { apiBase } from './env';

const http = createHttpClient({
  baseURL: apiBase,
  adapter: createAdapter(wx.request),
});

class AppAuth extends Auth {
  async loginByCode(code) {
    // 调用后端登录接口
    const res = await http.post('/user/login', { code });
    if (res.data.code === 0) {
      this.setToken(res.data.data.token);
      this.setUserInfo(res.data.data.user);
    }
    return res.data;
  }

  async login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async ({ code }) => {
          try {
            const result = await this.loginByCode(code);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        },
        fail: reject,
      });
    });
  }
}

const auth = new AppAuth({
  http,
  tokenKey: 'app:token',
  userKey: 'app:user',
});

export default auth;
```

## API

### 构造函数

```javascript
new Auth({
  http,        // HttpClient 实例（可选）
  tokenKey,    // token 存储 key，默认 'auth:token'
  userKey,     // userInfo 存储 key，默认 'auth:user'
})
```

### Token 管理

```javascript
auth.isLoggedIn();      // boolean
auth.getToken();         // string | null
auth.setToken(token);    // 写入内存 + 存储
auth.clearToken();       // 清除 token
```

### UserInfo 管理

```javascript
auth.getUserInfo();      // object | null
auth.setUserInfo(user);  // 写入内存 + 存储
auth.clearUserInfo();    // 清除 userInfo
```

### 一键清空

```javascript
auth.clear();            // 清除 token + userInfo
```

### `ensureLogin()`

**核心能力**。确保用户已登录，未登录则触发登录流程。

```javascript
async ensureLogin(options?: { force?: boolean }): Promise<boolean>
```

- 如果已登录 → 直接 resolve `true`
- 如果未登录 → 调用 `this.login()`，成功后 resolve `true`，失败 reject
- **多次并发调用**会复用同一次登录流程（不会触发多个 `wx.login`）

```javascript
// 页面 onLoad
async onLoad() {
  const ok = await auth.ensureLogin();
  if (ok) {
    const res = await this.api.user.info();
    this.setData({ user: res.data });
  }
}
```

### `login()` (抽象方法)

**子类必须实现**。定义具体的登录流程。

```javascript
class AppAuth extends Auth {
  async login() {
    // 调用 wx.login / uni.login 拿 code
    // 用 code 调后端换 token
    // setToken / setUserInfo
  }
}
```

## 与 HttpClient 配合

HttpClient 在请求拦截器中读 token，响应拦截器中处理 401：

```javascript
// utils/http.js
import emitter, { BusEvent } from '@wx-starter/core';

http.useRequest((options) => {
  if (auth.isLoggedIn()) {
    options.header = options.header || {};
    options.header.Authorization = `Bearer ${auth.getToken()}`;
  }
  return options;
});

http.useResponse((response) => {
  if (response.statusCode === 401) {
    auth.clear();
    emitter.emit(BusEvent.AUTH_EXPIRED);
    return Promise.reject(new Error('token expired'));
  }
  return response;
});
```

页面中订阅 `AUTH_EXPIRED` 事件做跳转：

```javascript
// app.js
import emitter, { BusEvent } from '@wx-starter/core';

emitter.on(BusEvent.AUTH_EXPIRED, () => {
  wx.showToast({ title: '登录已过期', icon: 'none' });
  setTimeout(() => {
    wx.reLaunch({ url: '/pages/login/login' });
  }, 1000);
});
```

## 模拟用户（开发环境）

开发环境下，可以注入模拟用户跳过真实登录：

```javascript
// app.js
import { isDev } from '@wx-starter/core';

if (isDev()) {
  auth.setToken('fake-token-for-development');
  auth.setUserInfo({ id: 1, name: 'Test User', openId: 'fake-open-id' });
}
```

或者更优雅的方式 — 在 `AppAuth.login()` 中检测：

```javascript
async login() {
  if (isDev() && this.useMockLogin) {
    this.setToken('mock-token');
    this.setUserInfo({ name: '测试用户' });
    return;
  }
  // 正常流程
  // ...
}
```

## 多个登录态

如果项目中有多种身份（用户/商家/管理员），可以创建多个 Auth 实例：

```javascript
const userAuth = new Auth({ tokenKey: 'user:token', http });
const adminAuth = new Auth({ tokenKey: 'admin:token', http });
```

## 完整示例

```javascript
// utils/auth.js
import { Auth, createAdapter, createHttpClient, isDev, emitter, BusEvent } from '@wx-starter/core';
import { apiBase } from './env';

const http = createHttpClient({
  baseURL: apiBase,
  adapter: createAdapter(wx.request),
});

class AppAuth extends Auth {
  async login() {
    if (isDev() && this.useMockLogin) {
      this.setToken('dev-token');
      this.setUserInfo({ id: 1, name: 'Dev User' });
      return;
    }

    return new Promise((resolve, reject) => {
      wx.login({
        success: async ({ code }) => {
          try {
            const res = await http.post('/user/login', { code });
            if (res.data.code === 0) {
              this.setToken(res.data.data.token);
              this.setUserInfo(res.data.data.user);
              resolve(res.data);
            } else {
              reject(new Error(res.data.message));
            }
          } catch (e) {
            reject(e);
          }
        },
        fail: reject,
      });
    });
  }
}

const auth = new AppAuth({ http });

// token 注入
http.useRequest((options) => {
  if (auth.isLoggedIn()) {
    options.header = options.header || {};
    options.header.Authorization = `Bearer ${auth.getToken()}`;
  }
  return options;
});

// 401 处理
http.useResponse((response) => {
  if (response.statusCode === 401) {
    auth.clear();
    emitter.emit(BusEvent.AUTH_EXPIRED);
    return Promise.reject(new Error('unauthorized'));
  }
  return response;
});

export default auth;
```

## 测试

```javascript
// __tests__/auth.test.js
import { Auth } from '@wx-starter/core';

class TestAuth extends Auth {
  async login() {
    this.setToken('test-token');
    this.setUserInfo({ id: 1 });
  }
}

test('ensureLogin 调用一次 login', async () => {
  const auth = new TestAuth();
  let count = 0;
  const originalLogin = auth.login.bind(auth);
  auth.login = async function () {
    count++;
    return originalLogin();
  };

  await Promise.all([auth.ensureLogin(), auth.ensureLogin(), auth.ensureLogin()]);
  expect(count).toBe(1);
  expect(auth.isLoggedIn()).toBe(true);
});
```

## 下一步

- [HTTP 客户端](/core/http) — 与 Auth 配合
- [Emitter 事件总线](/core/emitter) — `AUTH_EXPIRED` 事件
- [Storage 存储](/core/storage) — token 持久化
