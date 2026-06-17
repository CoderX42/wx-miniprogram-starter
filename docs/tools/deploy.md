# 部署脚本

本文档说明 wx-miniprogram-starter 派生项目的部署流程。

## 部署目标

小程序发布流程与 Web 不同，**没有「上传到服务器」这一步**。但有几个相关步骤：

1. **代码上传到微信后台**（用微信开发者工具）
2. **提交审核**
3. **发布上线**

骨架提供的 `deploy.sh` 主要用于：
- 上传静态资源到 CDN（图片、字体）
- 上传 H5 版本（如有）

## 部署脚本

`templates/mp-native/scripts/deploy.sh`：

```bash
#!/bin/bash
set -e

ENV=${1:-trial}

case "$ENV" in
  trial)
    SERVER="user@trial-server:/var/www/wx-app/"
    LOCAL_DIR="dist/"
    ;;
  prod)
    SERVER="user@prod-server:/var/www/wx-app/"
    LOCAL_DIR="dist/"
    ;;
  *)
    echo "Usage: $0 [trial|prod]"
    exit 1
    ;;
esac

echo "Deploying to $ENV..."
echo "  Local: $LOCAL_DIR"
echo "  Remote: $SERVER"

# 1. 打包
if [ -f "package.json" ] && grep -q "\"build\"" "package.json"; then
  echo "Building..."
  npm run build
fi

# 2. 上传
rsync -avz --delete "$LOCAL_DIR" "$SERVER"

# 3. 重启服务（如需要）
ssh "${SERVER%%:*}" "sudo systemctl reload nginx" || true

echo "Deploy complete!"
```

## H5 部署

如果你的项目支持 H5（uni-app），需要部署 H5 版本：

```bash
#!/bin/bash
set -e

ENV=${1:-trial}
SERVER=${DEPLOY_SERVER:-"user@server:/var/www/wx-h5/"}

# 1. 构建 H5
npm run build:h5

# 2. 上传到服务器
rsync -avz --delete dist/build/h5/ "$SERVER"

# 3. 重启 nginx
ssh "${SERVER%%:*}" "sudo systemctl reload nginx"
```

## CDN 资源部署

静态资源（图片、字体）单独部署到 CDN：

```bash
#!/bin/bash
set -e

# 1. 生成 cdn.js
node scripts/cdn-image.js

# 2. 上传图片到 CDN
rsync -avz images/ user@cdn-server:/var/www/wx/images/

# 3. （可选）清除 CDN 缓存
# curl -X POST https://cdn-api.example.com/purge -d '{"path": "/wx/"}'
```

## 上传到微信后台

小程序代码**不通过 deploy.sh 上传**，而是用微信开发者工具：

1. 微信开发者工具 → 右上角「上传」
2. 填写版本号和项目备注
3. 登录微信公众平台 → 版本管理 → 提交审核
4. 审核通过后 → 发布

**CI/CD 集成**：

可以用 `miniprogram-ci`（微信官方 CI 工具）实现自动化：

```bash
npm install miniprogram-ci --save-dev
```

```javascript
// scripts/ci-upload.js
import ci from 'miniprogram-ci';
import { readFileSync } from 'node:fs';

const project = new ci.Project({
  appid: 'wx1234567890abcdef',
  type: 'miniProgram',
  projectPath: './miniprogram',
  privateKeyPath: './private.key',
  ignores: ['node_modules/**/*'],
});

const result = await ci.upload({
  project,
  version: '1.0.0',
  desc: 'auto upload',
  setting: {
    es6: true,
    enhance: true,
    minify: true,
  },
});

console.log(result);
```

GitHub Actions 中：

```yaml
- name: Upload to WeChat
  run: |
    echo "${{ secrets.WECHAT_PRIVATE_KEY }}" > private.key
    node scripts/ci-upload.js
```

## 版本管理

每个环境的版本号管理：

| 环境 | 版本号格式 | 发布渠道 |
|------|----------|---------|
| dev | `1.0.0-dev.{commit}` | 微信开发者工具预览 |
| trial | `1.0.0-rc.{n}` | 体验版（扫码） |
| prod | `1.0.0` | 正式版 |

`package.json` 中维护：

```json
{
  "version": "1.0.0",
  "scripts": {
    "version:dev": "npm version prerelease --preid=dev",
    "version:trial": "npm version prerelease --preid=rc",
    "version:prod": "npm version minor"
  }
}
```

## 回滚

小程序回滚 = 在微信公众平台「版本管理」中切换到上一个已发布版本。

骨架不提供自动回滚脚本（操作有风险，需人工）。

## 多端发布

如果用 uni-app 同时支持多端：

| 端 | 工具 | 输出 |
|-----|------|------|
| 微信小程序 | `miniprogram-ci` upload | 微信后台 |
| 支付宝小程序 | 支付宝小程序 IDE | 支付宝后台 |
| H5 | `npm run build:h5` + rsync | Nginx 服务器 |
| Android | `npm run build:app-plus` + 云打包 | APK / AAB |
| iOS | `npm run build:app-plus` + 云打包 | IPA |

各端发布流程独立，deploy.sh 只覆盖 H5 和 CDN。

## 完整 CI/CD 示例

`.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy-trial:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install
        run: npm ci

      - name: Build H5
        run: npm run build:h5

      - name: Deploy to trial
        run: |
          echo "${{ secrets.DEPLOY_SSH_KEY }}" > /tmp/key
          chmod 600 /tmp/key
          rsync -avz --delete \
            -e "ssh -i /tmp/key" \
            dist/build/h5/ \
            ${{ secrets.TRIAL_SERVER }}

      - name: Upload WeChat trial
        run: |
          echo "${{ secrets.WECHAT_PRIVATE_KEY }}" > private.key
          node scripts/ci-upload.js --env trial

  deploy-prod:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: deploy-trial
    runs-on: ubuntu-latest
    environment: production
    steps:
      # ... 类似，但上传到 prod
```

## 下一步

- [原生模板 scripts](/native/scripts) — 完整脚本列表
- [CDN 多倍图](/tools/cdn-image) — CDN 部署
- [iconfont 同步](/tools/iconfont) — 字体同步
