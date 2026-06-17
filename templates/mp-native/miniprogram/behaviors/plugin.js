// behaviors/plugin.js — 核心 behavior
// 注入 this.api / this.emitter / this.event + 通用方法 (call/jump/back/showPreview/download/setClipboard)
const { emitter, BusEvent } = require('@wx-starter/core');
const api = require('../utils/api');

module.exports = Behavior({
  created() {
    this.api = api;
    this.emitter = emitter;
    this.event = BusEvent;
  },
  methods: {
    /** 拨打电话 — bindtap="call" data-phone="138..." */
    call(e) {
      const phone = e.currentTarget.dataset.phone;
      if (!phone) return;
      wx.makePhoneCall({ phoneNumber: phone });
    },

    /** 页面跳转 — bindtap="jump" data-page="pages/foo/foo" data-params="id=1" */
    jump(e) {
      const { page, params = '' } = e.currentTarget.dataset;
      if (!page) return;
      const url = params ? `/pages/${page}/${page.split('/').pop()}?${params}` : `/pages/${page}/${page.split('/').pop()}`;
      wx.navigateTo({ url });
    },

    /** 返回 */
    back() {
      const pages = getCurrentPages();
      if (pages.length > 1) wx.navigateBack();
      else wx.reLaunch({ url: '/pages/index/index' });
    },

    /** 预览图片 — bindtap="showPreview" data-src="..." */
    showPreview(e) {
      const src = e.currentTarget.dataset.src;
      if (!src) return;
      wx.previewImage({ urls: [src] });
    },

    /** 下载文件 */
    async download(e) {
      const url = e.currentTarget.dataset.download;
      if (!url) return;
      try {
        const path = await this.api.wx.download(url, true);
        wx.showToast({ title: '已下载', icon: 'success' });
        return path;
      } catch (err) {
        wx.showToast({ title: '下载失败', icon: 'none' });
      }
    },

    /** 复制到剪贴板 */
    setClipboard(e) {
      const text = e.currentTarget.dataset.clip;
      if (!text) return;
      wx.setClipboardData({ data: text });
    },

    /** Toast 快捷方式 */
    toast(title, icon = 'none') {
      wx.showToast({ title, icon });
    },
  },
});
