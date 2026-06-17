const createComponent = require('../../component-base');

createComponent({
  properties: {
    text: { type: String, value: '暂无数据' },
    image: { type: String, value: '' },
    buttonText: { type: String, value: '' },
  },
  methods: {
    onTap() {
      this.triggerEvent('click');
    },
  },
});
