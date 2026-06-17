# Router 路由

`@wx-starter/core` 提供路由辅助函数，跨 `wx.navigateTo` 和 `uni.navigateTo`。

## 设计目标

- **路径解析** — URL 拼接、query 参数解析
- **防重复跳转** — 200ms 节流
- **跨平台** — 同一份代码在 `wx` 和 `uni` 下运行
- **不绑定 router** — 微信原生路由已足够用，骨架不引入第三方 router

## 快速开始

```javascript
import { createRouter } from '@wx-starter/core';

const router = createRouter();

router.navigateTo('/pages/user/user?id=123');
router.redirectTo('/pages/login/login');
router.switchTab('/pages/index/index');
router.navigateBack();
```

## API

### `createRouter(options?)`

创建一个路由实例。

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `navigate` | function | 自动检测 | 平台 `navigateTo` |
| `redirect` | function | 自动检测 | 平台 `redirectTo` |
| `switchTab` | function | 自动检测 | 平台 `switchTab` |
| `reLaunch` | function | 自动检测 | 平台 `reLaunch` |
| `navigateBack` | function | 自动检测 | 平台 `navigateBack` |
| `throttle` | number | 200 | 跳转节流（ms） |

### 跳转方法

所有跳转方法都支持 query string：

```javascript
router.navigateTo('/pages/user/user?id=123');
router.navigateTo({ url: '/pages/user/user', query: { id: 123 } });
```

#### `navigateTo(url | options)`

保留当前页面，跳转到新页面。

```javascript
router.navigateTo('/pages/user/user?id=123');
// 或
router.navigateTo({ url: '/pages/user/user', query: { id: 123 } });
```

#### `redirectTo(url | options)`

关闭当前页面，跳转到新页面（不可返回）。

#### `switchTab(url | options)`

跳转到 tabBar 页面（关闭其他非 tabBar 页面）。

#### `reLaunch(url | options)`

关闭所有页面，跳转到新页面。

#### `navigateBack(delta?)`

返回上一页或上 `delta` 页。

```javascript
router.navigateBack();     // 返回 1 页
router.navigateBack(2);    // 返回 2 页
```

### 路径辅助

#### `buildPath(path, query?)`

拼接路径和 query。

```javascript
buildPath('/user', { id: 1, name: 'foo' });
// '/user?id=1&name=foo'
```

#### `parseQuery(search)`

解析 query string 为对象。

```javascript
parseQuery('id=1&name=foo');
// { id: '1', name: 'foo' }
```

## 防重复跳转

同一 URL 在 200ms 内重复调用会被丢弃：

```javascript
router.navigateTo('/pages/a/a');
router.navigateTo('/pages/a/a');  // 被节流，第二次不执行
router.navigateTo('/pages/a/a');  // 200ms 后才执行
```

避免用户在网络慢时连点导致多次跳转。

## 平台差异

| 平台 | 底层 API |
|------|---------|
| 微信小程序 | `wx.navigateTo` 等 |
| uni-app (mp) | `uni.navigateTo` 等 |
| uni-app (h5) | `uni.navigateTo`（包装为 history.pushState） |

## 完整示例

```javascript
// utils/router.js
import { createRouter } from '@wx-starter/core';

export const router = createRouter({
  throttle: 300,
});
```

```javascript
// 页面中
import { router } from '../utils/router';

onTapUser(e) {
  const id = e.currentTarget.dataset.id;
  router.navigateTo(`/pages/user-profile/user-profile?id=${id}`);
}

onTapHome() {
  router.switchTab('/pages/index/index');
}

onTapLogout() {
  router.reLaunch('/pages/login/login');
}
```

## 与 Emitter 配合

跳转登录等场景可以用 emitter 触发：

```javascript
// app.js
import emitter, { BusEvent } from '@wx-starter/core';
import { router } from './utils/router';

emitter.on(BusEvent.AUTH_EXPIRED, () => {
  router.reLaunch('/pages/login/login');
});
```

## 注意事项

### tabBar 页面

跳转到 tabBar 页面必须用 `switchTab`：

```javascript
// ❌ 错误
router.navigateTo('/pages/index/index');

// ✅ 正确
router.switchTab('/pages/index/index');
```

### 页面路径必须绝对

```javascript
// ❌ 错误
router.navigateTo('user?id=1');

// ✅ 正确
router.navigateTo('/pages/user/user?id=1');
```

### 页面深度限制

微信原生限制页面栈最多 10 层。超出后会跳转失败，建议：

- 详情页用 `redirectTo`（看完即关）
- 重要入口用 `switchTab`
- 避免深层返回栈

## 测试

```javascript
// __tests__/router.test.js
import { buildPath, parseQuery } from '@wx-starter/core';

test('buildPath', () => {
  expect(buildPath('/user', { id: 1 })).toBe('/user?id=1');
  expect(buildPath('/user', { id: 1, name: 'foo' })).toBe('/user?id=1&name=foo');
});

test('parseQuery', () => {
  expect(parseQuery('id=1&name=foo')).toEqual({ id: '1', name: 'foo' });
  expect(parseQuery('?id=1')).toEqual({ id: '1' });
});
```

## 下一步

- [Emitter 事件总线](/core/emitter) — 配合 `AUTH_EXPIRED` 跳转
- [原生模板 behaviors](/native/behaviors) — 模板提供的 `jump()` 方法
- [uni-app 模板 mixins](/uniapp/mixins) — 模板提供的 `$back()` 等
