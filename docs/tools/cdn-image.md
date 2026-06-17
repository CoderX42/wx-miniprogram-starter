# CDN 多倍图

小程序运行在不同 `pixelRatio` 的设备上（1x / 2x / 3x / 4x）。同一图标通常需要多份图片，按设备自动选择。

## 背景

iPhone 12 Pro 的 pixelRatio = 3，意思是 1 个 CSS 像素 = 3 个物理像素。

如果你的图标是 24×24 设计稿：
- 在 1x 设备上 → 实际渲染 24 物理像素，清晰
- 在 2x 设备上 → 实际渲染 48 物理像素，原图模糊
- 在 3x 设备上 → 实际渲染 72 物理像素，原图更模糊

解决方案：为每种 pixelRatio 提供对应分辨率的图片。

## 文件命名

```
images/
├── close@1x.png        # 24×24
├── close@2x.png        # 48×48
├── close@3x.png        # 72×72
├── close@4x.png        # 96×96
├── search@1x.png
├── search@2x.png
└── search@3x.png
```

## 自动生成 cdn.js

`scripts/cdn-image.js` 扫描图片目录，生成 `cdn.js`：

```bash
cd templates/mp-native
node scripts/cdn-image.js
```

生成的 `cdn.js`：

```javascript
// cdn.js — 自动生成，请勿手改
export default {
  'icons/close': {
    1: 'https://cdn.example.com/wx/icons/close@1x.png',
    2: 'https://cdn.example.com/wx/icons/close@2x.png',
    3: 'https://cdn.example.com/wx/icons/close@3x.png',
  },
  'icons/search': {
    1: 'https://cdn.example.com/wx/icons/search@1x.png',
    2: 'https://cdn.example.com/wx/icons/search@2x.png',
    3: 'https://cdn.example.com/wx/icons/search@3x.png',
  },
};
```

## 在代码中使用

### 原生模板（filter.js）

```javascript
// utils/filter.js
import cdn from '../cdn';

let pixelRatio = 1;
try {
  pixelRatio = wx.getSystemInfoSync().pixelRatio || 1;
} catch (e) {}

export function cdnImage(name) {
  const map = cdn[name];
  if (!map) {
    console.warn(`[cdn] missing image: ${name}`);
    return '';
  }
  return map[pixelRatio] || map[3] || map[2] || map[1] || '';
}
```

WXML 中：

```html
<image src="{{cdnImage('icons/close')}}" />
```

### uni-app 模板

```javascript
// utils/image.js
import cdn from '@/cdn';

let pixelRatio = 1;
try {
  const info = uni.getSystemInfoSync();
  pixelRatio = info.pixelRatio || 1;
} catch (e) {}

export function cdnImage(name) {
  const map = cdn[name];
  if (!map) return '';
  return map[pixelRatio] || map[3] || map[2] || map[1] || '';
}
```

```vue
<template>
  <image :src="cdnImage('icons/close')" />
</template>

<script setup>
import { cdnImage } from '@/utils/image';
</script>
```

## md5 去重

如果 `close@1x.png` 和 `x@1x.png` 内容相同（不同名字但像素一样），脚本会跳过重复，只保留一份 CDN 资源。

```javascript
// cdn-image.js 内部
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

function md5(filePath) {
  return createHash('md5').update(readFileSync(filePath)).digest('hex');
}

const seen = new Map();

function getOrSkip(filePath, url) {
  const hash = md5(filePath);
  if (seen.has(hash)) return seen.get(hash);
  seen.set(hash, url);
  return url;
}
```

## 上传到 CDN

### 1. rsync 部署

```bash
rsync -avz images/ user@cdn-server:/var/www/wx/icons/
```

### 2. 七牛 / 阿里 OSS CLI

```bash
# 七牛
qshell batchupload /path/to/qiniu-config.json images/

# 阿里 OSS
ossutil cp -r images/ oss://my-bucket/wx/icons/
```

### 3. 部署脚本

`scripts/deploy.sh`：

```bash
#!/bin/bash
set -e

# 1. 生成 cdn.js
node scripts/cdn-image.js

# 2. 上传到 CDN
rsync -avz images/ user@cdn-server:/var/www/wx/icons/

echo "Done."
```

## 配置项

在 `scripts/cdn-image.js` 顶部：

```javascript
const CONFIG = {
  sourceDir: 'miniprogram/images',     // 图片源目录
  outputFile: 'miniprogram/cdn.js',    // 生成的映射文件
  cdnBase: 'https://cdn.example.com/wx',
  resolutions: [1, 2, 3, 4],           // 支持的分辨率
  skipDuplicates: true,                // md5 去重
};
```

## 最佳实践

### 只在必要时生成多倍图

不是所有图标都需要 4 份。判断标准：

- **小图标（< 48px）** — 需要 2x、3x，否则会模糊
- **大图 / banner** — 1x、2x 通常够用（体积权衡）
- **背景图** — 1x 即可（模糊也无感）

### 用 SVG 替代

简单图标优先用 SVG，矢量缩放：

```html
<image src="/icons/close.svg" />
```

小程序 SVG 支持有限（H5 完整支持），但 uni-app 在 h5 平台完全支持。

### 与 CDN hash 结合

生产环境通常用「内容哈希」做 CDN 缓存：

```javascript
// cdn.js（生成时）
'icons/close': {
  1: 'https://cdn.example.com/wx/icons/close.a1b2c3d4@1x.png',
  2: 'https://cdn.example.com/wx/icons/close.a1b2c3d4@2x.png',
}
```

避免图片更新后 CDN 返回旧文件。

## 下一步

- [iconfont 同步](/tools/iconfont) — 矢量图标
- [部署脚本](/tools/deploy) — CDN 上传
- [原生模板 scripts](/native/scripts#cdn-image-js) — 完整脚本
