const createPage = require('../../pages-base');

createPage({
  data: {
    loading: false,
    result: null,
    error: null,
  },
  async fetchUserInfo() {
    this.setData({ loading: true, error: null, result: null });
    try {
      const data = await this.api.user.info();
      this.setData({ loading: false, result: data });
      this.toast('请求成功');
    } catch (err) {
      this.setData({ loading: false, error: err.message || '请求失败' });
      this.toast('请求失败');
    }
  },
  async fetchWithTimeout() {
    this.setData({ loading: true, error: null });
    try {
      const data = await this.api.user.info({}, { timeout: 5000, fixedCost: true });
      this.setData({ loading: false, result: data });
    } catch (err) {
      this.setData({ loading: false, error: err.message });
    }
  },
  clear() {
    this.setData({ result: null, error: null });
  },
});
