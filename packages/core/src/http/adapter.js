/**
 * HTTP 适配器 — 把 wx.request / uni.request 统一为 Promise 接口
 *
 * 业务层无需关心平台差异。
 */

/**
 * 检测默认底层
 */
export function detectRequest() {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.wx?.request) return globalThis.wx.request;
    if (globalThis.uni?.request) return globalThis.uni.request;
  }
  return null;
}

/**
 * 创建适配器
 * @param {Function} requestFn - 可选，自定义 request 函数
 * @returns {Function} 适配后的 (options) => Promise
 */
export function createAdapter(requestFn) {
  const fn = requestFn || detectRequest();
  if (!fn) {
    return () => Promise.reject(new Error('No request function available'));
  }
  return (options) =>
    new Promise((resolve, reject) => {
      fn({
        ...options,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
}

/**
 * 适配上传
 */
export function createUploadAdapter() {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.wx?.uploadFile) return globalThis.wx.uploadFile;
    if (globalThis.uni?.uploadFile) return globalThis.uni.uploadFile;
  }
  return null;
}

/**
 * 适配下载
 */
export function createDownloadAdapter() {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.wx?.downloadFile) return globalThis.wx.downloadFile;
    if (globalThis.uni?.downloadFile) return globalThis.uni.downloadFile;
  }
  return null;
}
