/**
 * 存储抽象 — 命名空间 + JSON 序列化 + 同步/异步双 API
 *
 * 用法：
 *   const storage = createStorage('user')
 *   storage.set('profile', { name: 'foo' })  // 实际 key: "user:profile"
 *   storage.get('profile')  // { name: 'foo' }
 *
 * 在小程序和 uni-app 中底层使用 wx.getStorageSync / uni.getStorageSync。
 */

/**
 * 工厂函数：创建带命名空间的 storage 实例
 * @param {string} namespace - 命名空间前缀
 * @param {Object} [options]
 * @param {Object} [options.driver] - 底层驱动，默认使用 wx/uni
 * @returns {Object}
 */
export function createStorage(namespace = '', options = {}) {
  const driver = options.driver || defaultDriver();
  const ns = namespace ? `${namespace}:` : '';

  function key(k) {
    return ns + k;
  }

  return {
    namespace,

    get(k, defaultValue = null) {
      try {
        const raw = driver.getStorageSync(key(k));
        if (raw === '' || raw === undefined || raw === null) return defaultValue;
        return raw;
      } catch (e) {
        console.warn('[storage] get error:', e);
        return defaultValue;
      }
    },

    set(k, v) {
      try {
        driver.setStorageSync(key(k), v);
        return true;
      } catch (e) {
        console.warn('[storage] set error:', e);
        return false;
      }
    },

    remove(k) {
      try {
        driver.removeStorageSync(key(k));
        return true;
      } catch (e) {
        console.warn('[storage] remove error:', e);
        return false;
      }
    },

    clear() {
      try {
        driver.clearStorageSync();
        return true;
      } catch (e) {
        console.warn('[storage] clear error:', e);
        return false;
      }
    },

    getJSON(k, defaultValue = null) {
      const raw = this.get(k);
      if (raw === null || raw === undefined) return defaultValue;
      try {
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) {
        return defaultValue;
      }
    },

    setJSON(k, v) {
      return this.set(k, typeof v === 'string' ? v : JSON.stringify(v));
    },

    info() {
      try {
        return driver.getStorageInfoSync ? driver.getStorageInfoSync() : {};
      } catch (e) {
        return {};
      }
    },

    async getAsync(k, defaultValue = null) {
      try {
        const { data } = await driver.getStorage({ key: key(k) });
        return data === '' || data === undefined || data === null ? defaultValue : data;
      } catch (e) {
        return defaultValue;
      }
    },

    async setAsync(k, v) {
      try {
        await driver.setStorage({ key: key(k), data: v });
        return true;
      } catch (e) {
        return false;
      }
    },
  };
}

function defaultDriver() {
  if (typeof globalThis !== 'undefined' && globalThis.wx) {
    return globalThis.wx;
  }
  if (typeof globalThis !== 'undefined' && globalThis.uni) {
    return globalThis.uni;
  }
  // Node 测试环境 fallback
  return {
    getStorageSync: () => null,
    setStorageSync: () => undefined,
    removeStorageSync: () => undefined,
    clearStorageSync: () => undefined,
    getStorageInfoSync: () => ({}),
  };
}
