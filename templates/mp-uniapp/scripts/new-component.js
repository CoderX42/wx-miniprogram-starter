#!/usr/bin/env node
/**
 * new-component.js — 快速创建新组件
 *
 * 用法：node scripts/new-component.js <component-name> [--use-form] [--use-safearea]
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

const dir = resolve(root, 'src/components', name);
if (existsSync(dir)) {
  console.error(`[new-component] dir already exists: ${dir}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const mixins = [];
if (useForm) mixins.push("import formMixin from '@/mixins/form'");
if (useSafearea) mixins.push("import safeareaMixin from '@/mixins/safearea'");
const importBlock = mixins.length ? mixins.join(';\n') + ';\n' : '';
const mixinsArray = mixins.length ? `  mixins: [${mixins.map((m) => m.split(' ')[1]).join(', ')}],\n` : '';

writeFileSync(resolve(dir, `${name}.vue`), `<template>
  <view class="${name}">
    <slot></slot>
  </view>
</template>

<script>
${importBlock}export default {
  name: '${name}',${mixinsArray.replace(/^  /, '').includes('mixins') ? '\n  ' + mixinsArray : ''}
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.${name} {
  /* 在此编写组件样式 */
}
</style>
`);

console.log(`[new-component] created ${name} at ${dir}`);
