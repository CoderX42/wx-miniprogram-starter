// component-base.js — 组件基类
const pluginBehavior = require('./behaviors/plugin');
const { behavior } = require('miniprogram-computed');

function createComponent(options) {
  options.behaviors = [behavior, pluginBehavior].concat(options.behaviors || []);
  if (options.useForm) {
    options.behaviors.push(require('./behaviors/form'));
  }
  if (options.useSafearea) {
    options.behaviors.push(require('./behaviors/safearea'));
  }
  return Component(options);
}

module.exports = createComponent;
