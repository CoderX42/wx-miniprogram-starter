<template>
  <view v-if="show" class="popup-root" :style="{ zIndex }">
    <view v-if="mask" class="popup-mask" @tap="onMaskTap" />
    <view class="popup-content" :class="`popup-${position}`">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    show: { type: Boolean, default: false },
    position: { type: String, default: 'center' },
    mask: { type: Boolean, default: true },
    maskClose: { type: Boolean, default: true },
    zIndex: { type: Number, default: 1000 },
  },
  methods: {
    onMaskTap() {
      if (this.maskClose) this.onClose();
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease both;
}
.popup-content {
  position: absolute;
  background: $color-bg-card;
  display: flex;
  flex-direction: column;
}
.popup-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: $radius-md;
  min-width: 560rpx;
  max-width: 80vw;
  max-height: 80vh;
  animation: scaleIn 0.2s ease both;
}
.popup-top {
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 $radius-md $radius-md;
  animation: fadeInDown 0.3s ease both;
}
.popup-bottom {
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: $radius-md $radius-md 0 0;
  animation: fadeInUp 0.3s ease both;
}
.popup-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 80vw;
  animation: fadeIn 0.3s ease both;
}
.popup-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 80vw;
  animation: fadeIn 0.3s ease both;
}
</style>
