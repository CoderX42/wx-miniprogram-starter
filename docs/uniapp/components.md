# 核心组件

uni-app 模板自带 6 个核心组件（Vue SFC），与原生模板的组件功能对应。

## 列表

| 组件 | 用途 |
|------|------|
| [page-title](#page-title) | 顶部标题栏（带返回按钮） |
| [safe-area](#safe-area) | 安全区容器 |
| [empty](#empty) | 空态展示 |
| [loading](#loading) | 加载中 |
| [error-block](#error-block) | 网络错误占位 |
| [popup](#popup) | 通用弹窗 |

通过 `easycom` 自动注册，模板中直接使用，无需 import：

```vue
<template>
  <page-title title="用户主页" :back="true" />
  <safe-area>
    <loading v-if="loading" type="page" />
    <empty v-else-if="!list.length" text="暂无数据" />
    <error-block v-else-if="error" @retry="onRetry" />
  </safe-area>
  <popup :show="showPopup" position="center" @close="showPopup = false">
    弹窗内容
  </popup>
</template>
```

## page-title

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | string | - | 标题文字 |
| `back` | boolean | `false` | 是否显示返回按钮 |
| `bgColor` | string | - | 背景色 |
| `textColor` | string | - | 文字色 |
| `home` | boolean | `false` | 是否显示「首页」按钮 |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 右侧自定义内容 |
| `left` | 覆盖左侧 |
| `right` | 覆盖右侧 |

### 使用

```vue
<page-title title="用户主页" :back="true">
  <template #right>
    <view @click="onShare">分享</view>
  </template>
</page-title>
```

## safe-area

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `top` | boolean | `true` | 处理顶部安全区 |
| `bottom` | boolean | `true` | 处理底部安全区 |
| `bgColor` | string | - | 背景色 |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 内容 |

### 使用

```vue
<safe-area>
  <view class="content">页面内容</view>
</safe-area>
```

## empty

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `text` | string | `'暂无数据'` | 提示文字 |
| `image` | string | - | 自定义空态图 |
| `buttonText` | string | - | 行动按钮文字 |
| `size` | string | `'default'` | `'small' / 'default' / 'large'` |

### Events

| 事件 | 说明 |
|------|------|
| `button-tap` | 点击行动按钮时触发 |

### 使用

```vue
<empty text="暂无订单" button-text="去下单" @button-tap="onGoShop" />
```

## loading

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `type` | string | `'block'` | `'page'` / `'block'` / `'inline'` |
| `text` | string | `'加载中...'` | 提示文字 |
| `color` | string | - | spinner 颜色 |

### 使用

```vue
<loading v-if="loading" type="page" text="正在加载..." />
```

## error-block

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

```vue
<error-block v-if="error" @retry="onRetry" />
```

```vue
<script setup>
import { ref } from 'vue';

const error = ref(false);

async function loadData() {
  try {
    const res = await api.user.info();
    // ...
  } catch (e) {
    error.value = true;
  }
}

function onRetry() {
  error.value = false;
  loadData();
}
</script>
```

## popup

### Props

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `show` | boolean | `false` | 是否显示 |
| `position` | string | `'center'` | `'center' / 'bottom' / 'top' / 'left' / 'right'` |
| `closeOnMask` | boolean | `true` | 点击遮罩是否关闭 |
| `mask` | boolean | `true` | 是否显示遮罩 |
| `zIndex` | number | `100` | 层级 |

### Events

| 事件 | 说明 |
|------|------|
| `close` | 关闭时触发 |
| `update:show` | 更新 show（用于 v-model:show） |

### Slots

| 名称 | 说明 |
|------|------|
| 默认 | 弹窗内容 |

### 使用

```vue
<popup v-model:show="showPopup" position="center">
  <view class="popup-content">
    <view>弹窗内容</view>
    <button @click="showPopup = false">确定</button>
  </view>
</popup>
```

## 自定义业务组件

业务项目可以基于这 6 个组件组合出业务组件：

```vue
<!-- components/order-empty/order-empty.vue -->
<template>
  <empty
    :text="textMap[type].text"
    :button-text="textMap[type].button"
    @button-tap="onTap"
  />
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
  },
});

const emit = defineEmits(['action']);

const textMap = {
  default: { text: '暂无订单', button: '去下单' },
  'no-network': { text: '网络异常', button: '重试' },
};

function onTap() {
  emit('action');
}
</script>
```

## 与 wot-design-uni 配合

wot-design-uni 提供更丰富的组件（Button、Cell、Dialog 等），骨架的 6 个核心组件与它们互补：

| 用途 | 用骨架组件 | 用 wot-design-uni |
|------|----------|-------------------|
| 页面标题 | `<page-title>` | - |
| 安全区 | `<safe-area>` | - |
| 空态 | `<empty>` | - |
| 加载 | `<loading>` | - |
| 错误 | `<error-block>` | - |
| 弹窗 | `<popup>` | `<wd-message-box>` 等 |
| 按钮 | - | `<wd-button>` |
| 表单 | - | `<wd-input>` / `<wd-form>` |
| 列表 | - | `<wd-cell>` |

业务项目可以**混用**，骨架组件处理页面级 UI，wot-design-uni 处理交互细节。

## 下一步

- [Mixins](/uniapp/mixins) — Vue mixin
- [环境配置](/uniapp/environment) — 多环境切换
- [构建脚本](/uniapp/scripts) — 脚手架生成
