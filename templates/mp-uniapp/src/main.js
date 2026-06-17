import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { emitter, BusEvent, configureEnv } from '@wx-starter/core';
import pluginMixin from './mixins/plugin';
import { http } from './utils/http';
import config from './config';
import App from './App.vue';

if (typeof uni !== 'undefined' && uni.getAccountInfoSync) {
  configureEnv({ getAccountInfoSync: () => uni.getAccountInfoSync() });
}

http.init(config);

export function createApp() {
  const app = createSSRApp(App);
  app.use(createPinia());
  app.mixin(pluginMixin);
  app.config.globalProperties.$api = null; // 由 store / mixin 注入
  app.config.globalProperties.$emitter = emitter;
  app.config.globalProperties.$busEvent = BusEvent;
  return { app };
}
