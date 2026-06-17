const createPage = require('../../pages-base');

createPage({
  data: {
    list: [
      { id: 'demo-api', title: 'API 调用示例', desc: '演示如何用 HttpClient 发起请求' },
      { id: 'demo-components', title: '核心组件示例', desc: '展示 6 个核心组件的使用' },
      { id: 'demo-form', title: '表单示例', desc: '演示 form behavior 的 inputChange / pickerChange' },
    ],
  },
  onLoad() {
    this.toast('欢迎使用模板');
  },
  jumpTo(e) {
    const { page } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/${page}/${page}` });
  },
});
