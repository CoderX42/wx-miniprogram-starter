<script>
import { emitter, BusEvent } from '@wx-starter/core';
import { useUserStore } from './store/user';

export default {
  onLaunch() {
    // 应用启动逻辑
    const userStore = useUserStore();
    userStore.restore();
  },
  onShow() {
    emitter.emit(BusEvent.APP_FOREGROUND);
  },
  onHide() {
    emitter.emit(BusEvent.APP_BACKGROUND);
  },
};
</script>

<style lang="scss">
@import './styles/tokens.scss';
@import './styles/animations.scss';

page {
  font-family: 'PFM';
  background-color: $color-bg;
  height: 100%;
  font-size: $font-base;
  color: $color-text-primary;
}
</style>
