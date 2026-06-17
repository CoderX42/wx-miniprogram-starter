# 事件常量

`@wx-starter/core` 预定义通用事件名常量，避免字符串拼写错误。

## 设计目标

- **集中管理** — 所有内置事件在一个文件
- **IDE 提示** — 引用常量而非字符串
- **可扩展** — 业务项目可以定义自己的事件常量

## 快速开始

```javascript
import { BusEvent } from '@wx-starter/core';

emitter.on(BusEvent.AUTH_EXPIRED, () => {
  // ...
});
```

## 内置事件

### HTTP 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `HTTP_SUCCESS` | `http:success` | HTTP 请求成功 |
| `HTTP_FAIL` | `http:fail` | HTTP 请求失败 |
| `HTTP_TIMEOUT` | `http:timeout` | HTTP 请求超时 |
| `HTTP_OFFLINE` | `http:offline` | 网络离线 |

### Auth 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `AUTH_LOGIN` | `auth:login` | 用户登录成功 |
| `AUTH_LOGOUT` | `auth:logout` | 用户登出 |
| `AUTH_EXPIRED` | `auth:expired` | Token 过期 |
| `AUTH_REFRESH` | `auth:refresh` | Token 刷新 |

### Network 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `NETWORK_ONLINE` | `network:online` | 网络恢复 |
| `NETWORK_OFFLINE` | `network:offline` | 网络断开 |

### Theme 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `THEME_CHANGED` | `theme:changed` | 主题切换 |

### App 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `APP_LAUNCH` | `app:launch` | App 启动 |
| `APP_SHOW` | `app:show` | App 切前台 |
| `APP_HIDE` | `app:hide` | App 切后台 |

### Storage 事件

| 常量 | 值 | 触发时机 |
|------|-----|---------|
| `STORAGE_CLEAR` | `storage:clear` | 存储被清空 |

## 自定义业务事件

业务项目应该扩展自己的事件常量：

```javascript
// events/index.js
import { BusEvent as Core } from '@wx-starter/core';

export const BusEvent = {
  ...Core,
  // 业务事件
  CART_UPDATED: 'cart:updated',
  ORDER_CREATED: 'order:created',
  ORDER_PAID: 'order:paid',
  COUPON_RECEIVED: 'coupon:received',
  USER_PROFILE_UPDATED: 'user:profile-updated',
};
```

或者直接用字符串，但保持规范：

```javascript
emitter.on('cart:updated', () => {});
emitter.on('order:paid', () => {});
```

## 命名规范

`<domain>:<verb>` 全小写、冒号分隔：

```javascript
// 格式
emitter.emit('<domain>:<verb>', payload);

// 示例
emitter.emit('user:login', user);
emitter.emit('order:paid', order);
emitter.emit('cart:updated', cart);
emitter.emit('theme:changed', theme);
emitter.emit('http:fail', error);
emitter.emit('auth:expired', null);
```

**domain** 表示事件来源的子系统（user / order / cart / theme / http / auth / network ...）。
**verb** 表示动作（login / logout / created / updated / paid / changed / failed ...）。

## 与 emitter 配合

详见 [Emitter 事件总线](/core/emitter)。

## 下一步

- [Emitter 事件总线](/core/emitter) — `on/once/emit/off/all/least/batch`
- [HTTP 客户端](/core/http) — 触发 `HTTP_*` 事件
- [Auth 鉴权](/core/auth) — 触发 `AUTH_*` 事件
