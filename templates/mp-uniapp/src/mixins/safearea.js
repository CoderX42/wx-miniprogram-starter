// mixins/safearea.js — 安全区
export default {
  data() {
    return {
      menuInfo: {},
      windowInfo: {},
      safeTop: 0,
    };
  },
  mounted() {
    try {
      this.menuInfo = uni.getMenuButtonBoundingClientRect();
      this.windowInfo = uni.getSystemInfoSync();
      const safeAreaTop = this.windowInfo.safeArea?.top || 0;
      this.safeTop =
        this.menuInfo.top + this.menuInfo.height + (this.menuInfo.top - safeAreaTop) + 10;
    } catch (e) {
      console.warn('[safearea] init error:', e);
    }
  },
};
