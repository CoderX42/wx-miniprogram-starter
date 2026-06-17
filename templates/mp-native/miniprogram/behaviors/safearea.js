// behaviors/safearea.js — 安全区 / 菜单信息
module.exports = Behavior({
  data: {
    menuInfo: {},
    windowInfo: {},
    safeTop: 0,
  },
  attached() {
    if (typeof wx === 'undefined') return;
    try {
      const menuInfo = wx.getMenuButtonBoundingClientRect();
      const windowInfo = wx.getSystemInfoSync();
      this.setData({
        menuInfo,
        windowInfo,
        safeTop: menuInfo.top + menuInfo.height + (menuInfo.top - (windowInfo.safeArea?.top || 0)) + 10,
      });
    } catch (e) {
      console.warn('[safearea] init error:', e);
    }
  },
});
