# Storage 存储

`@wx-starter/core` 提供命名空间化的存储抽象，跨 `wx.storage` 和 `uni.storage`。

## 设计目标

- **命名空间** — 不同模块的 key 互不冲突
- **同步/异步双 API** — 根据场景选择
- **自动 JSON 序列化** — 存对象不用 `JSON.stringify`
- **跨平台** — 同一份代码在 `wx` 和 `uni` 下运行

## 快速开始

```javascript
import { createStorage } from '@wx-starter/core';

const userStore = createStorage('user');

userStore.set('token', 'xxx');
userStore.set('profile', { name: 'foo', age: 18 });
userStore.get('token');       // 'xxx'
userStore.get('profile');     // { name: 'foo', age: 18 }
userStore.remove('token');
```

## API

### `createStorage(namespace)`

创建一个带命名空间的存储实例。

```javascript
const userStore = createStorage('user');
// 实际存储 key：user:token, user:profile 等
```

### 同步 API

| 方法 | 签名 | 说明 |
|------|------|------|
| `set(key, value)` | `(string, any) => void` | 写入（自动 JSON 序列化） |
| `get(key)` | `(string) => any` | 读取（自动 JSON 反序列化） |
| `remove(key)` | `(string) => void` | 删除 |
| `clear()` | `() => void` | 清空当前命名空间下所有 key |

**底层**走 `wx.setStorageSync` / `uni.setStorageSync` / `localStorage`（h5）。

### 异步 API

| 方法 | 签名 | 说明 |
|------|------|------|
| `setAsync(key, value)` | `(string, any) => Promise<void>` | 异步写入 |
| `getAsync(key)` | `(string) => Promise<any>` | 异步读取 |
| `removeAsync(key)` | `(string) => Promise<void>` | 异步删除 |

**底层**走 `wx.setStorage` / `uni.setStorage`（Promise 形式）。

### JSON 序列化

非字符串值自动 `JSON.stringify` / `JSON.parse`：

```javascript
userStore.set('profile', { name: 'foo' });
// 内部存为 '{"name":"foo"}'

const p = userStore.get('profile');
// 自动解析为 { name: 'foo' }
```

> 注意：纯字符串不会被序列化（保持原样）。

### 命名空间隔离

```javascript
const userStore = createStorage('user');
const cartStore = createStorage('cart');

userStore.set('id', 1);  // 存储 key: user:id
cartStore.set('id', 1);  // 存储 key: cart:id
```

两个 `id` 互不影响。

### 跨域查询

`createStorage` 不支持跨域查询（"列出 user 下所有 key"），但你可以用原生 API：

```javascript
// 列出所有 user:* 的 key
const info = wx.getStorageInfoSync();
const userKeys = info.keys.filter((k) => k.startsWith('user:'));
```

## 平台差异

| 平台 | 同步 API 底层 | 异步 API 底层 |
|------|---------------|---------------|
| 微信小程序 | `wx.setStorageSync` 等 | `wx.setStorage` 等（Promise） |
| uni-app (mp) | `uni.setStorageSync` 等 | `uni.setStorage` 等 |
| uni-app (h5) | `localStorage.setItem` | `localStorage.setItem`（包装为 Promise） |
| Node.js (测试) | 内存 Map | 内存 Map |

## 与 Auth 配合

Auth 内部用 `createStorage('auth')` 存储 token：

```javascript
// 等价于
const authStore = createStorage('auth');
authStore.set('token', 'xxx');  // 实际 key: auth:token
```

## 完整示例

```javascript
// utils/storage.js
import { createStorage } from '@wx-starter/core';

export const userStore = createStorage('user');
export const cartStore = createStorage('cart');
export const prefStore = createStorage('pref');
```

```javascript
// app.js
import { userStore, prefStore } from './utils/storage';

// 写入
userStore.set('token', 'xxx');
userStore.set('profile', { name: 'foo' });
prefStore.set('theme', 'dark');

// 读取
const token = userStore.get('token');
const profile = userStore.get('profile') || {};
const theme = prefStore.get('theme') || 'light';

// 删除
userStore.remove('token');
```

## 注意事项

### 同步 API 的限制

微信小程序同步 API 有 1MB 单 key 限制，整个存储 10MB 限制。大量数据建议用异步 API。

### 不要存敏感信息

token 可以存，但密码、身份证号等敏感信息**不要**存 Storage（明文、可被读取）。

### 存储清理

小程序删除时存储自动清理；冷启动数据保留。

## 测试

```javascript
// __tests__/storage.test.js
import { createStorage } from '@wx-starter/core';

test('set / get / remove', () => {
  const store = createStorage('test');
  store.set('foo', 'bar');
  expect(store.get('foo')).toBe('bar');
  store.remove('foo');
  expect(store.get('foo')).toBe(null);
});

test('自动 JSON 序列化', () => {
  const store = createStorage('test');
  const obj = { a: 1, b: [1, 2, 3] };
  store.set('obj', obj);
  expect(store.get('obj')).toEqual(obj);
});

test('命名空间隔离', () => {
  const s1 = createStorage('ns1');
  const s2 = createStorage('ns2');
  s1.set('key', 'value1');
  s2.set('key', 'value2');
  expect(s1.get('key')).toBe('value1');
  expect(s2.get('key')).toBe('value2');
});
```

## 下一步

- [Auth 鉴权](/core/auth) — Auth 用 `createStorage('auth')` 存 token
- [HTTP 客户端](/core/http) — HttpClient 不直接用 Storage
