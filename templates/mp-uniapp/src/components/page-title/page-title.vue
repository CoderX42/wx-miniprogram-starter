<template>
  <view
    class="page-title"
    :style="{ background, paddingTop: menuInfo.top + 'px', height: titleHeight + 'px' }"
  >
    <view v-if="back" class="back-btn" @tap="onBack">
      <view class="back-icon" />
    </view>
    <view class="title-text" :style="{ color }">{{ title }}</view>
    <slot></slot>
  </view>
  <view class="placeholder" :style="{ height: titleHeight + 'px' }" />
</template>

<script>
import safeareaMixin from '@/mixins/safearea';

export default {
  name: 'PageTitle',
  mixins: [safeareaMixin],
  props: {
    title: { type: String, default: '' },
    back: { type: Boolean, default: false },
    background: { type: String, default: '#ffffff' },
    color: { type: String, default: '#252525' },
  },
  computed: {
    titleHeight() {
      return (this.menuInfo.top || 0) + (this.menuInfo.height || 0);
    },
  },
  methods: {
    onBack() {
      if (this.back) {
        const pages = getCurrentPages();
        if (pages.length > 1) uni.navigateBack();
        else uni.reLaunch({ url: '/pages/index/index' });
      } else {
        this.$emit('back');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PFS';
  font-size: $font-lg;
}
.title-text {
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 100rpx;
}
.back-btn {
  position: absolute;
  left: 24rpx;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 60rpx;
  height: 100%;
  z-index: 1;
}
.back-icon {
  width: 20rpx;
  height: 20rpx;
  border-left: 3rpx solid currentColor;
  border-bottom: 3rpx solid currentColor;
  transform: rotate(45deg);
  margin-left: 10rpx;
}
.placeholder {
  width: 100%;
}
</style>
