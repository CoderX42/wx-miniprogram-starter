/**
 * Auth — 登录态基类
 *
 * 提供 token 管理 + ensureLogin() 钩子
 * 业务方继承此类并实现 doLogin()（通常调用 wx.login + 后端 code2Session）
 *
 * 用法：
 *   class AppAuth extends Auth {
 *     async doLogin() {
 *       const { code } = await wx.login()
 *       const { token, userInfo } = await http.post('/session/login', { code })
 *       return { token, userInfo }
 *     }
 *   }
 *   const auth = new AppAuth({ tokenKey: 'token', userInfoKey: 'user' })
 *   await auth.ensureLogin()
 *   auth.getToken() // 'xxx'
 */

import { createStorage } from './storage.js';
import { BusEvent } from './event-constants.js';
import emitter from './emitter-instance.js';

export class Auth {
  /**
   * @param {Object} options
   * @param {string} [options.tokenKey='token']
   * @param {string} [options.userInfoKey='userInfo']
   * @param {string} [options.namespace=''] - 存储命名空间
   * @param {Function} [options.doLogin] - 自定义登录实现 (this) => Promise<{token, userInfo}>
   */
  constructor(options = {}) {
    this.tokenKey = options.tokenKey || 'token';
    this.userInfoKey = options.userInfoKey || 'userInfo';
    this.doLogin = options.doLogin || (() => Promise.reject(new Error('doLogin not configured')));
    this._storage = createStorage(options.namespace || '');
    this._loginPromise = null;
  }

  isLoggedIn() {
    return !!this._storage.get(this.tokenKey);
  }

  getToken() {
    return this._storage.get(this.tokenKey) || '';
  }

  setToken(token) {
    this._storage.set(this.tokenKey, token);
    emitter.emit(BusEvent.AUTH_LOGIN, { token });
  }

  getUserInfo() {
    return this._storage.getJSON(this.userInfoKey);
  }

  setUserInfo(info) {
    this._storage.setJSON(this.userInfoKey, info);
  }

  clear() {
    const hadToken = this.isLoggedIn();
    this._storage.remove(this.tokenKey);
    this._storage.remove(this.userInfoKey);
    if (hadToken) emitter.emit(BusEvent.AUTH_LOGOUT, null);
  }

  /**
   * 确保已登录 — 未登录自动调用 doLogin
   * 同一时刻并发调用只会触发一次 login
   */
  async ensureLogin(force = false) {
    if (!force && this.isLoggedIn()) return this.getUserInfo();
    if (this._loginPromise) return this._loginPromise;

    this._loginPromise = (async () => {
      try {
        const { token, userInfo } = await this.doLogin.call(this);
        if (token) this.setToken(token);
        if (userInfo) this.setUserInfo(userInfo);
        return userInfo;
      } catch (e) {
        emitter.emit(BusEvent.AUTH_REQUIRED, e);
        throw e;
      } finally {
        this._loginPromise = null;
      }
    })();

    return this._loginPromise;
  }
}
