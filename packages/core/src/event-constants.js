/**
 * 通用事件常量 — 业务无关的事件名约定
 *
 * 业务事件请在各项目内自行扩展，不在 core 中定义。
 */
export const BusEvent = Object.freeze({
  // HTTP 相关
  HTTP_STATUS_NOT_0: 'http:status:not0',
  HTTP_CODE_NOT_0: 'http:code:not0',
  HTTP_FAIL: 'http:fail',
  HTTP_TIMEOUT: 'http:timeout',

  // 鉴权相关
  AUTH_REQUIRED: 'auth:required',
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REFRESH: 'auth:refresh',
  AUTH_EXPIRED: 'auth:expired',

  // 主题/UI 相关
  THEME_CHANGED: 'theme:changed',
  NETWORK_CHANGED: 'network:changed',

  // 应用生命周期
  APP_FOREGROUND: 'app:foreground',
  APP_BACKGROUND: 'app:background',
});
