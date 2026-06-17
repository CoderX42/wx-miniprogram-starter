# 核心概念

了解这 5 个概念，能覆盖 80% 的日常开发。

## 1. HttpClient（请求）

所有 HTTP 请求都通过 core 提供的 `HttpClient` 发起。它支持：

- **拦截器**：在请求前后统一处理（如注入 token、统一错误）
- **适配器**：跨 `wx.request` / `uni.request`
- **快捷方法**：`get` / `post` / `put` / `delete` / `upload` / `download`

**最小使用**：

```javascript
import { createHttpClient } from '@wx-starter/core';
import { apiBase } from './env';

const http = createHttpClient({
  baseURL: apiBase,
  adapter: createAdapter(wx.request),
});

const res = await http.get('/user/info');
```

**带拦截器**（推荐）：

```javascript
http.useRequest((options) => {
  options.header.Authorization = `Bearer ${getToken()}`;
  return options;
});

http.useResponse((response) => {
  if (response.statusCode === 401) {
    emitter.emit(BusEvent.AUTH_EXPIRED);
  }
  return response;
});
```

详见 [HTTP 客户端](/core/http)。

## 2. Auth（登录态）

`Auth` 是一个基类，模板里继承它绑定具体登录流程。

**核心能力**：

- 内存 + 存储双层缓存 token
- `ensureLogin()` — 防止并发调用，重复登录
- `setUserInfo()` / `getUserInfo()` — 用户信息

**典型使用**：

```javascript
class AppAuth extends Auth {
  async loginByCode(code) {
    const res = await this.http.post('/login', { code });
    this.setToken(res.data.token);
    this.setUserInfo(res.data.user);
  }
}
```

详见 [Auth 鉴权](/core/auth)。

## 3. Emitter（事件总线）

全局单例 `emitter`，跨页面、跨组件通信。

**4 个核心 API**：

| API | 语义 | 典型用途 |
|-----|------|---------|
| `on(evt, cb)` | 订阅事件 | 监听 token 过期、用户信息变更 |
| `once(evt, cb)` | 仅触发一次 | 监听首屏初始化 |
| `emit(evt, data)` | 广播事件 | 主题切换、登录成功 |
| `off(evt, cb)` | 取消订阅 | 组件销毁时清理 |

**高级语义**（多事件）：

| API | 语义 |
|-----|------|
| `all([evt1, evt2], cb)` | 所有事件都触发后才回调 |
| `least([evt1, evt2], cb)` | 任意一个事件触发就回调 |
| `batch([evt1, evt2], cb)` | 每个事件触发都回调 |

详见 [Emitter 事件总线](/core/emitter) 和 [事件常量](/core/event-constants)。

## 4. Storage（存储）

`createStorage(namespace)` 创建一个带命名空间的存储实例，避免 key 冲突。

```javascript
const userStore = createStorage('user');
userStore.set('token', 'xxx');  // 实际 key: user:token
userStore.get('token');          // 'xxx'
userStore.remove('token');
```

- 同步 API（`get`/`set`/`remove`）走 `wx.getStorageSync` 等
- 异步 API（`getAsync`/`setAsync`）走 Promise 形式
- 自动 JSON 序列化/反序列化（值非字符串时）

详见 [Storage 存储](/core/storage)。

## 5. Formatter & Validator（工具）

**Formatter** — 数据展示：

```javascript
formatDate(new Date());       // '2024-01-15'
formatMoney(12345);           // '123.45' (分→元)
formatShortNumber(1500);      // '1.5K'
timeAgo(new Date());          // '5 分钟前'
maskPhone('13800138000');     // '138****8000'
```

**Validator** — 数据校验：

```javascript
isPhone('13800138000');       // true
isEmail('a@b.com');           // true
isIdCard('11010119900307...'); // true
v.required('昵称', name).isPhone('手机号', phone);
```

详见 [Formatter 格式化](/core/formatter) 和 [Validator 校验](/core/validator)。

## 它们如何协作

```
                    ┌──────────────┐
                    │   页面 / 组件  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   this.api.xxx()    this.emitter.on()  this.$auth
        │                  │                  │
        ▼                  ▼                  ▼
    ┌──────┐          ┌────────┐         ┌──────┐
    │ http │ ───────▶ │emitter │ ◀────── │ auth │
    └──┬───┘          └────┬───┘         └──┬───┘
       │                   │                │
       └───────────────────┴────────────────┘
                           │
                           ▼
                    ┌──────────┐
                    │ storage  │
                    └──────────┘
```

一个常见流程：

1. 页面调用 `this.api.user.login()`
2. `http` 发送请求，token 过期返回 401
3. 响应拦截器触发 `emitter.emit('auth:expired')`
4. `auth` 监听到该事件，清除 token 并跳转登录
5. 登录成功后，auth 把新 token 写入 storage

## 下一步

- 实际开始写代码？👉 [开发约定](/guide/conventions)
- 详细 API？👉 [Core 总览](/core/overview)
- 模板特有功能？👉 [原生模板 behaviors](/native/behaviors) / [uni-app mixins](/uniapp/mixins)
