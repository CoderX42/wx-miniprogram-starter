<template>
  <view class="container">
    <page-title title="核心组件示例" :back="true" />

    <view class="section">
      <view class="section-title">Loading</view>
      <view class="card">
        <loading v-if="loading" type="page" text="加载中..." />
        <view v-else>已加载完成</view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">Empty</view>
      <view class="card">
        <empty
          v-if="showEmpty"
          text="还没有任何数据"
          button-text="点我试试"
          @click="onEmptyClick"
        />
        <view v-else class="muted">空态已隐藏</view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">Error Block</view>
      <view class="card">
        <error-block v-if="showError" @retry="onErrorRetry" />
        <view v-else class="muted">未触发</view>
        <view class="btn mt-16" @tap="showErrorBlock">触发错误</view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">Popup</view>
      <view class="card">
        <view class="btn" @tap="showPopup = true">打开弹窗</view>
      </view>
    </view>

    <popup :show="showPopup" position="center" @close="showPopup = false">
      <view class="popup-inner">
        <view class="popup-title">标题</view>
        <view class="popup-text">这是一个通用弹窗，支持 5 个方向。</view>
        <view class="btn mt-16" @tap="showPopup = false">关闭</view>
      </view>
    </popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      showEmpty: true,
      showError: false,
      showPopup: false,
    };
  },
  onLoad() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {
    onEmptyClick() {
      this.$toast('点击了空态按钮');
    },
    onErrorRetry() {
      this.$toast('点击了重试');
      this.showError = false;
    },
    showErrorBlock() {
      this.showError = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 24rpx;
}
.section {
  margin-bottom: 32rpx;
}
.section-title {
  font-family: 'PFS';
  font-size: $font-base;
  color: $color-text-primary;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  border-left: 6rpx solid $color-primary;
}
.card {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: 24rpx;
  font-family: 'PFR';
  font-size: $font-sm;
  color: $color-text-secondary;
}
.muted {
  color: $color-text-tertiary;
  font-family: 'PFR';
  font-size: $font-sm;
}
.btn {
  display: inline-block;
  padding: 16rpx 32rpx;
  background: $color-primary;
  color: $color-text-inverse;
  border-radius: $radius-md;
  text-align: center;
  font-family: 'PFM';
  font-size: $font-sm;
}
.mt-16 {
  margin-top: 16rpx;
}
.popup-inner {
  padding: 48rpx 32rpx;
  text-align: center;
  min-width: 560rpx;
}
.popup-title {
  font-family: 'PFS';
  font-size: $font-lg;
  margin-bottom: 24rpx;
}
.popup-text {
  font-family: 'PFR';
  font-size: $font-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}
</style>
