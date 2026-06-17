const createComponent = require('../../component-base');

createComponent({
  properties: {
    text: { type: String, value: '加载中...' },
    type: { type: String, value: 'inline' }, // 'inline' | 'page'
  },
});
