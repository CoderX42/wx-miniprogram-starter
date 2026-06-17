<template>
  <view class="empty">
    <view class="empty-image">
      <image v-if="image" :src="image" mode="aspectFit" />
      <view v-else class="empty-icon" />
    </view>
    <view class="empty-text">{{ text }}</view>
    <view v-if="buttonText" class="empty-btn" @tap="onTap">{{ buttonText }}</view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: { type: String, default: '暂无数据' },
    image: { type: String, default: '' },
    buttonText: { type: String, default: '' },
  },
  methods: {
    onTap() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  color: $color-text-tertiary;
  font-family: 'PFR';
  font-size: $font-sm;
}
.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  image {
    width: 100%;
    height: 100%;
  }
}
.empty-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: $color-border-light;
  opacity: 0.5;
}
.empty-btn {
  margin-top: 16rpx;
  padding: 16rpx 48rpx;
  border-radius: $radius-full;
  background: $color-primary;
  color: $color-text-inverse;
  font-size: $font-sm;
  font-family: 'PFM';
}
</style>
