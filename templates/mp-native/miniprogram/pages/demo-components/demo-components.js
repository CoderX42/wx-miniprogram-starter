const createPage = require('../../pages-base');

createPage({
  data: {
    showPopup: false,
    showEmpty: true,
    showError: false,
    list: [],
    loading: true,
  },
  onLoad() {
    // 模拟加载
    setTimeout(() => {
      this.setData({ loading: false, list: [1, 2, 3] });
    }, 1500);
  },
  togglePopup() {
    this.setData({ showPopup: !this.data.showPopup });
  },
  onPopupClose() {
    this.setData({ showPopup: false });
  },
  onEmptyClick() {
    this.toast('点击了空态按钮');
  },
  onErrorRetry() {
    this.toast('点击了重试');
    this.setData({ showError: false });
  },
  showErrorBlock() {
    this.setData({ showError: true });
  },
});
