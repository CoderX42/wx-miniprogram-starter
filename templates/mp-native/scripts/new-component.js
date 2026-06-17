#!/usr/bin/env node
/**
 * new-component.js — 快速创建新组件
 *
 * 用法：node scripts/new-component.js <component-name> [--use-form] [--use-safearea]
 * 例：  node scripts/new-component.js my-button --use-safearea
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/new-component.js <component-name> [--use-form] [--use-safearea]');
  process.exit(1);
}

const name = args[0].replace(/\/$/, '');
const useForm = args.includes('--use-form');
const useSafearea = args.includes('--use-safearea');

const dir = resolve(root, 'miniprogram/components', name);
if (existsSync(dir)) {
  console.error(`[new-component] dir already exists: ${dir}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const behaviors = [];
if (useForm) behaviors.push('form');
if (useSafearea) behaviors.push('safearea');
const behaviorsStr = behaviors.length ? `\n  behaviors: [${behaviors.map((b) => `require('../../behaviors/${b}')`).join(', ')}],` : '';

writeFileSync(resolve(dir, `${name}.js`), `const createComponent = require('../../component-base');

createComponent({${behaviorsStr}
  properties: {},
  data: {},
  methods: {},
});
`);

writeFileSync(resolve(dir, `${name}.json`), `{
  "component": true,
  "usingComponents": {}
}
`);

writeFileSync(resolve(dir, `${name}.wxml`), `<view class="${name}">
  <!-- 在此编写组件模板 -->
  <slot></slot>
</view>
`);

writeFileSync(resolve(dir, `${name}.wxss`), `.${name} {
  /* 在此编写组件样式 */
}
`);

console.log(`[new-component] created ${name} at ${dir}`);
console.log('[new-component] usage: <' + name + ' />');
