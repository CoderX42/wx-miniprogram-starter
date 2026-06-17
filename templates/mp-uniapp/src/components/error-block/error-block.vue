<template>
  <view class="error-block">
    <view class="error-icon">!</view>
    <view class="error-text">{{ text }}</view>
    <view v-if="showButton" class="error-btn" @tap="onRetry">{{ buttonText }}</view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'ErrorBlock',
  props: {
    text: { type: String, default: '网络异常，请稍后重试' },
    buttonText: { type: String, default: '重新加载' },
    showButton: { type: Boolean, default: true },
  },
  methods: {
    onRetry() {
      this.$emit('retry');
    },
  },
};
</script>

<style lang="scss" scoped>
.error-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  color: $color-text-tertiary;
  font-family: 'PFR';
  font-size: $font-sm;
}
.error-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: $color-warning;
  color: $color-text-inverse;
  font-size: 60rpx;
  font-family: 'PFS';
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}
.error-btn {
  margin-top: 16rpx;
  padding: 16rpx 48rpx;
  border-radius: $radius-full;
  background: $color-primary;
  color: $color-text-inverse;
  font-size: $font-sm;
  font-family: 'PFM';
}
</style>
