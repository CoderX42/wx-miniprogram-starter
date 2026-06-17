# Mixins

uni-app 模板用 **Vue mixin** 替代原生 behaviors。3 个核心 mixin 提供了与原生模板对应的能力。

## plugin（全局 mixin）

`mixins/plugin.js` 在 `main.js` 中注册为**全局 mixin**，所有页面/组件自动继承。

### 注入的属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `$api` | object | API 端点（来自 `utils/api.js`） |
| `$emitter` | EventEmitter | 事件总线单例 |
| `$event` | object | 事件常量（BusEvent） |
| `$auth` | Auth | 鉴权实例 |
| `$http` | HttpClient | HTTP 客户端 |
| `$router` | Router | 路由辅助 |

### 注入的方法

#### `$call(apiPath, params?)`

统一的 API 调用。

```vue
<template>
  <view @click="$call('user.info', { id: 123 })">查看用户</view>
</template>
```

#### `$back(delta?)`

返回上一页。

```vue
<template>
  <view @click="$back()">返回</view>
</template>
```

#### `$preview(src)`

预览图片。

```vue
<template>
  <image :src="item.thumb" @click="$preview(item.url)" />
</template>
```

#### `$clipboard(text)`

复制到剪贴板。

```javascript
this.$clipboard('已复制的文本');
```

#### `$toast(title, icon?)`

显示 toast。

```javascript
this.$toast('保存成功', 'success');
```

#### `$jump(page, params?)`

页面跳转。

```javascript
this.$jump('/pages/user-profile/user-profile', { id: 123 });
```

#### `$switchTab(page)`

跳转到 tabBar 页面。

```javascript
this.$switchTab('/pages/index/index');
```

### 在 setup 中使用

全局 mixin 在 `setup` 中通过 `this` 不可用（setup 中无 this）。需要 `getCurrentInstance()` 或直接 import：

```vue
<script setup>
import { getCurrentInstance } from 'vue';
import api from '@/utils/api';
import emitter from '@wx-starter/core';
import { BusEvent } from '@wx-starter/core';

const { proxy } = getCurrentInstance();

function onTap() {
  // 通过 proxy 访问全局 mixin 注入的方法
  proxy.$toast('操作成功');
  
  // 推荐：直接 import api（更显式）
  api.user.info().then(...);
  
  // 直接 import emitter
  emitter.emit(BusEvent.USER_LOGIN, user);
}
</script>
```

> 注：composition API 项目中，**更推荐直接 import 工具函数**，而不是通过 `$api` / `$emitter` 访问。两者效果一致，但直接 import 类型推断更好。

## safearea

注入安全区信息。

### 注入的数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `menuInfo` | object | 胶囊菜单信息 |
| `windowInfo` | object | 窗口信息 |
| `safeTop` | number | 顶部安全距离（px） |

### 局部 mixin（按需启用）

```vue
<script>
import safeareaMixin from '@/mixins/safearea';

export default {
  mixins: [safeareaMixin],
  // safeTop / menuInfo / windowInfo 可在 data 中访问
};
</script>
```

> 注：safearea 通常需要在小程序 onLoad 时计算，所以**不**适合全局 mixin（应在每个页面单独引入）。也可以放在 `App.vue` 的 `onLaunch` 中一次性计算，然后存到 Pinia store。

### 推荐做法（Pinia）

```javascript
// store/system.js
import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', () => {
  const safeTop = ref(0);
  const menuInfo = ref({});
  const windowInfo = ref({});

  function init() {
    const windowInfo = uni.getWindowInfo();
    const menuInfo = uni.getMenuButtonBoundingClientRect();
    safeTop.value = menuInfo.bottom + 8;
  }

  return { safeTop, menuInfo, windowInfo, init };
});
```

```vue
<!-- App.vue -->
<script setup>
import { onLaunch } from '@dcloudio/uni-app';
import { useSystemStore } from '@/store/system';

onLaunch(() => {
  const sys = useSystemStore();
  sys.init();
});
</script>
```

```vue
<!-- 任意页面 -->
<script setup>
import { useSystemStore } from '@/store/system';
const sys = useSystemStore();
</script>

<template>
  <view :style="{ paddingTop: sys.safeTop + 'px' }">...</view>
</template>
```

## form

注入表单处理方法。

### 注入的方法

#### `onInput(field, e)`

统一处理 input/textarea 输入。

```vue
<template>
  <input
    :value="form.name"
    @input="onInput('form.name', $event)"
  />
</template>

<script>
import formMixin from '@/mixins/form';

export default {
  mixins: [formMixin],
  data() {
    return { form: { name: '' } };
  },
};
</script>
```

#### `onPicker(field, rangeKey, e)`

处理 picker 选择。

```vue
<template>
  <picker
    mode="selector"
    :range="cities"
    range-key="name"
    @change="onPicker('form.city', 'name', $event)"
  >
    <view>{{ form.city?.name || '请选择城市' }}</view>
  </picker>
</template>
```

#### `uploadFile(options)`

上传文件。

```javascript
methods: {
  async onChooseImage() {
    const res = await uni.chooseImage({ count: 1 });
    const result = await this.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: res.tempFilePaths[0],
      name: 'file',
    });
  },
},
```

### 局部 mixin（按需启用）

```vue
<script>
import formMixin from '@/mixins/form';

export default {
  mixins: [formMixin],
};
</script>
```

## 自定义 Mixin

业务项目可以扩展 mixin：

```javascript
// mixins/share.js
export default {
  methods: {
    onShareAppMessage() {
      return {
        title: '分享标题',
        path: '/pages/index/index',
      };
    },
    onShareTimeline() {
      return {
        title: '分享标题',
      };
    },
  },
};
```

```vue
<script>
import shareMixin from '@/mixins/share';

export default {
  mixins: [shareMixin],
};
</script>
```

或者全局注册（在 `main.js` 中）：

```javascript
import shareMixin from './mixins/share';

export function createApp() {
  const app = createSSRApp(App);
  app.mixin(shareMixin);  // 全局 mixin
  return { app };
}
```

## 下一步

- [核心组件](/uniapp/components) — Vue SFC 组件
- [环境配置](/uniapp/environment) — 多环境切换
