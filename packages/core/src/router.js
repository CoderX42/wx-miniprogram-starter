/**
 * 路由辅助 — 跨平台 navigateTo / redirectTo / switchTab 等
 *
 * 提供：
 * - 路径拼接、参数序列化
 * - 防重复跳转（200ms 节流）
 * - 类型安全的事件回调（虽然小程序本身无类型）
 */

const THROTTLE_MS = 200;
let lastNavAt = 0;

function getRouter() {
  if (typeof globalThis !== 'undefined' && globalThis.wx) return globalThis.wx;
  if (typeof globalThis !== 'undefined' && globalThis.uni) return globalThis.uni;
  return null;
}

/**
 * 路径拼接 — 对象转 query string
 * @param {string} path
 * @param {Object} [params]
 * @returns {string}
 */
export function buildPath(path, params = {}) {
  if (!params || Object.keys(params).length === 0) return path;
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

/**
 * 反向解析 query string 到对象
 */
export function parseQuery(queryString = '') {
  if (!queryString) return {};
  return queryString.replace(/^\?/, '').split('&').reduce((acc, seg) => {
    const [k, v = ''] = seg.split('=');
    if (k) acc[decodeURIComponent(k)] = decodeURIComponent(v);
    return acc;
  }, {});
}

function throttle() {
  const now = Date.now();
  if (now - lastNavAt < THROTTLE_MS) return false;
  lastNavAt = now;
  return true;
}

export function navigateTo(path, params = {}) {
  if (!throttle()) return Promise.reject(new Error('throttled'));
  const r = getRouter();
  if (!r) return Promise.reject(new Error('no router'));
  return new Promise((resolve, reject) => {
    r.navigateTo({ url: buildPath(path, params), success: resolve, fail: reject });
  });
}

export function redirectTo(path, params = {}) {
  if (!throttle()) return Promise.reject(new Error('throttled'));
  const r = getRouter();
  if (!r) return Promise.reject(new Error('no router'));
  return new Promise((resolve, reject) => {
    r.redirectTo({ url: buildPath(path, params), success: resolve, fail: reject });
  });
}

export function switchTab(path) {
  const r = getRouter();
  if (!r) return Promise.reject(new Error('no router'));
  return new Promise((resolve, reject) => {
    r.switchTab({ url: path, success: resolve, fail: reject });
  });
}

export function reLaunch(path, params = {}) {
  const r = getRouter();
  if (!r) return Promise.reject(new Error('no router'));
  return new Promise((resolve, reject) => {
    r.reLaunch({ url: buildPath(path, params), success: resolve, fail: reject });
  });
}

export function navigateBack(delta = 1) {
  const r = getRouter();
  if (!r) return Promise.reject(new Error('no router'));
  return new Promise((resolve, reject) => {
    r.navigateBack({ delta, success: resolve, fail: reject });
  });
}

/**
 * 获取当前页面栈
 */
export function getCurrentPages() {
  const r = getRouter();
  return r?.getCurrentPages ? r.getCurrentPages() : [];
}

/**
 * 获取当前页面
 */
export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1] || null;
}
