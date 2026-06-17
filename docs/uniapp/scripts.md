# 构建脚本

`templates/mp-uniapp/scripts/` 提供 2 个脚手架脚本。

## 列表

| 脚本 | 用途 |
|------|------|
| [new-page.js](#new-page-js) | 快速创建新页面 |
| [new-component.js](#new-component-js) | 快速创建新组件 |

## new-page.js

快速创建一个新页面（单文件）。

### 用法

```bash
node scripts/new-page.js <page-name> [--with-form]
```

### 示例

```bash
# 基础页面
node scripts/new-page.js user-profile

# 带表单 mixin
node scripts/new-page.js user-profile --with-form
```

### 生成的文件

```
src/pages/user-profile/
└── user-profile.vue   # template + script + style
```

### 模板

```vue
<template>
  <view class="container">
    <page-title title="user-profile" :back="true" />
    <!-- 在此编写页面内容 -->
  </view>
</template>

<script>
import formMixin from '@/mixins/form';

export default {
  mixins: [formMixin],
  data() {
    return {};
  },
  onLoad() {},
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 24rpx;
}
</style>
```

### 注册到 pages.json

创建后**需要手动**注册到 `src/pages.json`：

```json
{
  "pages": [
    { "path": "pages/index/index" },
    { "path": "pages/user-profile/user-profile" }
  ]
}
```

## new-component.js

快速创建一个新组件（单文件）。

### 用法

```bash
node scripts/new-component.js <component-name> [--use-form] [--use-safearea]
```

### 示例

```bash
# 基础组件
node scripts/new-component.js my-button

# 带 form + safearea mixin
node scripts/new-component.js my-button --use-form --use-safearea
```

### 生成的文件

```
src/components/my-button/
└── my-button.vue
```

### 模板

```vue
<template>
  <view class="my-button">
    <slot></slot>
  </view>
</template>

<script>
import formMixin from '@/mixins/form';
import safeareaMixin from '@/mixins/safearea';

export default {
  name: 'my-button',
  mixins: [formMixin, safeareaMixin],
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.my-button {
  /* 在此编写组件样式 */
}
</style>
```

### 自动注册

由于 `easycom.autoscan: true`，组件**无需手动注册**，模板中直接使用：

```vue
<template>
  <my-button>按钮</my-button>
</template>
```

## 与原生模板的差异

| | 原生模板 | uni-app 模板 |
|---|---------|-------------|
| **页面文件** | 4 个文件（js/json/wxml/wxss） | 1 个 .vue 文件 |
| **组件文件** | 4 个文件 | 1 个 .vue 文件 |
| **组件注册** | app.json 全局或页面 json | easycom 自动 |
| **样式作用域** | 无（需手写 BEM） | `<style scoped>` 自动 |
| **预处理器** | 原生 WXSS | SCSS（uni.scss 全局变量） |

## 下一步

- [uni-app 模板总览](/uniapp/overview) — 完整结构
- [原生模板脚本](/native/scripts) — 对比原生版本
