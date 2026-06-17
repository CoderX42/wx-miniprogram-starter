// utils/http.js — HTTP 客户端实例化
import { HttpClient, emitter, BusEvent } from '@wx-starter/core';

let instance = null;

function init(config) {
  if (instance) return instance;

  instance = new HttpClient({
    baseURL: config.apiBase,
    timeout: 20000,
  });

  instance.useRequest((cfg) => {
    const token = uni.getStorageSync('auth:token');
    if (token) cfg.header.Authorization = `Bearer ${token}`;
    if (config.debug) console.log(`[http] ${cfg.method} ${cfg.url}`);
    return cfg;
  });

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

export const http = { init, getInstance };
export default http;
