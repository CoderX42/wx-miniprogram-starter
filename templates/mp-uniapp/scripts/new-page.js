#!/usr/bin/env node
/**
 * new-page.js — 快速创建新页面
 *
 * 用法：node scripts/new-page.js <page-name> [--with-form]
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/new-page.js <page-name> [--with-form]');
  process.exit(1);
}

const pageName = args[0].replace(/^pages\//, '').replace(/\/$/, '');
const withForm = args.includes('--with-form');

const dir = resolve(root, 'src/pages', pageName);
if (existsSync(dir)) {
  console.error(`[new-page] dir already exists: ${dir}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const formImport = withForm ? "import formMixin from '@/mixins/form';\n" : '';
const mixinsLine = withForm ? '  mixins: [formMixin],\n' : '';

writeFileSync(resolve(dir, `${pageName}.vue`), `<template>
  <view class="container">
    <page-title title="${pageName}" :back="true" />
    <!-- 在此编写页面内容 -->
  </view>
</template>

<script>
${formImport}export default {
${mixinsLine}  data() {
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
`);

console.log(`[new-page] created ${pageName} at ${dir}`);
console.log('[new-page] don\'t forget to register the page in src/pages.json');
