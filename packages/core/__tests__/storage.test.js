// 在 storage 测试中模拟 wx 全局
const _store = new Map();
globalThis.wx = {
  getStorageSync: (k) => (_store.has(k) ? _store.get(k) : ''),
  setStorageSync: (k, v) => _store.set(k, v),
  removeStorageSync: (k) => _store.delete(k),
  clearStorageSync: () => _store.clear(),
  getStorageInfoSync: () => ({ keys: [..._store.keys()], currentSize: 0, limitSize: 0 }),
};

const { createStorage } = require('../src/storage.js');

describe('createStorage', () => {
  beforeEach(() => _store.clear());

  it('无 namespace 时直接存储', () => {
    const s = createStorage();
    s.set('key', 'value');
    expect(s.get('key')).toBe('value');
  });

  it('namespace 隔离', () => {
    const a = createStorage('user');
    const b = createStorage('order');
    a.set('id', 'A1');
    b.set('id', 'B1');
    expect(a.get('id')).toBe('A1');
    expect(b.get('id')).toBe('B1');
  });

  it('getJSON / setJSON 自动序列化', () => {
    const s = createStorage('test');
    s.setJSON('obj', { name: 'foo', count: 1 });
    expect(s.getJSON('obj')).toEqual({ name: 'foo', count: 1 });
  });

  it('get 不存在时返回 defaultValue', () => {
    const s = createStorage();
    expect(s.get('missing', 'fallback')).toBe('fallback');
  });

  it('remove 之后 get 返回 defaultValue', () => {
    const s = createStorage();
    s.set('k', 'v');
    s.remove('k');
    expect(s.get('k', null)).toBeNull();
  });
});
