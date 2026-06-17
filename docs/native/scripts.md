# 构建脚本

`templates/mp-native/scripts/` 提供 5 个脚本，覆盖日常开发流程。

## 列表

| 脚本 | 用途 |
|------|------|
| [new-page.js](#new-page-js) | 快速创建新页面 |
| [new-component.js](#new-component-js) | 快速创建新组件 |
| [cdn-image.js](#cdn-image-js) | 多倍图 CDN 映射生成 |
| [iconfont-sync.js](#iconfont-sync) | iconfont 同步 |
| [deploy.sh](#deploy) | 部署脚本 |

## new-page.js

快速创建一个新页面（4 个文件）。

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
miniprogram/pages/user-profile/
├── user-profile.js     # 逻辑
├── user-profile.json   # 配置
├── user-profile.wxml   # 模板
└── user-profile.wxss   # 样式
```

### 注册到 pages.json

创建后**需要手动**注册到 `app.json`：

```json
{
  "pages": [
    "pages/index/index",
    "pages/user-profile/user-profile"  // 新增
  ]
}
```

## new-component.js

快速创建一个新组件（4 个文件）。

### 用法

```bash
node scripts/new-component.js <component-name> [--use-form] [--use-safearea]
```

### 示例

```bash
# 基础组件
node scripts/new-component.js my-button

# 带 form + safearea
node scripts/new-component.js my-button --use-form --use-safearea
```

### 生成的文件

```
miniprogram/components/my-button/
├── my-button.js
├── my-button.json
├── my-button.wxml
└── my-button.wxss
```

### 注册

需要在使用的页面的 `xxx.json` 中注册：

```json
{
  "usingComponents": {
    "my-button": "/components/my-button/my-button"
  }
}
```

或者在 `app.json` 中全局注册：

```json
{
  "usingComponents": {
    "my-button": "/components/my-button/my-button"
  }
}
```

## cdn-image.js

扫描多倍图目录，生成 `cdn.js` 文件，提供按 pixelRatio 自动选图的映射。

### 背景

微信小程序的 `pixelRatio` 可能为 1 / 1.5 / 2 / 3。同一图标可能有多份：

```
icons/
├── close@1x.png
├── close@2x.png
├── close@3x.png
└── close@4x.png
```

CDN 部署时希望按设备选最合适的：

- `pixelRatio: 1` → `close@1x.png`
- `pixelRatio: 2` → `close@2x.png`
- `pixelRatio: 3` → `close@3x.png`

### 用法

```bash
node scripts/cdn-image.js [source-dir] [output-file]
```

默认：

```bash
node scripts/cdn-image.js
# 扫描 miniprogram/images/ → 生成 cdn.js
```

### 配置

在脚本顶部修改：

```javascript
const CONFIG = {
  sourceDir: 'miniprogram/images',     // 图片源目录
  outputFile: 'miniprogram/cdn.js',    // 生成的映射文件
  cdnBase: 'https://cdn.example.com/wx',
  resolutions: [1, 2, 3, 4],            // 支持的分辨率
};
```

### 生成的 cdn.js

```javascript
// cdn.js — 由 cdn-image.js 自动生成
export default {
  'icons/close': {
    1: 'https://cdn.example.com/wx/icons/close@1x.png',
    2: 'https://cdn.example.com/wx/icons/close@2x.png',
    3: 'https://cdn.example.com/wx/icons/close@3x.png',
  },
  // ...
};
```

### 在代码中使用

```javascript
// utils/filter.js
import cdn from '../cdn';
import { getSystemInfoSync } from './env';

const dpr = getSystemInfoSync().pixelRatio || 1;

export function cdnImage(name) {
  const map = cdn[name];
  if (!map) return '';
  return map[dpr] || map[3] || map[2] || map[1];
}
```

```html
<image src="{{cdnImage('icons/close')}}" />
```

### md5 去重

脚本会读取每个图片的 md5，跳过重复（不同文件名但内容相同的图片）。

## iconfont-sync

包装 `mini-program-iconfont-cli`，从 iconfont.cn 同步图标到小程序。

### 前置

```bash
npm install mini-program-iconfont-cli --save-dev
```

### 配置

在项目根创建 `iconfont.json`：

```json
{
  "symbol_url": "https://at.alicdn.com/t/font_xxxxxxx.js",
  "save_dir": "./miniprogram/styles/iconfont",
  "use_typescript": false
}
```

### 用法

```bash
# 一次性同步
node scripts/iconfont-sync.js

# 监听变化（开发时）
node scripts/iconfont-sync.js --watch
```

### 引用

在 `app.wxss` 中引入：

```css
@import './styles/iconfont/iconfont.wxss';
```

WXML 中使用：

```html
<text class="iconfont icon-close"></text>
```

## deploy.sh

部署脚本，rsync 上传到服务器。

### 用法

```bash
./scripts/deploy.sh [env]
```

### 示例

```bash
./scripts/deploy.sh trial
./scripts/deploy.sh prod
```

### 配置

修改脚本顶部的环境变量：

```bash
#!/bin/bash
set -e

ENV=${1:-trial}

case "$ENV" in
  trial)
    SERVER="user@trial-server:/var/www/wx-app/"
    ;;
  prod)
    SERVER="user@prod-server:/var/www/wx-app/"
    ;;
  *)
    echo "Unknown env: $ENV"
    exit 1
    ;;
esac

# 1. 打包
echo "Building..."
npm run build

# 2. 上传
echo "Deploying to $ENV..."
rsync -avz --delete dist/ "$SERVER"

echo "Done."
```

## 下一步

- [原生模板总览](/native/overview) — 完整结构
- [iconfont 工具](/tools/iconfont) — 详细使用
- [CDN 多倍图](/tools/cdn-image) — 详细原理
- [部署脚本](/tools/deploy) — 详细配置
