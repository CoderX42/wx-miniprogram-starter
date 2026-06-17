/**
 * 环境判断工具
 *
 * 在微信小程序和 uni-app 中获取当前环境。
 * 不依赖具体平台 API，通过传入的 platform 检测函数实现跨平台。
 */

let cachedEnv = null;

/**
 * 配置环境检测器（必须在使用 env 工具前调用）
 * @param {Object} config
 * @param {Function} config.getAccountInfoSync - 返回 { miniProgram: { envVersion } }
 * @param {string} [config.platform] - 手动指定平台 ('weixin' | 'alipay' | 'toutiao' | 'baidu' | 'h5' | 'app')
 */
export function configureEnv(config) {
  if (typeof config.getAccountInfoSync === 'function') {
    try {
      const info = config.getAccountInfoSync();
      cachedEnv = {
        envVersion: info?.miniProgram?.envVersion || 'release',
        platform: config.platform || detectPlatformFromGlobal(),
      };
    } catch (e) {
      cachedEnv = { envVersion: 'release', platform: config.platform || 'unknown' };
    }
  } else {
    cachedEnv = { envVersion: 'release', platform: config.platform || 'unknown' };
  }
}

/**
 * 尝试从全局对象检测平台（兼容 wx / uni / my / tt / swan）
 */
function detectPlatformFromGlobal() {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.wx) return 'weixin';
    if (globalThis.uni) return 'uni';
    if (globalThis.my) return 'alipay';
    if (globalThis.tt) return 'toutiao';
    if (globalThis.swan) return 'baidu';
  }
  return 'unknown';
}

/**
 * 获取当前环境信息
 */
export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = { envVersion: 'release', platform: detectPlatformFromGlobal() };
  }
  return cachedEnv;
}

export const isDev = () => getEnv().envVersion === 'develop';
export const isTrial = () => getEnv().envVersion === 'trial';
export const isRelease = () => getEnv().envVersion === 'release';
export const isTest = () => isDev() || isTrial();
export const isWeixin = () => getEnv().platform === 'weixin';
export const isUni = () => getEnv().platform === 'uni';
export const isAlipay = () => getEnv().platform === 'alipay';
export const isH5 = () => getEnv().platform === 'h5';
export const isApp = () => getEnv().platform === 'app';

/** 暴露给直接使用 wx.* API 的代码（向后兼容） */
export function getWx() {
  if (typeof globalThis !== 'undefined' && globalThis.wx) return globalThis.wx;
  if (typeof globalThis !== 'undefined' && globalThis.uni) return globalThis.uni;
  return null;
}
