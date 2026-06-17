/**
 * 事件总线 — EventEmitter
 *
 * 提供 on/off/once/emit/all/least/batch 等方法。
 * 在微信小程序和 uni-app 环境中作为跨页面/跨组件通信桥梁使用。
 *
 * 设计要点：
 * - 单实例模式（emitter-instance.js 导出全局单例）
 * - once（一次性订阅）、all（所有事件都触发才执行）、least（任一事件触发即执行一次）、batch（每个事件单独触发）
 * - 事件名可包含 : 作为命名空间
 * - 内部用 : 包裹事件名作为 key 存储
 */

const SEP = ':';

export class EventEmitter {
  constructor() {
    this._map = Object.create(null);
  }

  /**
   * 订阅事件
   * @param {string} evtName
   * @param {Function} cb
   * @returns {Function} 取消订阅
   */
  on(evtName, cb) {
    return this._subscribe(evtName, cb, 'on');
  }

  /**
   * 取消订阅
   */
  off(evtName, cb) {
    const key = this._key(evtName);
    const arr = this._map[key];
    if (!arr) return;
    const idx = arr.findIndex((it) => it.cb === cb);
    if (idx > -1) arr.splice(idx, 1);
  }

  /**
   * 一次性订阅
   */
  once(evtName, cb) {
    return this._subscribe(evtName, cb, 'once');
  }

  /**
   * 发布事件
   */
  emit(evtName, param) {
    const arr = this._map[this._key(evtName)];
    if (!arr) return;
    // 倒序遍历以便 splice 不影响索引
    for (let i = arr.length - 1; i >= 0; i--) {
      const item = arr[i];
      item.cb(param);
      if (item.type === 'once') {
        arr.splice(i, 1);
      }
    }
  }

  /**
   * 全部事件都触发才执行（一次后取消）
   * @param {string[]} evtNames
   * @param {Function} cb - 接收一个对象 { [evtName]: param }
   */
  all(evtNames, cb) {
    const collected = Object.create(null);
    const offFns = [];
    let remaining = evtNames.length;

    const onEach = (name) => (param) => {
      if (!(name in collected)) {
        collected[name] = param;
        remaining--;
        if (remaining === 0) {
          offFns.forEach((off) => off());
          cb(collected);
        }
      }
    };

    evtNames.forEach((name) => {
      offFns.push(this.on(name, onEach(name)));
    });

    return () => offFns.forEach((off) => off());
  }

  /**
   * 任一事件触发即执行（一次后取消）
   * @param {string[]} evtNames
   * @param {Function} cb - (evtName, param) => void
   */
  least(evtNames, cb) {
    const offFns = [];
    const onEach = (name) => (param) => {
      offFns.forEach((off) => off());
      cb(name, param);
    };

    evtNames.forEach((name) => {
      offFns.push(this.on(name, onEach(name)));
    });

    return () => offFns.forEach((off) => off());
  }

  /**
   * 每个事件都触发（独立触发，不互相干扰）
   * @param {string[]} evtNames
   * @param {Function} cb - (evtName, param) => void
   */
  batch(evtNames, cb) {
    const offFns = [];
    evtNames.forEach((name) => {
      offFns.push(this.on(name, (param) => cb(name, param)));
    });
    return () => offFns.forEach((off) => off());
  }

  /**
   * 移除所有订阅
   */
  clear() {
    this._map = Object.create(null);
  }

  _key(evtName) {
    return SEP + evtName + SEP;
  }

  _subscribe(evtName, cb, type) {
    const key = this._key(evtName);
    if (!this._map[key]) this._map[key] = [];
    this._map[key].push({ type, cb });
    return () => this.off(evtName, cb);
  }
}
