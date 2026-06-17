# HTTP 客户端

`@wx-starter/core` 提供拦截器风格的 HTTP 客户端，跨 `wx.request` 和 `uni.request`。

## 快速开始

```javascript
import { createHttpClient, createAdapter } from '@wx-starter/core';

// 原生小程序
const http = createHttpClient({
  baseURL: 'https://api.example.com',
  adapter: createAdapter(wx.request),
});

// uni-app
const http = createHttpClient({
  baseURL: 'https://api.example.com',
  adapter: createAdapter(uni.request),
});
```

## 适配器

### `createAdapter(request)`

将平台请求函数（`wx.request` / `uni.request`）包装成 Promise 风格：

```javascript
import { createAdapter } from '@wx-starter/core';

const adapter = createAdapter(wx.request);
// adapter(options) 返回 Promise<response>
```

### `detectRequest()`

自动检测当前平台的请求函数（`wx.request` / `uni.request`）：

```javascript
import { createAdapter, detectRequest } from '@wx-starter/core';

const adapter = createAdapter(detectRequest());
```

### `createUploadAdapter(request)`

文件上传适配器（`wx.uploadFile` / `uni.uploadFile`）。

### `createDownloadAdapter(request)`

文件下载适配器（`wx.downloadFile` / `uni.downloadFile`）。

## 基本请求

### `http.request(url, options)`

底层方法，所有快捷方法都基于它。

```javascript
const res = await http.request('/user/info', {
  method: 'GET',
  header: { 'X-Custom': 'value' },
});
```

### 快捷方法

```javascript
http.get(url, options?);
http.post(url, data?, options?);
http.put(url, data?, options?);
http.delete(url, options?);
```

### 上传 / 下载

```javascript
const res = await http.upload('/upload', {
  filePath: 'wxfile://xxx',
  name: 'file',
  formData: { type: 'avatar' },
});

const dl = await http.download('https://example.com/file.pdf');
console.log(dl.tempFilePath);
```

## 拦截器

拦截器是 HttpClient 的核心特性，统一处理 token 注入、错误提示等横切关注点。

### `useRequest(fn)`

请求拦截器，在请求发出前执行。

```javascript
http.useRequest((options) => {
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = { ...options.header, Authorization: `Bearer ${token}` };
  }
  return options;
});
```

可以**修改 options**、**返回新 options**、或**返回 rejected Promise 提前终止**。

### `useResponse(fn)`

响应拦截器。

```javascript
import { emitter, BusEvent } from '@wx-starter/core';

http.useResponse((response) => {
  if (response.statusCode === 401) {
    emitter.emit(BusEvent.AUTH_EXPIRED);
    return Promise.reject(new Error('unauthorized'));
  }
  return response;
});
```

### `useError(fn)`

错误拦截器，处理网络层错误（请求失败、超时等）。

```javascript
http.useError((err) => {
  console.error('[http]', err);
  return Promise.reject(err);
});
```

### 拦截器顺序

- **请求拦截器**：按注册顺序执行
- **响应拦截器**：按注册顺序执行
- **错误拦截器**：按注册顺序执行

## 配置

### `createHttpClient(options)`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `baseURL` | string | ✅ | API 基础 URL |
| `adapter` | function | ✅ | 平台请求适配器 |
| `timeout` | number | ❌ | 超时时间（ms），默认 30000 |
| `header` | object | ❌ | 全局默认 header |
| `interceptors` | array | ❌ | 拦截器数组 |

### `interceptors` 数组

```javascript
const http = createHttpClient({
  baseURL: 'https://api.example.com',
  adapter,
  interceptors: [
    {
      request: (options) => {
        options.header['X-Token'] = getToken();
        return options;
      },
      response: (response) => response,
      error: (err) => Promise.reject(err),
    },
  ],
});
```

## 响应格式

`http.request()` 返回的 Promise 解析值为：

```typescript
{
  statusCode: number;       // HTTP 状态码
  data: any;                // 响应数据（自动 JSON.parse）
  header: object;           // 响应头
  cookies?: string[];       // cookies（部分平台）
  errMsg?: string;          // 错误信息
}
```

## 完整示例

```javascript
// utils/http.js
import { createHttpClient, createAdapter, emitter, BusEvent, detectRequest } from '@wx-starter/core';
import { apiBase } from './env';

const http = createHttpClient({
  baseURL: apiBase,
  adapter: createAdapter(detectRequest()),
  timeout: 15000,
});

// 请求拦截：注入 token
http.useRequest((options) => {
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = options.header || {};
    options.header.Authorization = `Bearer ${token}`;
  }
  return options;
});

// 响应拦截：处理 401
http.useResponse((response) => {
  if (response.statusCode === 401) {
    emitter.emit(BusEvent.AUTH_EXPIRED);
    return Promise.reject(new Error('token expired'));
  }
  if (response.statusCode >= 500) {
    wx.showToast({ title: '服务异常', icon: 'none' });
    return Promise.reject(new Error('server error'));
  }
  return response;
});

// 错误拦截：网络失败
http.useError((err) => {
  if (err.errMsg?.includes('timeout')) {
    wx.showToast({ title: '请求超时', icon: 'none' });
  } else if (err.errMsg?.includes('fail')) {
    wx.showToast({ title: '网络异常', icon: 'none' });
  }
  return Promise.reject(err);
});

export default http;
```

```javascript
// utils/api.js
import http from './http';

export const user = {
  info: () => http.get('/user/info'),
  login: (data) => http.post('/user/login', data),
  logout: () => http.post('/user/logout'),
};
```

## 错误处理最佳实践

**HTTP 层错误**（4xx/5xx/网络）— 在拦截器中处理，业务代码不感知。

**业务层错误**（后端返回的 `code !== 0`）— 在 API 模块中处理或上抛。

```javascript
// utils/api.js
export const order = {
  async detail(id) {
    const res = await http.get(`/order/${id}`);
    if (res.data.code !== 0) {
      throw new Error(res.data.message);
    }
    return res.data;
  },
};
```

## 测试

```javascript
// __tests__/http.test.js
import { createHttpClient, createAdapter } from '@wx-starter/core';

const mockAdapter = createAdapter((options) => {
  if (options.url === '/ok') {
    options.success({ statusCode: 200, data: { code: 0, data: { id: 1 } } });
  } else {
    options.fail({ errMsg: 'request:fail' });
  }
});

const http = createHttpClient({
  baseURL: 'https://test.com',
  adapter: mockAdapter,
});

test('GET 请求成功', async () => {
  const res = await http.get('/ok');
  expect(res.data.data.id).toBe(1);
});
```

## 下一步

- [Auth 鉴权](/core/auth) — 拦截器配合 Auth 实现自动登录
- [Emitter 事件总线](/core/emitter) — `AUTH_EXPIRED` 等事件
- [事件常量](/core/event-constants) — 预定义的事件名
