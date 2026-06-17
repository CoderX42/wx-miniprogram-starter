const createComponent = require('../../component-base');

createComponent({
  properties: {
    show: { type: Boolean, value: false },
    position: { type: String, value: 'center' }, // center / top / bottom / left / right
    mask: { type: Boolean, value: true },
    maskClose: { type: Boolean, value: true },
    zIndex: { type: Number, value: 1000 },
  },
  methods: {
    onMaskTap() {
      if (this.data.maskClose) this.onClose();
    },
    onClose() {
      this.triggerEvent('close');
    },
  },
});
