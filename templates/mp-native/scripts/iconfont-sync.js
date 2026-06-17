#!/usr/bin/env node
/**
 * iconfont-sync.js — 包装 mini-program-iconfont-cli
 *
 * 用法：
 *   1. 在 iconfont 官网生成 iconfont.js / iconfont.css / iconfont.woff 等
 *   2. 把文件放到 miniprogram/iconfont/ 目录
 *   3. 运行 node scripts/iconfont-sync.js
 *
 * 实际同步操作使用 mini-program-iconfont-cli（在 package.json devDependencies 中）。
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const iconfontDir = resolve(root, 'miniprogram/iconfont');

console.log('[iconfont] syncing iconfont to', iconfontDir);

if (!existsSync(resolve(iconfontDir, 'iconfont.css'))) {
  console.warn('[iconfont] no iconfont.css found in', iconfontDir);
  console.warn('[iconfont] please download iconfont from https://www.iconfont.cn/ first');
  process.exit(0);
}

try {
  execSync(`npx iconfont-wechat --iconfont-url file://${iconfontDir}/iconfont.css`, {
    stdio: 'inherit',
    cwd: root,
  });
  console.log('[iconfont] sync done');
} catch (e) {
  console.error('[iconfont] sync failed:', e.message);
  process.exit(1);
}
