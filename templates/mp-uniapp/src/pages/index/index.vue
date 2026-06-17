<template>
  <view class="container">
    <page-title title="INDEX" :back="false" />

    <view class="meta-row">
      <text class="meta-no">No. 001 / 2026</text>
      <view class="meta-rule"></view>
      <text class="meta-tag">STARTER KIT</text>
    </view>

    <view class="display">
      <view class="display-line d-1">wx-mini</view>
      <view class="display-line d-2">program</view>
      <view class="display-line d-3">starter<text class="period">.</text></view>
    </view>

    <view class="intro">
      <view class="accent"></view>
      <view class="intro-body">
        <view class="intro-title">uni-app + Vue 3 模板演示</view>
        <view class="intro-meta">templates / mp-uniapp · wot-design-uni</view>
      </view>
    </view>

    <view class="rule"></view>

    <view class="nav" role="list" aria-label="演示页面导航">
      <view
        v-for="(item, i) in list"
        :key="item.id"
        class="nav-item"
        :class="`nav-item--${i + 1}`"
        :hover-class="'nav-item--active'"
        :hover-stay-time="80"
        role="listitem"
        :aria-label="`${item.title} — ${item.desc}`"
        @tap="jumpTo(item.id)"
      >
        <text class="nav-num">{{ item.no }}</text>
        <view class="nav-content">
          <view class="nav-title">{{ item.title }}</view>
          <view class="nav-desc">{{ item.desc }}</view>
        </view>
        <view class="nav-arrow">
          <view class="arrow-bar"></view>
          <view class="arrow-head"></view>
        </view>
      </view>
    </view>

    <view class="footer">
      <view class="rule rule--soft"></view>
      <view class="footer-row">
        <text class="footer-mark">core lib + uni-app template</text>
        <text class="footer-mark">v0.1.0 · © 2026</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      list: [
        { id: 'demo-api', no: '01', title: 'API 调用示例', desc: '演示 HttpClient 的请求与拦截' },
        { id: 'demo-components', no: '02', title: '核心组件示例', desc: '展示 6 个核心组件的使用' },
        { id: 'demo-form', no: '03', title: '表单示例', desc: 'form mixin · inputChange / pickerChange' },
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
/* 关键设计令牌（与 mp-native 的 tokens.wxss 对齐） */
$color-primary: #ea4e82;
$color-text-primary: #1f1f1f;
$color-text-secondary: #4d4d4d;
$color-text-tertiary: #707070;
$color-bg: #f7f8f8;
$color-border: #e5e5e5;
$color-border-light: #f2f2f2;

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(28rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.container {
  padding: 16rpx 40rpx 96rpx;
  min-height: 100vh;
  background:
    radial-gradient(120% 60% at 100% 0%, rgba(234, 78, 130, 0.04) 0%, transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #{$color-bg} 70%);
  display: flex;
  flex-direction: column;
}

.meta-row,
.display-line,
.intro,
.rule,
.nav-item,
.footer {
  opacity: 0;
  animation: rise 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 16rpx;
  margin-bottom: 56rpx;
  animation-delay: 0.05s;
}

.meta-no {
  font-family: 'PFM';
  font-size: 22rpx;
  letter-spacing: 4rpx;
  color: $color-text-primary;
}

.meta-rule {
  flex: 1;
  height: 1rpx;
  background: $color-border;
  transform-origin: left center;
  animation: draw 1.1s cubic-bezier(0.7, 0, 0.3, 1) 0.05s forwards;
}

.meta-tag {
  font-family: 'PFM';
  font-size: 20rpx;
  letter-spacing: 6rpx;
  color: $color-text-tertiary;
}

.display {
  margin-bottom: 56rpx;
}

.display-line {
  display: block;
  font-family: 'PFS';
  font-size: 112rpx;
  line-height: 1.05;
  letter-spacing: -2rpx;
  color: $color-text-primary;
}

.display-line.d-1 { animation-delay: 0.15s; }
.display-line.d-2 {
  animation-delay: 0.25s;
  padding-left: 12rpx;
  color: $color-text-secondary;
}
.display-line.d-3 {
  animation-delay: 0.35s;
  display: flex;
  align-items: flex-end;
}

.period {
  display: inline-block;
  font-size: 112rpx;
  line-height: 0.6;
  color: $color-primary;
  margin-left: 8rpx;
  transform: translateY(-12rpx);
}

.intro {
  display: flex;
  align-items: stretch;
  gap: 24rpx;
  margin-bottom: 32rpx;
  animation-delay: 0.45s;
}

.accent {
  width: 6rpx;
  background: $color-primary;
  border-radius: 3rpx;
}

.intro-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8rpx 0;
}

.intro-title {
  font-family: 'PFM';
  font-size: 32rpx;
  color: $color-text-primary;
  margin-bottom: 6rpx;
}

.intro-meta {
  font-family: 'PFR';
  font-size: 24rpx;
  color: $color-text-tertiary;
  letter-spacing: 1rpx;
}

.rule {
  height: 1rpx;
  background: $color-border;
  margin: 16rpx 0 12rpx;
  animation-delay: 0.55s;
}

.rule--soft {
  background: $color-border-light;
  margin: 32rpx 0 20rpx;
}

.nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 36rpx 12rpx;
  border-bottom: 1rpx solid $color-border-light;
  position: relative;
  transition: opacity 0.15s ease, background-color 0.2s ease;
}

.nav-item:last-child { border-bottom: none; }

.nav-item--1 { animation-delay: 0.65s; }
.nav-item--2 { animation-delay: 0.73s; }
.nav-item--3 { animation-delay: 0.81s; }

/* 按压反馈：仅用 opacity + 背景色变化，不改变布局位置 */
.nav-item--active {
  background: linear-gradient(90deg, rgba(234, 78, 130, 0.06) 0%, transparent 70%);
  opacity: 0.6;
}

.nav-num {
  font-family: 'PFM';
  font-size: 24rpx;
  letter-spacing: 2rpx;
  color: $color-text-tertiary;
  width: 64rpx;
  flex-shrink: 0;
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
}

.nav-title {
  font-family: 'PFM';
  font-size: 32rpx;
  color: $color-text-primary;
  letter-spacing: 0.5rpx;
}

.nav-desc {
  font-family: 'PFR';
  font-size: 24rpx;
  color: $color-text-tertiary;
}

.nav-arrow {
  display: flex;
  align-items: center;
  position: relative;
  width: 56rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.arrow-bar {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1rpx;
  background: $color-text-primary;
  transform: translateY(-0.5rpx);
  transition: width 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.3s ease;
}

.arrow-head {
  position: absolute;
  right: 0;
  top: 50%;
  width: 14rpx;
  height: 14rpx;
  border-top: 1rpx solid $color-text-primary;
  border-right: 1rpx solid $color-text-primary;
  transform: translate(0, -50%) rotate(45deg);
  transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.3s ease;
}

.nav-item--active .arrow-bar {
  background: $color-primary;
}

.nav-item--active .arrow-head {
  border-color: $color-primary;
  /* 不再做水平位移，避免按压时布局抖动；只保留颜色变化 */
  transform: translate(0, -50%) rotate(45deg);
}

.footer {
  margin-top: auto;
  padding-top: 8rpx;
  animation-delay: 0.92s;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rpx;
}

.footer-mark {
  font-family: 'PFR';
  font-size: 20rpx;
  letter-spacing: 1.5rpx;
  color: $color-text-tertiary;
}
</style>
