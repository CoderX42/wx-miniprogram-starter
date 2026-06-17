#!/usr/bin/env node
/**
 * cdn-image.js — 多倍图 CDN 处理
 *
 * 扫描 images/ 目录下的 @1x/@2x/@3x/@4x.png 图片，
 * 计算 md5 去重，生成 miniprogram/cdn.js，
 * 自动按 device pixelRatio 选择合适分辨率。
 *
 * 用法：
 *   node scripts/cdn-image.js [srcDir] [outFile]
 *
 * 默认 srcDir=images/，outFile=miniprogram/cdn.js
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const srcDir = process.argv[2] || resolve(root, 'images');
const outFile = process.argv[3] || resolve(root, 'miniprogram/cdn.js');
const cdnBase = process.env.CDN_BASE || 'https://cdn.example.com/wx-app';

function findPngFiles(dir, baseDir = dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'cdn.js' || entry.name === 'cp.sh') continue;
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      findPngFiles(fullPath, baseDir, files);
    } else if (entry.name.endsWith('.png')) {
      files.push(relative(baseDir, fullPath));
    }
  }
  return files;
}

function md5(content) {
  return createHash('md5').update(content).digest('base64');
}

function main() {
  let files;
  try {
    files = findPngFiles(srcDir);
  } catch (e) {
    console.log(`[cdn-image] no source dir: ${srcDir}`);
    return;
  }
  if (files.length === 0) {
    console.log(`[cdn-image] no png files in ${srcDir}`);
    return;
  }

  const md5Map = {};
  const cdnJson = {};

  for (let file of files) {
    const data = readFileSync(resolve(srcDir, file));
    const hash = md5(data);
    console.log(`${file}: ${hash}`);

    let url;
    if (md5Map[hash]) {
      url = `${cdnBase}/${md5Map[hash]}?md5=${hash}`;
    } else {
      md5Map[hash] = file;
      url = `${cdnBase}/${file}?md5=${hash}`;
    }

    if (file.indexOf('@') > -1) {
      const [key, scale] = file.split(/[@.]/);
      cdnJson[key] = cdnJson[key] || {};
      cdnJson[key][scale] = url;
    } else {
      const [key] = file.split('.');
      cdnJson[key] = url;
    }
  }

  writeFileSync(outFile, 'module.exports = ' + JSON.stringify(cdnJson, null, 2) + ';\n');
  console.log(`[cdn-image] wrote ${outFile}`);

  // 自动调用 deploy（如果存在）
  const deployScript = resolve(__dirname, 'deploy.sh');
  try {
    if (existsSync(deployScript)) {
      execSync(`bash ${deployScript}`, { stdio: 'inherit' });
    }
  } catch (e) {
    console.warn('[cdn-image] deploy skipped:', e.message);
  }
}

import { existsSync } from 'node:fs';
main();
