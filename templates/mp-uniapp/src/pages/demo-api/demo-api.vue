<template>
  <view class="container">
    <page-title title="API 调用示例" :back="true" />

    <view class="actions">
      <view class="btn" @tap="fetchUserInfo">调用 user.info</view>
      <view class="btn" @tap="fetchWithTimeout">调用（5s 超时）</view>
      <view class="btn btn-secondary" @tap="clear">清空</view>
    </view>

    <loading v-if="loading" type="page" text="加载中..." />

    <view v-else-if="error" class="result error">
      <view class="result-title">错误</view>
      <view class="result-content">{{ error }}</view>
    </view>

    <view v-else-if="result" class="result">
      <view class="result-title">响应数据</view>
      <view class="result-content">{{ JSON.stringify(result) }}</view>
    </view>

    <view v-else class="hint">
      <text>点击上方按钮发起请求</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      result: null,
      error: null,
    };
  },
  methods: {
    async fetchUserInfo() {
      this.loading = true;
      this.error = null;
      this.result = null;
      try {
        const data = await this.$api.user.info();
        this.result = data;
        this.$toast('请求成功');
      } catch (err) {
        this.error = err.message || '请求失败';
        this.$toast('请求失败');
      } finally {
        this.loading = false;
      }
    },
    async fetchWithTimeout() {
      this.loading = true;
      try {
        const data = await this.$api.user.info();
        this.result = data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    clear() {
      this.result = null;
      this.error = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 24rpx;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
}
.btn {
  padding: 24rpx 32rpx;
  background: $color-primary;
  color: $color-text-inverse;
  border-radius: $radius-md;
  text-align: center;
  font-family: 'PFM';
  font-size: $font-base;
}
.btn-secondary {
  background: $color-border-light;
  color: $color-text-primary;
}
.result {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: 24rpx;
}
.result.error {
  border: 1rpx solid $color-error;
}
.result-title {
  font-family: 'PFS';
  font-size: $font-base;
  margin-bottom: 16rpx;
}
.result.error .result-title {
  color: $color-error;
}
.result-content {
  font-family: 'PFR';
  font-size: $font-sm;
  word-break: break-all;
}
.hint {
  text-align: center;
  color: $color-text-tertiary;
  font-family: 'PFR';
  font-size: $font-sm;
  padding: 80rpx 32rpx;
}
</style>
