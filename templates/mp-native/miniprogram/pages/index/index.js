const createPage = require('../../pages-base');

createPage({
  data: {
    list: [
      { id: 'demo-api', no: '01', title: 'API 调用示例', desc: '演示 HttpClient 的请求与拦截' },
      { id: 'demo-components', no: '02', title: '核心组件示例', desc: '展示 6 个核心组件的使用' },
      { id: 'demo-form', no: '03', title: '表单示例', desc: 'form behavior · inputChange / pickerChange' },
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
