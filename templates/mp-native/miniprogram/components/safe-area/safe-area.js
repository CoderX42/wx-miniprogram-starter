const createComponent = require('../../component-base');

createComponent({
  properties: {
    top: { type: Boolean, value: true },
    bottom: { type: Boolean, value: true },
    bg: { type: String, value: 'transparent' },
  },
  data: {
    safeTop: 0,
    safeBottom: 0,
  },
  lifetimes: {
    attached() {
      try {
        const sys = wx.getSystemInfoSync();
        this.setData({
          safeTop: sys.safeArea?.top || sys.statusBarHeight || 0,
          safeBottom: sys.safeArea
            ? sys.screenHeight - sys.safeArea.bottom
            : 0,
        });
      } catch (e) {}
    },
  },
});
