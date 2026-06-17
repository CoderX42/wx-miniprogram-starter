<template>
  <view class="loading" :class="{ 'loading-page': type === 'page' }">
    <view class="loading-spinner" />
    <view v-if="text" class="loading-text">{{ text }}</view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: { type: String, default: '加载中...' },
    type: { type: String, default: 'inline' },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  color: $color-text-tertiary;
  font-family: 'PFR';
  font-size: $font-sm;
}
.loading-page {
  min-height: 60vh;
  flex-direction: column;
}
.loading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid $color-border;
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 16rpx;
}
.loading-page .loading-spinner {
  margin-right: 0;
  margin-bottom: 16rpx;
  width: 48rpx;
  height: 48rpx;
}
</style>
