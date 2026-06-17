const createComponent = require('../../component-base');
const safeareaBehavior = require('../../behaviors/safearea');

createComponent({
  behaviors: [safeareaBehavior],
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    background: { type: String, value: '#ffffff' },
    color: { type: String, value: '#252525' },
  },
  methods: {
    onBack() {
      if (this.data.back) {
        this.back();
      } else {
        this.triggerEvent('back');
      }
    },
  },
});
