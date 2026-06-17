# Emitter 事件总线

`@wx-starter/core` 提供全局单例事件总线，跨页面、跨组件通信。

## 设计目标

- **单例** — `import emitter from '@wx-starter/core'` 即用
- **类 EventEmitter 风格** — `on/once/emit/off` 与 Node.js EventEmitter 一致
- **多事件 API** — `all/least/batch` 处理"等所有/等任意/逐个"语义
- **类型安全** — 可与 [事件常量](/core/event-constants) 配合使用

## 快速开始

```javascript
import emitter, { BusEvent } from '@wx-starter/core';

// 订阅
emitter.on(BusEvent.AUTH_EXPIRED, () => {
  console.log('token expired');
});

// 广播
emitter.emit(BusEvent.AUTH_EXPIRED, { reason: 'timeout' });
```

## 基本 API

### `on(event, listener)`

订阅事件。

```javascript
const handler = (data) => console.log(data);
emitter.on('user:login', handler);
```

返回 unsubscribe 函数：

```javascript
const off = emitter.on('user:login', handler);
off();  // 取消订阅
```

### `once(event, listener)`

仅触发一次。

```javascript
emitter.once('app:ready', () => {
  console.log('app ready');
});
```

### `emit(event, ...args)`

广播事件。

```javascript
emitter.emit('user:login', { id: 1, name: 'foo' });
emitter.emit('order:paid', order, paymentInfo);  // 多个参数
```

### `off(event, listener)`

取消订阅。

```javascript
const handler = () => {};
emitter.on('evt', handler);
emitter.off('evt', handler);
```

### `clear(event?)`

清除事件的所有监听器，或清除所有事件。

```javascript
emitter.clear('user:login');  // 清除单个事件
emitter.clear();              // 清除所有事件
```

## 多事件 API

适用于"等待多个事件"或"事件链"的场景。

### `all(events, listener)`

**所有**事件都触发后才回调。listener 收到一个 `results` 对象。

```javascript
emitter.all(['user:loaded', 'config:loaded'], (results) => {
  console.log('both ready', results);
  // results: { 'user:loaded': userData, 'config:loaded': configData }
});
```

常用于初始化时等待多个异步事件。

### `least(events, listener)`

**任意一个**事件触发就回调，然后自动取消订阅其他事件。

```javascript
emitter.least(['login:success', 'login:cancel'], (result) => {
  console.log('one of them fired', result);
});
```

### `batch(events, listener)`

每个事件触发都回调（带 key 区分）。

```javascript
emitter.batch(['item:added', 'item:removed'], (key, ...args) => {
  console.log(`${key} fired`, args);
});
```

## 类 API

如果你想创建独立的事件总线（非全局单例），可以 new 一个 `EventEmitter`：

```javascript
import { EventEmitter } from '@wx-starter/core';

const bus = new EventEmitter();
bus.on('custom', () => {});
bus.emit('custom');
```

## 事件名规范

推荐 `<domain>:<verb>` 全小写、冒号分隔：

```javascript
emitter.on('user:login', ...);
emitter.on('user:logout', ...);
emitter.on('order:created', ...);
emitter.on('cart:updated', ...);
emitter.on('theme:changed', ...);
```

通用事件见 [事件常量](/core/event-constants)。

## 最佳实践

### 组件销毁时取消订阅

避免内存泄漏：

```javascript
// 页面
onLoad() {
  this._offLogin = emitter.on('user:login', () => {
    this.refresh();
  });
}
onUnload() {
  this._offLogin?.();
}
```

### 业务模块封装

不要在业务代码里到处 `emitter.emit` 散弹枪式调用，而是封装到 store / service：

```javascript
// store/user.js
import emitter from '@wx-starter/core';

export function login(data) {
  // ...
  emitter.emit('user:login', user);
}
```

### 错误隔离

监听器抛错不应影响其他监听器：

```javascript
emitter.on('user:login', (user) => {
  try {
    doSomething(user);
  } catch (e) {
    console.error(e);
  }
});
```

## 完整示例

```javascript
// app.js — 全局事件订阅
import emitter, { BusEvent } from '@wx-starter/core';

emitter.on(BusEvent.AUTH_EXPIRED, () => {
  wx.showToast({ title: '登录已过期' });
  setTimeout(() => wx.reLaunch({ url: '/pages/login/login' }), 1000);
});

emitter.on(BusEvent.NETWORK_OFFLINE, () => {
  wx.showToast({ title: '网络已断开', icon: 'none' });
});
```

```javascript
// 页面 — 业务事件
onLoad() {
  this._offCart = emitter.on('cart:updated', (cart) => {
    this.setData({ cartCount: cart.items.length });
  });
}
onUnload() {
  this._offCart?.();
}
```

```javascript
// 触发
emitter.emit('cart:updated', { items: [...] });
```

## 测试

```javascript
// __tests__/emitter.test.js
import { EventEmitter } from '@wx-starter/core';

test('on / emit', () => {
  const bus = new EventEmitter();
  let count = 0;
  bus.on('evt', () => count++);
  bus.emit('evt');
  bus.emit('evt');
  expect(count).toBe(2);
});

test('once 只触发一次', () => {
  const bus = new EventEmitter();
  let count = 0;
  bus.once('evt', () => count++);
  bus.emit('evt');
  bus.emit('evt');
  expect(count).toBe(1);
});

test('all — 等待所有事件', () => {
  const bus = new EventEmitter();
  const cb = jest.fn();
  bus.all(['a', 'b'], cb);
  bus.emit('a', 1);
  bus.emit('b', 2);
  expect(cb).toHaveBeenCalledWith({ a: 1, b: 2 });
});

test('least — 任意一个事件', () => {
  const bus = new EventEmitter();
  const cb = jest.fn();
  bus.least(['a', 'b'], cb);
  bus.emit('b', 2);
  expect(cb).toHaveBeenCalledWith(2);
  // a 触发时已被取消订阅
  bus.emit('a', 1);
  expect(cb).toHaveBeenCalledTimes(1);
});
```

## 下一步

- [事件常量](/core/event-constants) — 预定义事件名
- [HTTP 客户端](/core/http) — 拦截器配合 emitter
- [Auth 鉴权](/core/auth) — 触发 `AUTH_EXPIRED`
