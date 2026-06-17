// utils/http.js — HTTP 客户端实例化与拦截器配置
const { HttpClient, emitter, BusEvent } = require('@wx-starter/core');

let instance = null;

function init(config) {
  if (instance) return instance;

  instance = new HttpClient({
    baseURL: config.apiBase,
    timeout: 20000,
  });

  // 请求拦截：自动注入 token
  instance.useRequest((cfg) => {
    const token = wx.getStorageSync('auth:token');
    if (token) cfg.header.Authorization = `Bearer ${token}`;
    if (config.debug) console.log(`[http] ${cfg.method} ${cfg.url}`);
    return cfg;
  });

  // 响应拦截：业务码处理
  instance.useResponse((data) => {
    if (data && data.code === 401) {
      emitter.emit(BusEvent.AUTH_EXPIRED, data);
    }
    return data;
  });

  return instance;
}

function getInstance() {
  return instance;
}

module.exports = { init, getInstance };
