<template>
  <view class="safe-area" :style="{ background: bg }">
    <view v-if="top" class="safe-top" :style="{ height: safeTop + 'px' }" />
    <view class="safe-content">
      <slot></slot>
    </view>
    <view v-if="bottom" class="safe-bottom" :style="{ height: safeBottom + 'px' }" />
  </view>
</template>

<script>
export default {
  name: 'SafeArea',
  props: {
    top: { type: Boolean, default: true },
    bottom: { type: Boolean, default: true },
    bg: { type: String, default: 'transparent' },
  },
  data() {
    return { safeTop: 0, safeBottom: 0 };
  },
  mounted() {
    try {
      const sys = uni.getSystemInfoSync();
      this.safeTop = sys.safeArea?.top || sys.statusBarHeight || 0;
      this.safeBottom = sys.safeArea ? sys.screenHeight - sys.safeArea.bottom : 0;
    } catch (e) {}
  },
};
</script>

<style lang="scss" scoped>
.safe-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.safe-top,
.safe-bottom {
  flex-shrink: 0;
}
.safe-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
