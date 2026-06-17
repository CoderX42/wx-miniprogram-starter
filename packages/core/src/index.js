/**
 * @wx-starter/core — 跨技术栈核心库主入口
 *
 * 模块组织：
 * - emitter        事件总线（单例 + 类）
 * - eventConstants 通用事件常量
 * - env            环境判断
 * - storage        存储抽象工厂
 * - auth           登录态基类
 * - router         路由辅助
 * - formatter      日期/金额/数字格式化
 * - validator      通用校验
 * - http           HTTP 客户端（HttpClient）
 */

// Emitter
export { EventEmitter } from './emitter.js';
export { default as emitter } from './emitter-instance.js';

// Event constants
export { BusEvent } from './event-constants.js';

// Env
export {
  configureEnv,
  getEnv,
  isDev,
  isTrial,
  isRelease,
  isTest,
  isWeixin,
  isUni,
  isAlipay,
  isH5,
  isApp,
  getWx,
} from './env.js';

// Storage
export { createStorage } from './storage.js';

// Auth
export { Auth } from './auth.js';

// Router
export {
  buildPath,
  parseQuery,
  navigateTo,
  redirectTo,
  switchTab,
  reLaunch,
  navigateBack,
  getCurrentPages,
  getCurrentPage,
} from './router.js';

// Formatter
export {
  parseDate,
  formatDate,
  formatDateOnly,
  formatMinute,
  formatMoney,
  formatNumber,
  formatShortNumber,
  timeAgo,
  maskPhone,
  maskName,
} from './formatter.js';

// Validator
export {
  required,
  isString,
  isNumber,
  isInteger,
  isBoolean,
  isArray,
  isObject,
  isPhone,
  isEmail,
  isIdCard,
  isUrl,
  isHttpUrl,
  inRange,
  lengthInRange,
  createValidator,
} from './validator.js';

// HTTP
export { HttpClient, createAdapter, detectRequest } from './http/index.js';
