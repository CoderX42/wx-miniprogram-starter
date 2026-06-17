<template>
  <view class="container">
    <page-title title="模板演示" :back="false" />

    <view class="header">
      <view class="title">wx-miniprogram-starter</view>
      <view class="subtitle">uni-app + Vue 3 模板演示</view>
    </view>

    <view class="list">
      <view
        v-for="item in list"
        :key="item.id"
        class="list-item"
        @tap="jumpTo(item.id)"
      >
        <view class="list-content">
          <view class="list-title">{{ item.title }}</view>
          <view class="list-desc">{{ item.desc }}</view>
        </view>
        <view class="list-arrow">›</view>
      </view>
    </view>

    <view class="footer">
      <text>core lib + uni-app template</text>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      list: [
        { id: 'demo-api', title: 'API 调用示例', desc: '演示如何用 HttpClient 发起请求' },
        { id: 'demo-components', title: '核心组件示例', desc: '展示 6 个核心组件的使用' },
        { id: 'demo-form', title: '表单示例', desc: '演示 form mixin 的使用' },
      ],
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  onLoad() {
    uni.showToast({ title: `欢迎，${this.userStore.displayName}`, icon: 'none' });
  },
  methods: {
    jumpTo(page) {
      uni.navigateTo({ url: `/pages/${page}/${page}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 24rpx;
}
.header {
  text-align: center;
  padding: 80rpx 0 60rpx;
}
.title {
  font-family: 'PFS';
  font-size: 56rpx;
  color: $color-primary;
  margin-bottom: 16rpx;
}
.subtitle {
  font-family: 'PFR';
  font-size: $font-sm;
  color: $color-text-tertiary;
}
.list {
  background: $color-bg-card;
  border-radius: $radius-md;
  overflow: hidden;
}
.list-item {
  display: flex;
  align-items: center;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid $color-border-light;
}
.list-item:last-child {
  border-bottom: none;
}
.list-content {
  flex: 1;
}
.list-title {
  font-family: 'PFM';
  font-size: $font-base;
  color: $color-text-primary;
}
.list-desc {
  font-family: 'PFR';
  font-size: $font-sm;
  color: $color-text-tertiary;
  margin-top: 8rpx;
}
.list-arrow {
  color: $color-text-tertiary;
  font-size: 36rpx;
}
.footer {
  text-align: center;
  padding: 60rpx 0;
  font-family: 'PFL';
  font-size: $font-xs;
  color: $color-text-tertiary;
}
</style>
