// config/index.js — 根据环境选择配置
import { isDev, isTrial } from '@wx-starter/core';
import dev from './dev';
import trial from './trial';
import prod from './prod';

let cached = null;

function load() {
  if (cached) return cached;
  if (isDev()) cached = dev;
  else if (isTrial()) cached = trial;
  else cached = prod;
  return cached;
}

export default load();
export { load };
