const createComponent = require('../../component-base');

createComponent({
  properties: {
    text: { type: String, value: '网络异常，请稍后重试' },
    buttonText: { type: String, value: '重新加载' },
    showButton: { type: Boolean, value: true },
  },
  methods: {
    onRetry() {
      this.triggerEvent('retry');
    },
  },
});
