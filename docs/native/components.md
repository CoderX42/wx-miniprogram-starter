# 核心组件

原生模板自带 6 个核心组件，覆盖 80% 的通用场景。

## 列表

| 组件 | 用途 |
|------|------|
| [page-title](#page-title) | 顶部标题栏（带返回按钮） |
| [safe-area](#safe-area) | 安全区容器（避开刘海/胶囊） |
| [empty](#empty) | 空态展示 |
| [loading](#loading) | 加载中（页面级 / 区块级） |
| [error-block](#error-block) | 网络错误占位 |
| [popup](#popup) | 通用弹窗 |

所有组件通过 `app.json` 的 `usingComponents` 全局注册，WXML 中直接使用：

```html
<page-title title="用户主页" back="true" />
<safe-area>
  <loading type="page" />
  <empty text="暂无数据" />
  <error-block />
  <popup show="true">弹窗内容</popup>
</safe-area>
```

## page-title

顶部标题栏，自带返回按钮。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | string | - | 标题文字 |
| `back` | boolean | `false` | 是否显示返回按钮 |
| `bgColor` | string | - | 背景色（CSS 值），默认 `var(--color-bg)` |
| `textColor` | string | - | 文字色，默认 `var(--color-text)` |
| `home` | boolean | `false` | 是否显示「首页」按钮（多级页面时） |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 标题右侧的自定义内容 |
| `left` | 覆盖左侧（默认是返回按钮） |
| `right` | 覆盖右侧 |

### 使用

```html
<page-title title="用户主页" back="true">
  <view slot="right" bindtap="onTapShare">分享</view>
</page-title>
```

## safe-area

安全区容器，自动处理顶部（胶囊）和底部（iPhone home indicator）安全距离。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `top` | boolean | `true` | 是否处理顶部安全区 |
| `bottom` | boolean | `true` | 是否处理底部安全区 |
| `bgColor` | string | - | 背景色 |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 内容 |

### 使用

```html
<safe-area>
  <view class="content">页面内容</view>
</safe-area>
```

如果需要更细粒度控制，也可以用 `behavior/safearea` 注入的 `safeTop` 数值。

## empty

空态展示。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `text` | string | `'暂无数据'` | 提示文字 |
| `image` | string | - | 自定义空态图（不传则用默认 SVG） |
| `buttonText` | string | - | 行动按钮文字 |
| `size` | string | `'default'` | `'small' / 'default' / 'large'` |

### Events

| 事件 | 说明 |
|------|------|
| `buttonTap` | 点击行动按钮时触发 |

### 使用

```html
<empty text="暂无订单" button-text="去下单" bind:buttontap="onGoShop" />
```

## loading

加载中状态。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `type` | string | `'block'` | `'page'`（全屏）/ `'block'`（区块）/ `'inline'`（行内） |
| `text` | string | `'加载中...'` | 提示文字 |
| `color` | string | - | spinner 颜色，默认 `var(--color-primary)` |

### 使用

```html
<!-- 全屏加载 -->
<loading type="page" wx:if="{{loading}}" />

<!-- 区块加载 -->
<view class="card">
  <loading type="block" />
</view>
```

## error-block

网络错误占位。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `text` | string | `'网络异常'` | 提示文字 |
| `buttonText` | string | `'重试'` | 重试按钮文字 |
| `image` | string | - | 自定义错误图 |

### Events

| 事件 | 说明 |
|------|------|
| `retry` | 点击重试时触发 |

### 使用

```html
<error-block wx:if="{{error}}" bind:retry="onRetry" />
```

```javascript
async onLoad() {
  try {
    const res = await this.api.user.info();
    this.setData({ user: res.data, error: false });
  } catch (e) {
    this.setData({ error: true });
  }
},

onRetry() {
  this.onLoad();
},
```

## popup

通用弹窗，支持多个位置。

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `show` | boolean | `false` | 是否显示 |
| `position` | string | `'center'` | `'center'` / `'bottom'` / `'top'` / `'left'` / `'right'` |
| `closeOnMask` | boolean | `true` | 点击遮罩是否关闭 |
| `mask` | boolean | `true` | 是否显示遮罩 |
| `zIndex` | number | `100` | 层级 |

### Events

| 事件 | 说明 |
|------|------|
| `close` | 关闭时触发 |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 弹窗内容 |

### 使用

```html
<popup show="{{showPopup}}" position="center" bind:close="onClosePopup">
  <view class="popup-content">
    <view>弹窗内容</view>
    <button bindtap="onConfirm">确定</button>
  </view>
</popup>
```

## 自定义业务组件

业务项目可以基于这 6 个组件组合出业务组件：

```javascript
// components/order-empty/order-empty.js
import createComponent from '../../component-base';

createComponent({
  properties: {
    type: {
      type: String,
      value: 'default',  // 'default' / 'no-network' / 'no-permission'
    },
  },
});
```

```html
<!-- components/order-empty/order-empty.wxml -->
<view class="order-empty">
  <empty
    text="{{textMap[type].text}}"
    button-text="{{textMap[type].button}}"
    bind:buttontap="onButtonTap"
  />
</view>
```

## 下一步

- [Behaviors](/native/behaviors) — 行为混入
- [环境配置](/native/environment) — 多环境切换
- [构建脚本](/native/scripts) — 脚手架生成
