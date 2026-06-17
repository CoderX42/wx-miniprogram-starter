// pages-base.js — 页面基类
// 用法：const Page = require('../pages-base'); Page({ ... })
const pluginBehavior = require('./behaviors/plugin');
const { behavior } = require('miniprogram-computed');

/**
 * 创建页面
 * @param {Object} options - 页面配置
 * @param {string[]} [options.behaviors] - 额外 behaviors
 * @param {boolean} [options.useForm] - 注入 form behavior
 */
function createPage(options) {
  options.behaviors = [pluginBehavior, behavior].concat(options.behaviors || []);
  if (options.useForm) {
    options.behaviors.push(require('./behaviors/form'));
  }
  if (options.useSafearea) {
    options.behaviors.push(require('./behaviors/safearea'));
  }
  return Page(options);
}

module.exports = createPage;
