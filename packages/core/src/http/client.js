/**
 * HttpClient — 拦截器风格 HTTP 客户端
 *
 * 用法：
 *   const http = new HttpClient({ baseURL: 'https://api.example.com' })
 *   http.useRequest((config) => { config.header.token = 'xxx'; return config })
 *   http.useResponse((res) => { if (res.code !== 0) throw new Error(); return res })
 *   const data = await http.get('/user/profile', { id: 1 })
 */

import { createAdapter, createUploadAdapter, createDownloadAdapter } from './adapter.js';
import { BusEvent } from '../event-constants.js';
import emitter from '../emitter-instance.js';

export class HttpClient {
  /**
   * @param {Object} options
   * @param {string} [options.baseURL='']
   * @param {number} [options.timeout=20000]
   * @param {Object} [options.headers={}]
   * @param {Function} [options.request] - 自定义 request 函数
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL || '';
    this.timeout = options.timeout || 20000;
    this.headers = options.headers || {};
    this._requestInterceptors = [];
    this._responseInterceptors = [];
    this._errorInterceptors = [];
    this._adapter = createAdapter(options.request);
  }

  /**
   * 添加请求拦截器
   * 拦截器签名：(config) => config | Promise<config>
   */
  useRequest(fn) {
    this._requestInterceptors.push(fn);
    return this;
  }

  /**
   * 添加响应拦截器
   * 拦截器签名：(data, fullRes) => data | Promise<data>
   */
  useResponse(fn) {
    this._responseInterceptors.push(fn);
    return this;
  }

  /**
   * 添加错误拦截器
   * 拦截器签名：(err) => err | Promise<err> | 抛错
   */
  useError(fn) {
    this._errorInterceptors.push(fn);
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  removeHeader(key) {
    delete this.headers[key];
  }

  getHeader(key) {
    return this.headers[key];
  }

  /**
   * 通用请求
   * @param {Object} config
   * @returns {Promise<any>}
   */
  async request(config) {
    const finalConfig = {
      method: 'GET',
      ...config,
      header: { ...this.headers, ...(config.header || {}) },
    };

    // 应用请求拦截器
    let processed = finalConfig;
    for (const fn of this._requestInterceptors) {
      processed = await fn(processed) || processed;
    }

    const url = processed.url.startsWith('http')
      ? processed.url
      : `${this.baseURL}${processed.url}`;

    const start = Date.now();
    let fullRes;
    try {
      fullRes = await this._adapter({
        url,
        method: processed.method,
        data: processed.data,
        header: processed.header,
        timeout: processed.timeout || this.timeout,
      });
    } catch (err) {
      // 应用错误拦截器
      let e = err;
      for (const fn of this._errorInterceptors) {
        e = (await fn(e)) || e;
      }
      emitter.emit(BusEvent.HTTP_FAIL, e);
      throw e;
    }

    // 应用响应拦截器
    let data = fullRes.data;
    for (const fn of this._responseInterceptors) {
      data = (await fn(data, fullRes)) ?? data;
    }

    // 默认业务码检查
    if (data && typeof data === 'object' && 'code' in data && data.code !== 0) {
      emitter.emit(BusEvent.HTTP_CODE_NOT_0, { data, fullRes });
    }

    // 最小化日志
    if (processed.meta?.log !== false) {
      const cost = Date.now() - start;
      // eslint-disable-next-line no-console
      console.log(`[http] ${processed.method} ${url} ${cost}ms`);
    }

    return data;
  }

  get(url, params = {}, options = {}) {
    return this.request({ url, method: 'GET', data: params, ...options });
  }

  post(url, data = {}, options = {}) {
    return this.request({ url, method: 'POST', data, ...options });
  }

  put(url, data = {}, options = {}) {
    return this.request({ url, method: 'PUT', data, ...options });
  }

  delete(url, options = {}) {
    return this.request({ url, method: 'DELETE', ...options });
  }

  /**
   * 文件上传
   * @param {string} url
   * @param {string} filePath
   * @param {Object} [formData={}]
   * @param {Object} [options={}]
   * @returns {Promise<Object>} { data, fullRes }
   */
  upload(url, filePath, formData = {}, options = {}) {
    const fn = createUploadAdapter();
    if (!fn) return Promise.reject(new Error('upload not supported'));

    const finalUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    return new Promise((resolve, reject) => {
      fn({
        url: finalUrl,
        filePath,
        name: options.name || 'file',
        formData,
        header: { ...this.headers, ...(options.header || {}) },
        timeout: options.timeout || this.timeout,
        success: (res) => {
          const data = typeof res.data === 'string' ? safeJsonParse(res.data) : res.data;
          resolve({ data, fullRes: res });
        },
        fail: (err) => {
          emitter.emit(BusEvent.HTTP_FAIL, err);
          reject(err);
        },
      });
    });
  }

  /**
   * 文件下载
   */
  download(url, options = {}) {
    const fn = createDownloadAdapter();
    if (!fn) return Promise.reject(new Error('download not supported'));

    const finalUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    return new Promise((resolve, reject) => {
      fn({
        url: finalUrl,
        header: { ...this.headers, ...(options.header || {}) },
        timeout: options.timeout || this.timeout,
        success: (res) => resolve(res),
        fail: (err) => {
          emitter.emit(BusEvent.HTTP_FAIL, err);
          reject(err);
        },
      });
    });
  }
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
