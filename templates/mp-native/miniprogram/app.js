// app.js — 应用入口
const { emitter, BusEvent, configureEnv, createStorage, Auth } = require('@wx-starter/core');
const http = require('./utils/http');
const config = require('./config/index');

App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    theme: 'light',
  },

  onLaunch() {
    // 1. 配置环境
    if (typeof wx !== 'undefined' && wx.getAccountInfoSync) {
      configureEnv({ getAccountInfoSync: () => wx.getAccountInfoSync() });
    }

    // 2. 初始化 http + auth
    this.globalData.http = http.init(config);
    this.globalData.auth = new Auth({
      namespace: 'auth',
      doLogin: this._doLogin.bind(this),
    });

    // 3. 全局事件订阅
    emitter.on(BusEvent.AUTH_EXPIRED, () => {
      this.globalData.auth.clear();
      wx.showToast({ title: '登录已过期', icon: 'none' });
    });

    emitter.on(BusEvent.HTTP_FAIL, (err) => {
      if (err && err.errMsg && err.errMsg.includes('timeout')) {
        wx.showToast({ title: '网络超时', icon: 'none' });
      }
    });

    // 4. 获取系统信息
    this.globalData.systemInfo = wx.getSystemInfoSync();
  },

  onShow() {
    // 前后台切换
  },

  onHide() {
    emitter.emit(BusEvent.APP_BACKGROUND);
  },

  /**
   * 自定义登录实现 — 业务方替换为真实逻辑
   */
  async _doLogin() {
    const { code } = await wx.login();
    const res = await this.globalData.http.post('/session/login', { code });
    return { token: res.data?.token, userInfo: res.data?.userInfo };
  },
});
