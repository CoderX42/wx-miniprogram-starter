// config/index.js — 环境配置聚合
// 根据当前 envVersion 选择 dev/trial/prod 配置

const { getEnv, isDev, isTrial } = require('@wx-starter/core');
const dev = require('./dev');
const trial = require('./trial');
const prod = require('./prod');

let cached = null;

function load() {
  if (cached) return cached;
  if (isDev()) cached = dev;
  else if (isTrial()) cached = trial;
  else cached = prod;
  return cached;
}

module.exports = load();
module.exports.load = load;
module.exports.env = getEnv();
