# Behaviors

`miniprogram/behaviors/` 提供 3 个核心 behavior，自动注入到页面/组件。

## plugin（核心）

`behaviors/plugin.js` 注入业务最常用的能力。

### 注入的数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `this.api` | object | API 端点（来自 `utils/api.js`） |
| `this.emitter` | EventEmitter | 事件总线单例 |
| `this.event` | object | 事件常量（BusEvent） |

### 注入的方法

#### `this.call(e?)`

统一的 API 调用封装。配合 `<view bindtap="call" data-api="user.info" data-params="id=123">` 使用：

```html
<view bindtap="call" data-api="user.info" data-params="id=123">查看用户</view>
```

```javascript
// 等价于
this.api.user.info({ id: '123' });
```

#### `this.jump(e)`

页面跳转。配合 `data-page` / `data-params`：

```html
<view bindtap="jump" data-page="pages/user-profile/user-profile" data-params="id=123">查看用户</view>
```

等价于 `router.navigateTo('/pages/user-profile/user-profile?id=123')`。

#### `this.back(delta?)`

返回上一页。

```html
<view bindtap="back" data-delta="1">返回</view>
```

#### `this.showPreview(src)`

预览图片。

```html
<image bindtap="showPreview" data-src="{{item.url}}" src="{{item.thumb}}" />
```

#### `this.download(url, name?)`

下载文件到本地。

```javascript
this.download('https://example.com/file.pdf', 'document.pdf');
```

#### `this.setClipboard(text)`

复制到剪贴板。

```javascript
this.setClipboard('已复制的文本');
```

#### `this.toast(title, icon?)`

显示 toast。

```javascript
this.toast('保存成功', 'success');
this.toast('保存失败', 'error');
```

### 使用方式

页面/组件注册 plugin behavior 后即可使用：

```javascript
import createPage from '../pages-base';

createPage({
  // pages-base.js 自动注册 pluginMixin
  onTapUser(e) {
    this.jump(e);  // data-page 跳转
  },
});
```

## safearea（安全区）

`behaviors/safearea.js` 注入安全区信息。

### 注入的数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `this.data.menuInfo` | object | 胶囊菜单信息 `{ top, height, bottom }` |
| `this.data.windowInfo` | object | 窗口信息 `{ windowWidth, windowHeight, statusBarHeight, ... }` |
| `this.data.safeTop` | number | 顶部安全距离（rpx），可作为 `padding-top` |

### 在 WXML 中使用

```html
<view class="container" style="padding-top: {{safeTop}}rpx;">
  <!-- 内容 -->
</view>
```

### 在 JS 中使用

```javascript
const top = this.data.safeTop;
console.log('safe top', top, 'rpx');
```

## form（表单）

`behaviors/form.js` 注入表单处理方法。**默认不注册**，需在 `createPage` 中设置 `useForm: true`。

### 注入的方法

#### `this.inputChange(field, e)`

统一处理 input/textarea 的输入，更新 `data[field]`。

```html
<input value="{{form.name}}" bindinput="inputChange" data-field="form.name" />
```

```javascript
// 自动 setData({ 'form.name': e.detail.value })
```

支持嵌套路径 `data-field="form.user.name"`。

#### `this.pickerChange(field, rangeKey, e)`

处理 picker 选择。

```html
<picker mode="selector" range="{{cities}}" range-key="name" bindchange="pickerChange"
  data-field="form.city" data-range-key="name">
  <view>{{form.city.name || '请选择'}}</view>
</picker>
```

#### `this.uploadFile(options)`

上传文件到 OSS（封装 `wx.uploadFile`）。

```javascript
async onChooseImage() {
  const res = await wx.chooseImage({ count: 1 });
  const tempPath = res.tempFilePaths[0];

  const result = await this.uploadFile({
    url: 'https://api.example.com/upload',
    filePath: tempPath,
    name: 'file',
    formData: { type: 'avatar' },
  });
  // result: { url: 'https://cdn.example.com/xxx' }
}
```

#### `this.uploadSuccess(...)` / `this.uploadError(...)`

上传成功/失败的回调钩子（可被子类覆盖）。

#### `this.deleteFile(url)`

删除已上传文件。

```javascript
this.deleteFile('https://cdn.example.com/avatar/123.jpg');
```

## 自动注册

`pages-base.js` 和 `component-base.js` 已经自动注册 pluginMixin 和 safeareaMixin。formMixin 需要显式开启。

```javascript
import createPage from '../pages-base';

createPage({
  useForm: true,  // 显式开启 form
  useSafearea: true,  // 默认 true
});
```

## 自定义 Behavior

业务项目可以扩展自己的 behavior：

```javascript
// behaviors/share.js
import { Behavior } from './plugin';

export const shareMixin = Behavior({
  methods: {
    onShareAppMessage() {
      return {
        title: this.data.shareTitle || '分享标题',
        path: this.data.sharePath || '/pages/index/index',
      };
    },
  },
});
```

```javascript
// pages-base.js
import createPage from './behaviors/share';

createPage({
  // 自动包含 share behavior
});
```

## 下一步

- [核心组件](/native/components) — 6 个通用组件
- [页面基类](/native/overview#页面基类-pages-base-js) — `createPage` 详解
