# iconfont 同步

iconfont 是阿里妈妈提供的图标管理平台。本文档说明如何在小程序中使用。

## 工作流程

```
iconfont.cn → 下载 symbol 引用 → mini-program-iconfont-cli → 生成 iconfont.wxss
                                                                    ↓
                                                          app.wxss @import
                                                                    ↓
                                                       WXML <text class="icon-xxx">
```

## 一次性配置

### 1. 安装 CLI

```bash
cd templates/mp-native
npm install mini-program-iconfont-cli --save-dev
```

### 2. 获取 symbol URL

在 iconfont.cn 项目中：

1. 进入「我的项目」
2. 选择「Symbol」方式
3. 复制生成的 JS URL

形如：

```
https://at.alicdn.com/t/font_xxxxxxx.js
```

### 3. 创建 iconfont.json

```json
{
  "symbol_url": "https://at.alicdn.com/t/font_xxxxxxx.js",
  "save_dir": "./miniprogram/styles/iconfont",
  "use_typescript": false
}
```

### 4. 创建同步脚本

`scripts/iconfont-sync.js`：

```javascript
#!/usr/bin/env node
import { spawn } from 'node:child_process';

const watch = process.argv.includes('--watch');

const args = watch ? ['iconfont-wechat', '--watch'] : ['iconfont-wechat'];
const child = spawn('npx', args, { stdio: 'inherit' });

child.on('error', (err) => {
  console.error('iconfont sync failed:', err);
  process.exit(1);
});
```

### 5. 引用到 app.wxss

```css
/* app.wxss */
@import './styles/iconfont/iconfont.wxss';
```

## 使用图标

WXML 中：

```html
<text class="iconfont icon-close"></text>
<text class="iconfont icon-search"></text>
<text class="iconfont icon-user"></text>
```

样式自定义：

```css
.icon-close {
  color: var(--color-text-secondary);
  font-size: 32rpx;
}
```

## 监听模式

开发时启用 `--watch`，自动同步：

```bash
node scripts/iconfont-sync.js --watch
```

每次 iconfont.cn 更新图标后，本地文件会自动同步。

## 平台差异

| 平台 | 推荐方式 |
|------|---------|
| 原生小程序 | iconfont（symbol） |
| uni-app | iconfont 或 [iconfont-css](https://www.npmjs.com/package/iconfont-css) |

uni-app 也可以直接用：

```bash
npm install iconfont-css --save
```

```vue
<template>
  <text class="iconfont icon-close"></text>
</template>

<style>
@import 'iconfont-css/iconfont.css';
</style>
```

## 注意事项

### symbol 方式 vs font-class 方式

| 方式 | 优点 | 缺点 |
|------|------|------|
| **symbol** | 支持多色图标、矢量缩放 | 需要 JS 运行时支持 |
| **font-class** | 简单、无需 JS | 不支持多色 |

小程序推荐 **symbol** 方式（多色支持 + 矢量缩放 + 兼容性）。

### 缓存清理

iconfont 偶尔有缓存问题（更新图标后页面没变化）：

```bash
# 清除 iconfont 缓存
rm -rf node_modules/.cache
rm -rf miniprogram/styles/iconfont/*

# 重新同步
node scripts/iconfont-sync.js
```

### 自托管字体文件

如果不想依赖 aliyun CDN：

```bash
# 1. 在 iconfont.cn 下载字体包
# 2. 解压到 miniprogram/styles/iconfont/

miniprogram/styles/iconfont/
├── iconfont.css
├── iconfont.eot
├── iconfont.ttf
├── iconfont.woff
└── iconfont.woff2
```

```css
/* app.wxss */
@import './styles/iconfont/iconfont.css';
```

## 多色图标

symbol 方式支持多色（实际上是小程序把 SVG 渲染为 image，需要 iconfont.cn 开启「彩色」选项）。

## 下一步

- [CDN 多倍图](/tools/cdn-image) — 图片资源处理
- [原生模板 scripts](/native/scripts#iconfont-sync) — 完整脚本
